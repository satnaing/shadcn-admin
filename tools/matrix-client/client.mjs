const MATRIX_API_PREFIX = '/_matrix/client/v3'

export class MatrixError extends Error {
  constructor(message, { status, errcode, response } = {}) {
    super(message)
    this.name = 'MatrixError'
    this.status = status
    this.errcode = errcode
    this.response = response
  }
}

export function normalizeHomeserver(homeserver) {
  if (!homeserver || typeof homeserver !== 'string') {
    throw new Error('MATRIX_HOMESERVER is required')
  }

  const trimmed = homeserver.trim().replace(/\/+$/, '')

  try {
    const parsed = new URL(trimmed)
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      throw new Error('Homeserver must use http:// or https://')
    }

    return parsed.toString().replace(/\/+$/, '')
  } catch (error) {
    if (error.message.includes('Homeserver')) {
      throw error
    }

    throw new Error('MATRIX_HOMESERVER must be an absolute URL')
  }
}

export function buildMatrixUrl(homeserver, pathSegments = [], query = {}) {
  const url = new URL(normalizeHomeserver(homeserver))
  const basePath = url.pathname === '/' ? '' : url.pathname.replace(/\/+$/, '')
  const encodedSegments = pathSegments.map(encodePathSegment)
  const pathname = [basePath, MATRIX_API_PREFIX, ...encodedSegments]
    .filter(Boolean)
    .join('/')
    .replace(/\/{2,}/g, '/')

  const searchParams = new URLSearchParams()
  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined || value === null || value === false) {
      return
    }

    searchParams.set(key, String(value))
  })
  const search = searchParams.toString()

  return `${url.origin}${pathname}${search ? `?${search}` : ''}`
}

export function buildTxnId(prefix = 'omnigent') {
  const safePrefix = String(prefix).replace(/[^A-Za-z0-9._=-]/g, '_')
  return `${safePrefix}.${Date.now()}.${Math.random().toString(36).slice(2, 10)}`
}

export class MatrixClient {
  constructor({
    homeserver,
    accessToken,
    username,
    password,
    deviceId,
    fetchImpl = globalThis.fetch,
  }) {
    this.homeserver = normalizeHomeserver(homeserver)
    this.accessToken = accessToken
    this.username = username
    this.password = password
    this.deviceId = deviceId
    this.fetchImpl = fetchImpl
    this.loggedInUserId = undefined

    if (typeof this.fetchImpl !== 'function') {
      throw new Error('A fetch implementation is required')
    }
  }

  async ensureAccessToken() {
    if (this.accessToken) {
      return this.accessToken
    }

    if (!this.username || !this.password) {
      throw new Error(
        'MATRIX_ACCESS_TOKEN is required, or provide MATRIX_USERNAME and MATRIX_PASSWORD for one-shot login'
      )
    }

    const response = await this.request('POST', ['login'], {
      authenticated: false,
      body: {
        type: 'm.login.password',
        identifier: {
          type: 'm.id.user',
          user: this.username,
        },
        password: this.password,
        device_id: this.deviceId,
        initial_device_display_name: 'Omnigent Matrix CLI',
      },
    })

    if (!response.access_token) {
      throw new MatrixError('Matrix login did not return an access token')
    }

    this.accessToken = response.access_token
    this.loggedInUserId = response.user_id
    this.deviceId = response.device_id ?? this.deviceId

    return this.accessToken
  }

  async request(method, pathSegments, options = {}) {
    const {
      authenticated = true,
      body,
      query,
      accessToken,
      acceptedStatuses = [],
    } = options
    const token = authenticated
      ? (accessToken ?? (await this.ensureAccessToken()))
      : undefined
    const headers = {
      Accept: 'application/json',
    }

    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    const requestOptions = {
      method,
      headers,
    }

    if (body !== undefined) {
      headers['Content-Type'] = 'application/json'
      requestOptions.body = JSON.stringify(stripUndefined(body))
    }

    const response = await this.fetchImpl(
      buildMatrixUrl(this.homeserver, pathSegments, query),
      requestOptions
    )
    const payload = await readJsonResponse(response)

    if (!response.ok && !acceptedStatuses.includes(response.status)) {
      throw new MatrixError(formatMatrixError(response.status, payload), {
        status: response.status,
        errcode: payload?.errcode,
        response: payload,
      })
    }

    return payload
  }

  whoami() {
    return this.request('GET', ['account', 'whoami'])
  }

