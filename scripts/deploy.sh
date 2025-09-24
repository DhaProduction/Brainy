#!/usr/bin/env bash
set -euo pipefail

REGISTRY="ghcr.io/${GITHUB_ORG:-acme}" 
TAG=${1:-latest}

if [[ -z "${KUBECONFIG:-}" ]]; then
  echo "KUBECONFIG is not set. Please export KUBECONFIG to point to your cluster config."
  exit 1
fi

echo "Building frontend image..."
docker build -t "$REGISTRY/brainy-frontend:$TAG" frontend

echo "Building backend image..."
docker build -t "$REGISTRY/brainy-backend:$TAG" backend

echo "Pushing images..."
docker push "$REGISTRY/brainy-frontend:$TAG"
docker push "$REGISTRY/brainy-backend:$TAG"

echo "Applying Kubernetes manifests..."
kubectl apply -f infra/k8s/postgres.yaml
kubectl apply -f infra/k8s/redis.yaml
kubectl apply -f infra/k8s/tts-worker.yaml
kubectl apply -f infra/k8s/backend.yaml
kubectl apply -f infra/k8s/frontend.yaml

echo "Deployment complete."
