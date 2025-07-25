#!/bin/bash

set -euo pipefail

## Завантаження змінних з .env файлу
#ENV_FILE=".env.prod"
#
#if [ -f "$ENV_FILE" ]; then
#  echo "Завантаження змінних із $ENV_FILE"
#  export $(grep -v '^#' "$ENV_FILE" | grep -Eo '^[A-Z0-9_]+')
#fi
#
#export TF_VAR_WEATHER_API_KEY="$WEATHER_API_KEY"
#export TF_VAR_OPEN_WEATHER_MAP_KEY="$OPEN_WEATHER_MAP_KEY"
#export TF_VAR_WEATHER_STACK_KEY="$WEATHER_STACK_KEY"
#
#export TF_VAR_DB_PASSWORD="$DB_PASSWORD"
#export TF_VAR_EMAIL_USER="$EMAIL_USER"
#export TF_VAR_EMAIL_PASSWORD="$EMAIL_PASSWORD"
#
#export TF_VAR_RABBITMQ_DEFAULT_USER="$RABBITMQ_DEFAULT_USER"
#export TF_VAR_RABBITMQ_DEFAULT_PASS="$RABBITMQ_DEFAULT_PASS"
#
#export TF_VAR_POSTGRES_USER="$POSTGRES_USER"
#export TF_VAR_POSTGRES_PASSWORD="$POSTGRES_PASSWORD"
#export TF_VAR_POSTGRES_DB="$POSTGRES_DB"
#
#export TF_VAR_public_access_cidrs='[]'

echo "Запуск terraform apply..."
terraform apply -auto-approve
