#!/usr/bin/env node

import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

import { MatrixClient, MatrixError } from './client.mjs'

const BOOLEAN_OPTIONS = new Set(['help', 'json', 'public', 'private'])
const REPEATABLE_OPTIONS = new Set(['user', 'expect-user'])

export function parseCliArgs(argv) {
  const options = {}
  const positionals = []

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index]

    if (!token.startsWith('--')) {
      positionals.push(token)
      continue
    }

    const optionText = token.slice(2)
    const equalsIndex = optionText.indexOf('=')
    const rawKey =
      equalsIndex === -1 ? optionText : optionText.slice(0, equalsIndex)
    const key = camelCase(rawKey)
    let value =
      equalsIndex === -1 ? undefined : optionText.slice(equalsIndex + 1)

    if (value === undefined) {
      if (BOOLEAN_OPTIONS.has(rawKey)) {
        value = true
      } else if (argv[index + 1] && !argv[index + 1].startsWith('--')) {
        value = argv[index + 1]
        index += 1
      } else {
        value = true
      }
    }

    if (REPEATABLE_OPTIONS.has(rawKey)) {
      options[key] = [...(options[key] ?? []), value]
    } else {
      options[key] = value
    }
  }

  return {
    command: positionals,
    options,
  }
}

export function loadRuntimeConfig(options, env = process.env, cwd = process.cwd()) {
  const configPath = options.config || env.MATRIX_CONFIG
  const fileConfig = configPath ? readConfigFile(configPath, cwd) : {}

  return {
    homeserver: options.homeserver || env.MATRIX_HOMESERVER || fileConfig.homeserver,
    accessToken: env.MATRIX_ACCESS_TOKEN || fileConfig.accessToken,
    username:
      env.MATRIX_USERNAME || env.MATRIX_USER || fileConfig.username || fileConfig.user,
    password: env.MATRIX_PASSWORD || fileConfig.password,
    deviceId: env.MATRIX_DEVICE_ID || fileConfig.deviceId,
  }
}

export async function runCli({
  argv = process.argv.slice(2),
  env = process.env,
  cwd = process.cwd(),
  fetchImpl = globalThis.fetch,
  stdout = process.stdout,
  stderr = process.stderr,
} = {}) {
  const parsed = parseCliArgs(argv)
  const [scope, action] = parsed.command

  if (parsed.options.help || !scope) {
    stdout.write(helpText())
    return 0
  }

  const json = Boolean(parsed.options.json)

  try {
    const config = loadRuntimeConfig(parsed.options, env, cwd)
    const client = new MatrixClient({ ...config, fetchImpl })

    if (scope === 'whoami') {
      const whoami = await client.whoami()
      writeResult(stdout, json, whoami, () =>
        `Connected to ${client.homeserver} as ${whoami.user_id}${whoami.device_id ? ` (device ${whoami.device_id})` : ''}\n`
      )
      return 0
    }

    if (scope === 'rooms' && action === 'list') {
      const rooms = await client.listRooms()
      writeResult(stdout, json, rooms, () => formatRooms(rooms))
      return 0
    }

    if (scope === 'rooms' && action === 'create') {
      const visibility = resolveVisibility(parsed.options)
      const result = await client.createRoom({
        name: requireOption(parsed.options, 'name', '--name is required'),
        topic: parsed.options.topic,
        alias: parsed.options.alias,
        visibility,
      })
      writeResult(stdout, json, result, () =>
        `Created ${result.room_id}${result.room_alias ? ` (${result.room_alias})` : ''} as ${visibility}\n`
      )
      return 0
    }

    if (scope === 'rooms' && action === 'invite') {
      const roomId = requireOption(parsed.options, 'room', '--room is required')
      const userId = requireOption(parsed.options, 'user', '--user is required')
      const result = await client.inviteUser(roomId, userId)
      writeResult(stdout, json, result, () => `Invited ${userId} to ${roomId}\n`)
      return 0
    }

    if (scope === 'rooms' && action === 'join') {
      const roomIdOrAlias =
        parsed.options.room || parsed.command[2] || parsed.options.alias
      if (!roomIdOrAlias) {
        throw new Error('Provide a room ID or alias with --room or as an argument')
      }
      const result = await client.joinRoom(roomIdOrAlias)
      writeResult(stdout, json, result, () => `Joined ${result.room_id}\n`)
      return 0
    }

    if (scope === 'rooms' && action === 'verify') {
      const roomId = requireOption(parsed.options, 'room', '--room is required')
      const expectedUsers = [
        ...(arrayOption(parsed.options.user) ?? []),
        ...(arrayOption(parsed.options.expectUser) ?? []),
      ]
      const result = await client.verifyRoom({
        roomId,
        expectedUsers,
        elementUser: parsed.options.elementUser || parsed.options.viewer,
      })
      writeResult(stdout, json, result, () => formatVerification(result))
      return 0
    }

    if (scope === 'messages' && action === 'send') {
      const roomId = requireOption(parsed.options, 'room', '--room is required')
      const body = requireOption(parsed.options, 'body', '--body is required')
      const result = await client.sendMessage(roomId, body, parsed.options.txnId)
      writeResult(stdout, json, result, () =>
        `Sent message to ${roomId}: ${result.event_id}\n`
      )
      return 0
    }

    throw new Error(`Unknown command: ${parsed.command.join(' ')}`)
  } catch (error) {
    stderr.write(`${formatError(error)}\n`)
    return 1
  }
}

