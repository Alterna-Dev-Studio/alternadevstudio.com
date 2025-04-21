#!/bin/bash

# Script to clean up Directus configuration
# This script will:
# 1. Remove environment files

set -e  # Exit immediately if a command exits with a non-zero status

echo "Cleaning up Directus configuration..."

# Get the directory of this script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$SCRIPT_DIR/../.."
cd "$SCRIPT_DIR"

# Remove .env file from project root
if [ -f "$PROJECT_ROOT/.env" ]; then
  echo "Removing .env file from project root..."
  rm "$PROJECT_ROOT/.env"
  echo ".env file removed."
else
  echo "No .env file found in project root."
fi

echo "Cleanup complete!"