  async listRooms() {
    const sync = await this.request('GET', ['sync'], {
      query: {
        timeout: 0,
      },
    })
    const rooms = []
    const roomGroups = sync.rooms ?? {}

    Object.entries(roomGroups.join ?? {}).forEach(([roomId, room]) => {
      rooms.push(roomFromSync(roomId, 'join', room))
    })

    Object.entries(roomGroups.invite ?? {}).forEach(([roomId, room]) => {
      rooms.push(roomFromSync(roomId, 'invite', room))
    })

    Object.entries(roomGroups.leave ?? {}).forEach(([roomId, room]) => {
      rooms.push(roomFromSync(roomId, 'leave', room))
    })

    return rooms.sort((left, right) => {
      const membershipOrder = { join: 0, invite: 1, leave: 2 }
      return (
        (membershipOrder[left.membership] ?? 9) -
          (membershipOrder[right.membership] ?? 9) ||
        left.displayName.localeCompare(right.displayName) ||
        left.roomId.localeCompare(right.roomId)
      )
    })
  }

  createRoom({ name, topic, visibility = 'private', alias }) {
    return this.request('POST', ['createRoom'], {
      body: {
        name,
        topic,
        visibility,
        room_alias_name: alias,
      },
    })
  }

  inviteUser(roomId, userId) {
    return this.request('POST', ['rooms', roomId, 'invite'], {
      body: {
        user_id: userId,
      },
    })
  }

  joinRoom(roomIdOrAlias) {
    return this.request('POST', ['join', roomIdOrAlias], {
      body: {},
    })
  }

  sendMessage(roomId, body, txnId = buildTxnId()) {
    return this.request(
      'PUT',
      ['rooms', roomId, 'send', 'm.room.message', txnId],
      {
        body: {
          msgtype: 'm.text',
          body,
        },
      }
    )
  }

  async getMemberState(roomId, userId) {
    const response = await this.request(
      'GET',
      ['rooms', roomId, 'state', 'm.room.member', userId],
      {
        acceptedStatuses: [404],
      }
    )

    if (response?.membership) {
      return {
        userId,
        membership: response.membership,
        displayName: response.displayname,
        reason: memberReason(response.membership),
      }
    }

    return {
      userId,
      membership: 'missing',
      reason: 'No current membership state was visible to these credentials.',
    }
  }

  async verifyRoom({ roomId, expectedUsers = [], elementUser }) {
    const whoami = await this.whoami()
    const authenticatedUser = whoami.user_id ?? this.loggedInUserId
    const viewerUser = elementUser || authenticatedUser
    const usersToCheck = Array.from(
      new Set([...expectedUsers, viewerUser].filter(Boolean))
    )
    const members = []

    for (const userId of usersToCheck) {
      members.push(await this.getMemberState(roomId, userId))
    }

    const elementMember = members.find((member) => member.userId === viewerUser)
    const elementShouldShow = ['join', 'invite'].includes(
      elementMember?.membership
    )

    return {
      roomId,
      authenticatedUser,
      elementUser: viewerUser,
      elementShouldShow,
      elementReason: elementShouldShow
        ? 'The Element viewer account is joined or invited on the homeserver. Element should show the room after it syncs the same account.'
        : 'The Element viewer account is not joined or invited according to the homeserver state visible to these credentials.',
      members,
    }
  }
}

function stripUndefined(value) {
  if (Array.isArray(value)) {
    return value.map(stripUndefined)
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value)
        .filter((entry) => entry[1] !== undefined)
        .map(([key, entryValue]) => [key, stripUndefined(entryValue)])
    )
  }

  return value
}

function encodePathSegment(segment) {
  return encodeURIComponent(String(segment)).replace(/[!'()*]/g, (char) =>
    `%${char.charCodeAt(0).toString(16).toUpperCase()}`
  )
}

async function readJsonResponse(response) {
  const text = await response.text()
  if (!text) {
    return {}
  }

  try {
    return JSON.parse(text)
  } catch (_error) {
    return {
      error: text,
    }
  }
}

function formatMatrixError(status, payload) {
  const errcode = payload?.errcode ? ` ${payload.errcode}` : ''
  const detail = payload?.error ? `: ${payload.error}` : ''
  return `Matrix request failed (${status}${errcode})${detail}`
}

function roomFromSync(roomId, membership, room) {
  const events = [
    ...(room?.invite_state?.events ?? []),
    ...(room?.state?.events ?? []),
    ...(room?.timeline?.events ?? []),
  ]
  const name = latestEventContent(events, 'm.room.name')?.name
  const canonicalAlias = latestEventContent(events, 'm.room.canonical_alias')?.alias
  const displayName = name || canonicalAlias || roomId

  return {
    roomId,
    membership,
    name,
    canonicalAlias,
    displayName,
  }
}

function latestEventContent(events, type) {
  for (let index = events.length - 1; index >= 0; index -= 1) {
    if (events[index]?.type === type) {
      return events[index].content ?? {}
    }
  }

  return undefined
}

function memberReason(membership) {
  switch (membership) {
    case 'join':
      return 'User is joined to the room.'
    case 'invite':
      return 'User has a pending room invite.'
    case 'leave':
      return 'User has left or has not joined the room.'
    case 'ban':
      return 'User is banned from the room.'
    default:
      return `Membership is ${membership}.`
  }
}
