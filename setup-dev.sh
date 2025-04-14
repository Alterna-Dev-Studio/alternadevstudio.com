#!/bin/bash

# Script to set up the complete development environment
# This script will:
# 1. Install dependencies
# 2. Set up Directus
# 3. Test the connection to Directus
# 4. Set up Minio for S3 storage
# 5. Create .env file if needed
# 6. Create sample content in Directus
# 7. Start the development server

# Set script to exit on error
set -e

echo "===== Setting up AlternaDevStudio.com Development Environment ====="
echo ""

# Step 1: Install dependencies
echo "Installing dependencies..."
pnpm install
echo ""

# Step 2: Set up Directus
echo "Setting up Directus..."
pnpm directus:setup
echo ""

# Step 3: Test the connection to Directus
echo "Testing connection to Directus..."
pnpm test:directus
echo ""

# Step 4: Set up Minio for S3 storage
echo "Setting up Minio for Directus..."
cd tools/directus
./setup-minio-bucket.sh
cd ../..
echo ""

# Step 5: Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env file from .env.example..."
    cp .env.example .env
    echo "Environment file created."
else
    echo ".env file already exists. Skipping creation."
fi
echo ""

# Step 6: Create sample content
echo "Creating sample content in Directus..."
pnpm directus:sample-content
echo ""

# Step 7: Start the development server
echo "Starting development server..."
echo "You can access the website at: http://localhost:8080"
echo "You can access Directus at: http://localhost:8055"
echo ""
echo "Press Ctrl+C to stop the server."
echo ""

pnpm start
