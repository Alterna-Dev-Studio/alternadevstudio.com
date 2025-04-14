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

# Step 4: Set up Minio for S3 storage
echo "Setting up Minio for Directus..."
cd tools/directus

# Use environment variables if set, otherwise use default values
# First check for specific Minio client variables, then fall back to Minio server variables, then defaults
BUCKET_NAME=${MINIO_BUCKET_NAME:-"directus"}
MINIO_ENDPOINT=${MINIO_ENDPOINT:-"http://localhost:9000"}
MINIO_ACCESS_KEY=${MINIO_ACCESS_KEY:-${MINIO_ROOT_USER:-"minioadmin"}}
MINIO_SECRET_KEY=${MINIO_SECRET_KEY:-${MINIO_ROOT_PASSWORD:-"minioadmin"}}

echo "Using default configuration:"
echo "  Minio Endpoint: $MINIO_ENDPOINT"
echo "  Minio Access Key: $MINIO_ACCESS_KEY"
echo "  Minio Secret Key: ${MINIO_SECRET_KEY:0:3}*****"
echo "  Bucket Name: $BUCKET_NAME"
echo ""

# Check if mc (Minio Client) is installed
if ! command -v mc &> /dev/null; then
    echo "Minio Client (mc) is not installed. Installing..."
    
    # Download and install mc
    curl -O https://dl.min.io/client/mc/release/linux-amd64/mc
    chmod +x mc
    sudo mv mc /usr/local/bin/
    
    if ! command -v mc &> /dev/null; then
        echo "Failed to install Minio Client. Please install it manually:"
        echo "https://docs.min.io/docs/minio-client-quickstart-guide.html"
        exit 1
    fi
    
    echo "Minio Client installed successfully."
fi

# Configure mc
echo "Configuring Minio Client..."
mc alias set directus $MINIO_ENDPOINT $MINIO_ACCESS_KEY $MINIO_SECRET_KEY

# Check if the bucket already exists
if mc ls directus | grep -q "$BUCKET_NAME"; then
    echo "Bucket '$BUCKET_NAME' already exists."
else
    # Create the bucket
    echo "Creating bucket '$BUCKET_NAME'..."
    mc mb directus/$BUCKET_NAME
    
    if [ $? -ne 0 ]; then
        echo "Failed to create bucket. Please check your Minio configuration and try again."
        exit 1
    fi
    
    echo "Bucket created successfully."
fi

# Set public read access
echo "Setting public read access for bucket '$BUCKET_NAME'..."

# Create a policy file
cat > /tmp/policy.json << EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {
                "AWS": [
                    "*"
                ]
            },
            "Action": [
                "s3:GetObject"
            ],
            "Resource": [
                "arn:aws:s3:::${BUCKET_NAME}/*"
            ]
        }
    ]
}
EOF

# Apply the policy
mc policy set-json /tmp/policy.json directus/$BUCKET_NAME

if [ $? -ne 0 ]; then
    echo "Failed to set bucket policy. Please check your Minio configuration and try again."
    rm /tmp/policy.json
    exit 1
fi

rm /tmp/policy.json
echo "Public read access set successfully."

# Automatically update the .env file if it exists
if [ -f .env ]; then
    echo ""
    echo "Updating .env file with Minio configuration..."
    
    # Check if the S3 configuration is already in the .env file
    if grep -q "STORAGE_S3_DRIVER" .env; then
        # Update existing configuration
        sed -i "s|STORAGE_LOCATIONS=.*|STORAGE_LOCATIONS=s3|" .env
        sed -i "s|STORAGE_S3_DRIVER=.*|STORAGE_S3_DRIVER=s3|" .env
        sed -i "s|STORAGE_S3_KEY=.*|STORAGE_S3_KEY=$MINIO_ACCESS_KEY|" .env
        sed -i "s|STORAGE_S3_SECRET=.*|STORAGE_S3_SECRET=$MINIO_SECRET_KEY|" .env
        sed -i "s|STORAGE_S3_ENDPOINT=.*|STORAGE_S3_ENDPOINT=$MINIO_ENDPOINT|" .env
        sed -i "s|STORAGE_S3_BUCKET=.*|STORAGE_S3_BUCKET=$BUCKET_NAME|" .env
        sed -i "s|STORAGE_S3_REGION=.*|STORAGE_S3_REGION=us-east-1|" .env
        sed -i "s|STORAGE_S3_FORCE_PATH_STYLE=.*|STORAGE_S3_FORCE_PATH_STYLE=true|" .env
    else
        # Add new configuration
        echo "" >> .env
        echo "# S3 Storage Configuration" >> .env
        echo "STORAGE_LOCATIONS=s3" >> .env
        echo "STORAGE_S3_DRIVER=s3" >> .env
        echo "STORAGE_S3_KEY=$MINIO_ACCESS_KEY" >> .env
        echo "STORAGE_S3_SECRET=$MINIO_SECRET_KEY" >> .env
        echo "STORAGE_S3_ENDPOINT=$MINIO_ENDPOINT" >> .env
        echo "STORAGE_S3_BUCKET=$BUCKET_NAME" >> .env
        echo "STORAGE_S3_REGION=us-east-1" >> .env
        echo "STORAGE_S3_FORCE_PATH_STYLE=true" >> .env
    fi
    
    echo ".env file updated successfully."
fi

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
