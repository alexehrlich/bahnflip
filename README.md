# bahnflip

Train schedule app.

## Getting Started

```bash
docker compose up
```

Then open [http://localhost:5173](http://localhost:5173).

## Configuration

Environment variables are managed via two files in the `backend/` directory:

| File | Committed | Purpose |
|------|-----------|---------|
| `backend/.env` | yes | Public defaults (safe to share) |
| `backend/.env.local` | no | Personal overrides (credentials, local tweaks) |

`backend/.env.local` is loaded after `backend/.env` and overwrites any matching keys. It is covered by `.gitignore` and should never be committed.

### Available variables

| Variable | Default | Description |
|----------|---------|-------------|
| `DB_CLIENT_ID` | `PLACEHOLDER` | Deutsche Bahn API client ID |
| `DB_API_KEY` | `PLACEHOLDER` | Deutsche Bahn API key |
| `DEV_MODE` | `false` | Set to `true` to force mock mode regardless of credentials |

### Setting up credentials

Create `backend/.env.local` and add your real DB API credentials:

```dotenv
DB_CLIENT_ID=your_client_id_here
DB_API_KEY=your_api_key_here
```

Without real credentials (i.e. when values remain `PLACEHOLDER`), the backend runs in **mock mode** and returns randomly generated train data. The same applies when `DEV_MODE=true`.
