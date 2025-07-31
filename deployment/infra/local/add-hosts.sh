#!/bin/bash

set -e

HOSTS_FILE="/etc/hosts"

add_host() {
  local host="$1"
  if ! grep -qE "^[^#]*\s$host(\s|$)" "$HOSTS_FILE"; then
    echo "Додаю $host у $HOSTS_FILE"
    echo "127.0.0.1 $host" | sudo tee -a "$HOSTS_FILE" > /dev/null
  else
    echo "$host вже є у $HOSTS_FILE"
  fi
}

add_host "registry.local"
add_host "platform.local"
add_host "platform-web.local"

echo "Готово!"
