#!/bin/bash

# Script to clean up Directus containers and volumes
# This script will:
# 1. Stop all running Directus containers
# 2. Remove all Directus-related volumes

set -e  # Exit immediately if a command exits with a non-zero status

echo "Cleaning up Directus environment..."

# Get the directory of this script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$SCRIPT_DIR/../.."
cd "$SCRIPT_DIR"

# Stop containers if they are running
echo "Stopping Directus containers..."
docker-compose down

# Remove volumes
echo "Removing Directus volumes..."

# Find and remove volumes related to Directus
echo "Finding Directus-related volumes..."
DIRECTUS_VOLUMES=$(docker volume ls --filter "name=directus" -q)

if [ -z "$DIRECTUS_VOLUMES" ]; then
  echo "No Directus-related volumes found."
else
  echo "Found the following Directus-related volumes:"
  echo "$DIRECTUS_VOLUMES"
  echo "Removing volumes..."
  docker volume rm $DIRECTUS_VOLUMES
fi

# Remove .env file from project root
if [ -f "$PROJECT_ROOT/.env" ]; then
  echo "Removing .env file from project root..."
  rm "$PROJECT_ROOT/.env"
  echo ".env file removed."
else
  echo "No .env file found in project root."
fi

echo "Cleanup complete!"
