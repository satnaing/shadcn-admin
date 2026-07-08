import { describe, expect, it, vi } from 'vitest'

import { buildMatrixUrl, MatrixClient } from './client.mjs'
import { loadRuntimeConfig, parseCliArgs, runCli } from './cli.mjs'

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json',
    },
  })
}

describe('Matrix URL construction', () => {
  it('normalizes the homeserver and encodes Matrix IDs as path segments', () => {
    expect(
      buildMatrixUrl(
        'http://rocks-MacBook-Air.local:8008/',
        ['rooms', '!room:rocks-MacBook-Air.local', 'send', 'm.room.message', 'txn/1'],
        { timeout: 0 }
      )
    ).toBe(
      'http://rocks-macbook-air.local:8008/_matrix/client/v3/rooms/%21room%3Arocks-MacBook-Air.local/send/m.room.message/txn%2F1?timeout=0'
    )
  })
})

describe('MatrixClient', () => {
  it('sends bearer auth without putting the token in the URL', async () => {
    const fetchImpl = vi.fn(async () =>
      jsonResponse({
        user_id: '@omnigent:server',
        device_id: 'OMNIGENT_CLI',
      })
    )
    const client = new MatrixClient({
      homeserver: 'http://server.local:8008',
      accessToken: 'secret-token',
      fetchImpl,
    })

    await client.whoami()

    const [url, init] = fetchImpl.mock.calls[0]
    expect(url).toBe(
      'http://server.local:8008/_matrix/client/v3/account/whoami'
    )
    expect(url).not.toContain('secret-token')
    expect(init.headers.Authorization).toBe('Bearer secret-token')
  })

  it('creates rooms with Matrix createRoom payload fields', async () => {
    const fetchImpl = vi.fn(async () =>
      jsonResponse({
        room_id: '!new:server',
      })
    )
    const client = new MatrixClient({
      homeserver: 'http://server.local:8008',
      accessToken: 'secret-token',
      fetchImpl,
    })

    await client.createRoom({
      name: 'AAA START HERE - OMNIGENT LIVE DEMO',
      topic: 'Matrix CLI smoke test',
      visibility: 'public',
      alias: 'omnigent-demo',
    })

    const [url, init] = fetchImpl.mock.calls[0]
    expect(url).toBe('http://server.local:8008/_matrix/client/v3/createRoom')
    expect(init.method).toBe('POST')
    expect(JSON.parse(init.body)).toEqual({
      name: 'AAA START HERE - OMNIGENT LIVE DEMO',
      topic: 'Matrix CLI smoke test',
      visibility: 'public',
      room_alias_name: 'omnigent-demo',
    })
  })

  it('lists joined and invited rooms without returned leave rooms', async () => {
    const fetchImpl = vi.fn(async () =>
      jsonResponse({
        rooms: {
          join: {
            '!joined:server': {
              state: {
                events: [
                  {
                    type: 'm.room.name',
                    content: {
                      name: 'Joined room',
                    },
                  },
                ],
              },
            },
          },
          invite: {
            '!invited:server': {
              invite_state: {
                events: [
                  {
                    type: 'm.room.canonical_alias',
                    content: {
                      alias: '#invited:server',
                    },
                  },
                ],
              },
            },
          },
          leave: {
            '!left:server': {
              state: {
                events: [
                  {
                    type: 'm.room.name',
                    content: {
                      name: 'Left room',
                    },
                  },
                ],
              },
            },
          },
        },
      })
    )
    const client = new MatrixClient({
      homeserver: 'http://server.local:8008',
      accessToken: 'secret-token',
      fetchImpl,
    })

    const rooms = await client.listRooms()

    expect(rooms).toEqual([
      {
        roomId: '!joined:server',
        membership: 'join',
        name: 'Joined room',
        canonicalAlias: undefined,
        displayName: 'Joined room',
      },
      {
        roomId: '!invited:server',
        membership: 'invite',
        name: undefined,
        canonicalAlias: '#invited:server',
        displayName: '#invited:server',
      },
    ])
  })

  it('verifies Element visibility from joined or invited membership state', async () => {
    const fetchImpl = vi.fn(async (url) => {
      if (url.endsWith('/account/whoami')) {
        return jsonResponse({
          user_id: '@omnigent:server',
        })
      }

      if (url.endsWith('%40omnigent%3Aserver')) {
        return jsonResponse({
          membership: 'join',
        })
      }

      if (url.endsWith('%40rockleepc%3Aserver')) {
        return jsonResponse({
          membership: 'invite',
        })
      }

      return jsonResponse({ errcode: 'M_NOT_FOUND' }, 404)
    })
    const client = new MatrixClient({
      homeserver: 'http://server.local:8008',
      accessToken: 'secret-token',
      fetchImpl,
    })

    const verification = await client.verifyRoom({
      roomId: '!demo:server',
      expectedUsers: ['@omnigent:server'],
      elementUser: '@rockleepc:server',
    })

    expect(verification.elementShouldShow).toBe(true)
    expect(verification.members).toEqual([
      {
        userId: '@omnigent:server',
        membership: 'join',
        displayName: undefined,
        reason: 'User is joined to the room.',
      },
      {
        userId: '@rockleepc:server',
        membership: 'invite',
        displayName: undefined,
        reason: 'User has a pending room invite.',
      },
    ])
  })

  it('reports Element hidden when the viewer has left the room', async () => {
    const fetchImpl = vi.fn(async (url) => {
      if (url.endsWith('/account/whoami')) {
        return jsonResponse({
          user_id: '@omnigent:server',
        })
      }

      if (url.endsWith('%40omnigent%3Aserver')) {
        return jsonResponse({
          membership: 'join',
        })
      }

      if (url.endsWith('%40rockleepc%3Aserver')) {
        return jsonResponse({
          membership: 'leave',
        })
      }

      return jsonResponse({ errcode: 'M_NOT_FOUND' }, 404)
    })
    const client = new MatrixClient({
      homeserver: 'http://server.local:8008',
      accessToken: 'secret-token',
      fetchImpl,
    })

    const verification = await client.verifyRoom({
      roomId: '!demo:server',
      expectedUsers: ['@omnigent:server'],
      elementUser: '@rockleepc:server',
    })

    expect(verification.elementShouldShow).toBe(false)
    expect(verification.elementReason).toBe(
      'The Element viewer account is not joined or invited according to the homeserver state visible to these credentials.'
    )
    expect(verification.members.at(-1)).toEqual({
      userId: '@rockleepc:server',
      membership: 'leave',
      displayName: undefined,
      reason: 'User has left or has not joined the room.',
    })
  })
})

