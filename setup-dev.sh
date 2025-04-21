#!/bin/bash

# Script to set up the development environment
# This script will:
# 1. Install dependencies
# 2. Set up Directus configuration
# 3. Create .env file if needed
# 4. Create sample content in Directus
# 5. Start the development server

# Set script to exit on error
set -e

echo "===== Setting up AlternaDevStudio.com Development Environment ====="
echo ""

# Step 1: Install dependencies
echo "Installing dependencies..."
pnpm install
echo ""

# Step 2: Set up Directus configuration
echo "Setting up Directus configuration..."
pnpm directus:setup
echo ""

# Step 3: Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env file from .env.example..."
    cp .env.example .env
    echo "Environment file created."
else
    echo ".env file already exists. Skipping creation."
fi
echo ""

# Step 4: Create sample content
echo "Creating sample content in Directus..."
pnpm directus:sample-content
echo ""

# Step 5: Start the development server
echo "Starting development server..."
echo "You can access the website at: http://localhost:8080"
echo ""
echo "Press Ctrl+C to stop the server."
echo ""

pnpm start
