#!/bin/bash

# Script to set up the complete development environment
# This script will:
# 1. Install dependencies
# 2. Set up Directus
# 3. Test the connection to Directus
# 4. Start the development server

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
pnpm directus:test
echo ""

# Step 4: Ask if the user wants to set up Minio with automated configuration
read -p "Do you want to set up Minio for S3 storage with automated configuration? (y/n): " setup_minio_auto
if [ "$setup_minio_auto" = "y" ] || [ "$setup_minio_auto" = "Y" ]; then
    echo "Setting up Minio with automated configuration..."
    
    # Ask for Minio configuration or use defaults
    read -p "Enter Minio endpoint URL (default: http://localhost:9000): " minio_endpoint
    minio_endpoint=${minio_endpoint:-"http://localhost:9000"}
    
    read -p "Enter Minio access key (default: minioadmin): " minio_access_key
    minio_access_key=${minio_access_key:-"minioadmin"}
    
    read -p "Enter Minio secret key (default: minioadmin): " minio_secret_key
    minio_secret_key=${minio_secret_key:-"minioadmin"}
    
    read -p "Enter bucket name (default: directus): " minio_bucket
    minio_bucket=${minio_bucket:-"directus"}
    
    read -p "Set public read access? (y/n, default: y): " minio_public
    minio_public=${minio_public:-"y"}
    
    # Ask if this is a test run
    read -p "Is this a test run? (y/n, default: n): " test_run
    test_run=${test_run:-"n"}
    
    # Run the Minio setup script with the provided configuration
    cd tools/directus
    ./configure-minio.sh \
        --endpoint "$minio_endpoint" \
        --access-key "$minio_access_key" \
        --secret-key "$minio_secret_key" \
        --bucket "$minio_bucket" \
        --public "$minio_public" \
        $([ "$test_run" = "y" ] || [ "$test_run" = "Y" ] && echo "--test")
    cd ../..
    echo ""
fi

# Step 5: Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env file from .env.example..."
    cp .env.example .env
    echo "Environment file created."
else
    echo ".env file already exists. Skipping creation."
fi
echo ""

# Step 5: Ask if the user wants to create sample content
read -p "Do you want to create sample content in Directus? (y/n): " create_sample_content
if [ "$create_sample_content" = "y" ] || [ "$create_sample_content" = "Y" ]; then
    echo "Creating sample content in Directus..."
    pnpm directus:sample-content
    echo ""
fi

# Step 6: Start the development server
echo "Starting development server..."
echo "You can access the website at: http://localhost:8080"
echo "You can access Directus at: http://localhost:8055"
echo ""
echo "Press Ctrl+C to stop the server."
echo ""

pnpm start
