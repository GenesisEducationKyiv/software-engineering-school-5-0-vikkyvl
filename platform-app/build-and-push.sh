#!/bin/bash

set -e

# Читаємо параметри
LOCAL_REGISTRY=${1:-registry.local:80}
DOCKER_PATH=${2:-./}

IMAGE_NAME="platform"
TAG=0.1.0
FULL_IMAGE_NAME="$LOCAL_REGISTRY/$IMAGE_NAME:$TAG"

echo ">>> Building Docker image from path: $DOCKER_PATH"
docker build --no-cache -t "$FULL_IMAGE_NAME" "$DOCKER_PATH"

echo ">>> Pushing image to local registry: $LOCAL_REGISTRY"
docker push $FULL_IMAGE_NAME

#echo ">>> Updating Kubernetes deployment..."
#
#DEPLOYMENT_EXISTS=$(kubectl get deployment platform -n ragdoll --ignore-not-found)
#
#if [ -z "$DEPLOYMENT_EXISTS" ]; then
#    echo ">>> Deployment 'platform' не існує. Створюю..."
#    kubectl apply -f ./deployment.yaml
#else
#    echo ">>> Оновлюю образ у наявному Deployment..."
#    kubectl set image deployment/platform platform=$FULL_IMAGE_NAME -n ragdoll
#fi
