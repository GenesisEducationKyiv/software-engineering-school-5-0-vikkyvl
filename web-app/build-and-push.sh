#!/bin/bash

set -e

LOCAL_REGISTRY=${1:-registry.local:80}
DOCKER_PATH=${2:-./}

IMAGE_NAME="platform-web"
TAG=0.1.1
FULL_IMAGE_NAME="$LOCAL_REGISTRY/$IMAGE_NAME:$TAG"

echo ">>> Building frontend Docker image"
docker build --no-cache -t "$FULL_IMAGE_NAME" "$DOCKER_PATH"

echo ">>> Pushing image to local registry: $LOCAL_REGISTRY"
docker push "$FULL_IMAGE_NAME"
