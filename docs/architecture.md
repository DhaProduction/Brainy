# Brainy Voice SaaS Architecture

## Overview
Brainy enables teams to create personalised voice agents using a drag-and-drop studio backed by a modular pipeline.

- **Frontend**: Next.js dashboard with voice sample management, emotional sliders, and GPT-4 prompt editor.
- **Backend**: Express API orchestrating authentication, project management, webhook integrations, and voice pipelines.
- **AI Pipeline**: Google Speech-to-Text → GPT-4 reasoning → Chatterbox self-hosted TTS with emotional prosody.
- **Storage**: PostgreSQL for relational data, Redis for caching/session state, optional CDN for audio assets.
- **Deployment**: Containerized via Docker, orchestrated with Kubernetes (GPU-enabled workers for TTS).

## Core API Endpoints

| Method | Path | Description |
| ------ | ---- | ----------- |
| POST | `/api/auth/register` | Register organisation owner and create tenant. |
| POST | `/api/auth/login` | Issue JWT for multi-tenant session. |
| GET | `/api/projects` | List projects for authenticated tenant. |
| POST | `/api/projects` | Create project with prompt + flow. |
| PATCH | `/api/projects/:id` | Update project metadata. |
| DELETE | `/api/projects/:id` | Remove a project. |
| GET | `/api/voices` | List available cloned voices. |
| POST | `/api/voices/upload` | Upload zero-shot sample (5–20 s) for cloning. |
| POST | `/api/voices/tts` | Generate TTS audio for provided text. |
| POST | `/api/voices/pipeline` | Execute STT → GPT-4 → TTS pipeline. |
| GET | `/api/integrations/webhooks` | List outbound webhooks for CRM/PSTN connectors. |
| POST | `/api/integrations/webhooks` | Create a webhook with signing secret. |
| DELETE | `/api/integrations/webhooks/:id` | Remove webhook subscription. |

## External Integrations

- **Webhooks**: Configure per-project webhook blocks to push CRM/PSTN events from the orchestration canvas.
- **Authentication**: JWT tokens with role-based guards (`owner`, `admin`, `member`). Extendable to SSO providers.
- **CDN**: Frontend assets served via CDN (e.g., CloudFront/Akamai) with immutable caching headers.

## Pricing Strategy

1. **Startup (Free)** – 100 monthly minutes, 1 cloned voice, community support.
2. **Starter** – Unlimited minutes, up to 5 premium voices, shared GPU autoscaling.
3. **Pro** – Unlimited minutes, 15 premium voices, dedicated DB/Redis, 24/7 support.
4. **Enterprise** – White-label, private GPU cluster, SLA-backed, dedicated success engineering.

Usage telemetry feeds billing service (not included) which consumes Redis session data and Postgres usage records.

## Local Development

```bash
# Bring up entire stack
cd infra/docker
docker compose up --build

# Run backend locally
cd backend
npm install
npm run dev

# Run frontend locally
cd frontend
npm install
npm run dev
```

## Deployment Flow

1. Merge to `main` triggers GitHub Actions build.
2. Docker images published to GHCR.
3. Kubernetes deployment updated via `azure/k8s-deploy` action.
4. GPU autoscaler handles TTS workloads, while HPAs scale frontend/backend.