describe('CLI helpers', () => {
  it('parses repeated expected users and dashed option names', () => {
    expect(
      parseCliArgs([
        'rooms',
        'verify',
        '--room',
        '!demo:server',
        '--user',
        '@omnigent:server',
        '--user=@rockleepc:server',
        '--element-user',
        '@rockleepc:server',
      ])
    ).toEqual({
      command: ['rooms', 'verify'],
      options: {
        room: '!demo:server',
        user: ['@omnigent:server', '@rockleepc:server'],
        elementUser: '@rockleepc:server',
      },
    })
  })

  it('loads credentials from env and lets --homeserver override env', () => {
    expect(
      loadRuntimeConfig(
        {
          homeserver: 'http://override.local:8008',
        },
        {
          MATRIX_HOMESERVER: 'http://env.local:8008',
          MATRIX_ACCESS_TOKEN: 'secret-token',
        },
        process.cwd()
      )
    ).toEqual({
      homeserver: 'http://override.local:8008',
      accessToken: 'secret-token',
      username: undefined,
      password: undefined,
      deviceId: undefined,
    })
  })

  it('runs rooms invite through the expected endpoint', async () => {
    let stdout = ''
    let stderr = ''
    const fetchImpl = vi.fn(async () => jsonResponse({}))

    const code = await runCli({
      argv: [
        'rooms',
        'invite',
        '--room',
        '!demo:server',
        '--user',
        '@rockleepc:server',
      ],
      env: {
        MATRIX_HOMESERVER: 'http://server.local:8008',
        MATRIX_ACCESS_TOKEN: 'secret-token',
      },
      fetchImpl,
      stdout: {
        write: (value) => {
          stdout += value
        },
      },
      stderr: {
        write: (value) => {
          stderr += value
        },
      },
    })

    expect(code).toBe(0)
    expect(stderr).toBe('')
    expect(stdout).toBe('Invited @rockleepc:server to !demo:server\n')
    expect(fetchImpl.mock.calls[0][0]).toBe(
      'http://server.local:8008/_matrix/client/v3/rooms/%21demo%3Aserver/invite'
    )
    expect(JSON.parse(fetchImpl.mock.calls[0][1].body)).toEqual({
      user_id: '@rockleepc:server',
    })
  })
})
