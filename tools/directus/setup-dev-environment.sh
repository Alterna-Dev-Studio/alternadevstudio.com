#!/bin/bash

# Script to set up a local development environment for Directus
# This script will:
# 1. Generate secure keys for Directus
# 2. Create a .env file if it doesn't exist
# 3. Launch Directus using docker-compose
# 4. Set up Minio for S3 storage
# 5. Create collections in Directus

# Set script to exit on error
set -e

# Change to the directus directory
cd "$(dirname "$0")"

echo "===== Setting up Directus Development Environment ====="
echo ""

# Step 1: Generate secure keys for Directus
echo "Generating secure keys for Directus..."
source ./generate-keys.sh
echo ""

# Step 2: Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env file from .env.example..."
    cp .env.example .env
    
    # Update the .env file with the generated keys
    sed -i "s/KEY=replace-with-random-key/KEY=$KEY/" .env
    sed -i "s/SECRET=replace-with-random-secret/SECRET=$SECRET/" .env
    
    # Set a default admin password for development
    # We're keeping the default values from the example.env file
    # sed -i "s/ADMIN_PASSWORD=change-me-please/ADMIN_PASSWORD=admin123/" .env
    # sed -i "s/ADMIN_EMAIL=admin@example.com/ADMIN_EMAIL=admin@alternadevstudio.com/" .env
    
    echo "Environment file created with secure keys."
else
    echo ".env file already exists. Skipping creation."
fi
echo ""

# Step 3: Launch Directus using docker-compose
echo "Launching Directus using docker-compose..."
docker-compose down
docker-compose up -d
echo ""

# Wait for Directus to be ready
echo "Waiting for Directus to be ready..."
max_attempts=30
attempt=0
while [ $attempt -lt $max_attempts ]; do
    if curl -s http://localhost:8055/server/health | grep -q "ok"; then
        echo "Directus is ready!"
        break
    fi
    attempt=$((attempt + 1))
    echo "Waiting for Directus to start... ($attempt/$max_attempts)"
    sleep 2
done

if [ $attempt -eq $max_attempts ]; then
    echo "Directus failed to start within the expected time."
    echo "Please check the logs with: docker-compose logs directus"
    exit 1
fi
echo ""

# Step 4: Set up Minio for S3 storage
echo "Setting up Minio for Directus..."

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

echo ""

# Step 5: Create collections in Directus
echo "Setting up collections in Directus..."
echo "This will create the following collections:"
echo "- blog_posts"
echo "- projects"
echo "- stream_recap"
echo ""

# Get admin credentials from .env file
ADMIN_EMAIL=$(grep ADMIN_EMAIL .env | cut -d '=' -f2)
ADMIN_PASSWORD=$(grep ADMIN_PASSWORD .env | cut -d '=' -f2)

# Run the setup-collections script from the shared module
echo "Running collection setup script..."
cd ../../
pnpm run directus:setup-collections
cd tools/directus

echo ""
echo "===== Directus Development Environment Setup Complete ====="
echo ""
echo "Directus is running at: http://localhost:8055"
echo "Admin email: $ADMIN_EMAIL"
echo "Admin password: $ADMIN_PASSWORD"
echo ""
echo "The following collections have been created:"
echo "- blog_posts"
echo "- projects"
echo "- stream_recap"
echo ""
echo "You can now use these collections to manage content for your website."