function readConfigFile(configPath, cwd) {
  const resolved = path.isAbsolute(configPath)
    ? configPath
    : path.resolve(cwd, configPath)
  const raw = fs.readFileSync(resolved, 'utf8')
  return JSON.parse(raw)
}

function requireOption(options, key, message) {
  const value = options[key]
  if (value === undefined || value === '') {
    throw new Error(message)
  }

  if (Array.isArray(value)) {
    return value.at(-1)
  }

  return value
}

function arrayOption(value) {
  if (value === undefined) {
    return []
  }

  return Array.isArray(value) ? value : [value]
}

function resolveVisibility(options) {
  if (options.public && options.private) {
    throw new Error('Use either --public or --private, not both')
  }

  return options.public ? 'public' : 'private'
}

function writeResult(stdout, json, payload, formatter) {
  if (json) {
    stdout.write(`${JSON.stringify(payload, null, 2)}\n`)
  } else {
    stdout.write(formatter())
  }
}

function formatRooms(rooms) {
  if (rooms.length === 0) {
    return 'No joined or invited rooms were returned by /sync.\n'
  }

  return [
    'membership  room_id                                name/alias',
    ...rooms.map((room) =>
      [
        room.membership.padEnd(10),
        room.roomId.padEnd(36),
        room.displayName,
      ].join('  ')
    ),
    '',
  ].join('\n')
}

function formatVerification(result) {
  const lines = [
    `Room: ${result.roomId}`,
    `Authenticated user: ${result.authenticatedUser}`,
    `Element viewer: ${result.elementUser}`,
    `Element should show room: ${result.elementShouldShow ? 'yes' : 'no'}`,
    result.elementReason,
    '',
    'membership  user',
    ...result.members.map((member) =>
      `${member.membership.padEnd(10)}  ${member.userId} - ${member.reason}`
    ),
    '',
  ]

  return lines.join('\n')
}

function formatError(error) {
  if (error instanceof MatrixError) {
    return `Error: ${error.message}`
  }

  return `Error: ${error.message}`
}

function camelCase(value) {
  return value.replace(/-([a-z])/g, (_match, char) => char.toUpperCase())
}

function helpText() {
  return `Omnigent Matrix Client-Server API CLI

Usage:
  pnpm matrix whoami [--json]
  pnpm matrix rooms list [--json]
  pnpm matrix rooms create --name "Room name" [--topic "..."] [--public|--private] [--alias localpart]
  pnpm matrix rooms invite --room "!room:server" --user "@user:server"
  pnpm matrix rooms join --room "!room:server"
  pnpm matrix messages send --room "!room:server" --body "hello"
  pnpm matrix rooms verify --room "!room:server" --user "@user:server" [--element-user "@human:server"]

Configuration:
  MATRIX_HOMESERVER=http://rocks-MacBook-Air.local:8008
  MATRIX_ACCESS_TOKEN=<token>

Optional one-shot login:
  MATRIX_USERNAME=@omnigent:server
  MATRIX_PASSWORD=<password>
  MATRIX_DEVICE_ID=OMNIGENT_CLI

Global options:
  --homeserver URL      Override MATRIX_HOMESERVER
  --config path         Read JSON config with homeserver/accessToken/username/password
  --json                Print machine-readable JSON
`
}

const invokedPath = process.argv[1]
if (
  invokedPath &&
  import.meta.url === pathToFileURL(path.resolve(invokedPath)).href
) {
  runCli().then((code) => {
    process.exitCode = code
  })
}
