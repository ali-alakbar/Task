# ChatGPT Todo

Personal task system with:

- Ruby on Rails API backend
- PostgreSQL storage
- Next.js App Router dashboard
- MCP endpoint for AI clients
- Server-side credential isolation

## Structure

- `backend/`: Rails API, deployable to Railway
- `frontend/`: Next.js dashboard + `/api/mcp`, deployable to Vercel

## Rails environment

- `DATABASE_URL`
- `ASSISTANT_API_KEY`
- `SECRET_KEY_BASE`
- `FRONTEND_ORIGIN` (optional)

## Next.js environment

- `RAILS_API_URL` (for example `https://api.example.com/api/v1`)
- `ASSISTANT_API_KEY` (same server-to-server key as Rails)
- `MCP_ACCESS_TOKEN`
- `DASHBOARD_USER`
- `DASHBOARD_PASSWORD`

The browser never receives `ASSISTANT_API_KEY`. Browser requests go through same-origin Next.js route handlers.

## MCP tools

The deployed `/api/mcp` endpoint exposes:

- `list_tasks`
- `create_task`
- `update_task`
- `complete_task`
- `daily_brief`

The MCP endpoint is protected by `Authorization: Bearer <MCP_ACCESS_TOKEN>`.

## Important ChatGPT note

The MCP bridge is implemented so the app is future-ready. ChatGPT custom MCP write access depends on the capabilities available to the user's ChatGPT plan/workspace.