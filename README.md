# Brainy Voice SaaS Boilerplate

This repository contains a full-stack boilerplate for a multi-tenant SaaS that enables customers to build bespoke voice agents with zero-shot cloning, GPT-4 conversational logic, and Chatterbox Text-to-Speech.

## Contents

- `frontend/` – Next.js dashboard with drag-and-drop orchestration, voice library, and pricing pages.
- `backend/` – Express API with PostgreSQL + Redis integration, JWT auth, and voice pipeline endpoints.
- `infra/` – Docker Compose for local development and Kubernetes manifests (GPU-aware) for production.
- `docs/` – Architecture and operational notes.
- `.github/workflows/` – CI/CD pipeline for building, pushing, and deploying containers.
- `scripts/` – Helper script for manual Docker/Kubernetes deployment.

## Quick Start

```bash
# Frontend
cd frontend
npm install
npm run dev

# Backend
cd backend
npm install
npm run dev
```

For a full local stack, use Docker Compose:

```bash
cd infra/docker
docker compose up --build
```

## Environment Variables

Backend expects the following environment variables (set via `.env` or secret store):

| Variable | Description |
| -------- | ----------- |
| `POSTGRES_URL` | PostgreSQL connection string |
| `REDIS_URL` | Redis connection string |
| `JWT_SECRET` | Secret for signing JWT tokens |
| `GOOGLE_SPEECH_API_KEY` | API key for Google Speech-to-Text |
| `OPENAI_API_KEY` | GPT-4 API key |
| `CHATTERBOX_URL` | Base URL for Chatterbox self-hosted service |

Frontend uses `NEXT_PUBLIC_API_URL` to reach the backend gateway.

## Pricing Plans
- **Startup** – Free up to 100 minutes/month.
- **Starter** – Unlimited minutes, shared GPU autoscaling.
- **Pro** – Unlimited minutes with premium cloning and dedicated infrastructure.
- **Enterprise** – White-label, SLA-backed, dedicated support.

## Deployment

1. Push to `main` triggers GitHub Actions workflow to lint/build and publish Docker images to GHCR.
2. Workflow deploys manifests to the `brainy` namespace via `azure/k8s-deploy`.
3. GPU TTS workers autoscale based on CPU utilisation and GPU scheduling constraints.

See [`docs/architecture.md`](docs/architecture.md) for more details.
