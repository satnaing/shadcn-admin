# Omnigent Matrix Client CLI

This tool uses the Matrix Client-Server API as the control plane. Element stays
the human UI/viewer; automation talks to the homeserver directly.

The CLI never prints access tokens or passwords. Prefer a separate bot account
such as `@omnigent:rocks-MacBook-Air.local` for automation and a stable human
account such as `@benjamin:rocks-MacBook-Air.local` for Element. Avoid treating a
per-device name as the long-term Matrix identity.

## Windows Nerve PC quick start

Run these commands from the repo root:

```powershell
cd E:\ai-marketing-hub-pro\hub-pro-dashboard-app
$env:MATRIX_HOMESERVER = "http://rocks-MacBook-Air.local:8008"
$env:MATRIX_ACCESS_TOKEN = "<access token for @omnigent or the target account>"
pnpm matrix whoami
```

If you are testing with the existing observed account, use the same homeserver
and the access token for:

```text
@rockleepc:rocks-MacBook-Air.local
```

Do not paste tokens into chat, commit them, or put them in command output. A
local `.env` file is ignored by Git if you want to keep the variables between
terminals.

## Commands

Connectivity and identity check:

```powershell
pnpm matrix whoami
```

List joined and invited rooms as returned by `/sync`:

```powershell
pnpm matrix rooms list
```

Create a private test room:

```powershell
pnpm matrix rooms create --name "AAA OMNIGENT MATRIX CLI TEST" --topic "Created by Omnigent Matrix CLI" --private
```

Invite the Element viewer account:

```powershell
pnpm matrix rooms invite --room "<room_id_from_create>" --user "@rockleepc:rocks-MacBook-Air.local"
```

Join a room by ID or alias when the credentials belong to the invited target
user:

```powershell
pnpm matrix rooms join --room "<room_id_or_alias>"
```

Send a plain text message:

```powershell
pnpm matrix messages send --room "<room_id>" --body "Omnigent Matrix CLI smoke test"
```

Verify whether Element should show the room for the human account:

```powershell
pnpm matrix rooms verify --room "<room_id>" --user "@omnigent:rocks-MacBook-Air.local" --element-user "@rockleepc:rocks-MacBook-Air.local"
```

`rooms verify` checks current `m.room.member` state for the expected users. If
the Element viewer account is `join` or `invite`, the homeserver state says
Element should show the room after Element syncs that same account. If it says
`leave`, `ban`, or `missing`, the room should not be expected in Element for that
account.

## Optional one-shot password login

Access tokens are preferred. For a one-shot login without storing the returned
token, set:

```powershell
$env:MATRIX_USERNAME = "@omnigent:rocks-MacBook-Air.local"
$env:MATRIX_PASSWORD = "<password>"
$env:MATRIX_DEVICE_ID = "OMNIGENT_CLI"
pnpm matrix whoami
```

The CLI uses the returned token only in memory for the current command.

## JSON config

You can also pass a local JSON config file:

```json
{
  "homeserver": "http://rocks-MacBook-Air.local:8008",
  "accessToken": "<token>"
}
```

Then run:

```powershell
pnpm matrix --config .matrix-cli.local.json whoami
```

Keep config files with secrets local only.
