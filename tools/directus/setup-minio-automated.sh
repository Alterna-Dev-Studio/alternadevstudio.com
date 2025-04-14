#!/bin/bash

# Automated script to set up Minio for Directus
# This script creates a bucket in Minio and configures it for use with Directus
# without requiring interactive prompts

# Default values
BUCKET_NAME=${MINIO_BUCKET_NAME:-"directus"}
MINIO_ENDPOINT=${MINIO_ENDPOINT:-"http://localhost:9000"}
MINIO_ACCESS_KEY=${MINIO_ACCESS_KEY:-"minioadmin"}
MINIO_SECRET_KEY=${MINIO_SECRET_KEY:-"minioadmin"}
SET_PUBLIC=${MINIO_SET_PUBLIC:-"y"}
TEST_MODE="false"

# Parse command line arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --endpoint)
      MINIO_ENDPOINT="$2"
      shift 2
      ;;
    --access-key)
      MINIO_ACCESS_KEY="$2"
      shift 2
      ;;
    --secret-key)
      MINIO_SECRET_KEY="$2"
      shift 2
      ;;
    --bucket)
      BUCKET_NAME="$2"
      shift 2
      ;;
    --public)
      SET_PUBLIC="$2"
      shift 2
      ;;
    --test)
      TEST_MODE="true"
      shift
      ;;
    --help)
      echo "Usage: $0 [options]"
      echo "Options:"
      echo "  --endpoint ENDPOINT    Minio endpoint URL (default: http://localhost:9000)"
      echo "  --access-key KEY       Minio access key (default: minioadmin)"
      echo "  --secret-key SECRET    Minio secret key (default: minioadmin)"
      echo "  --bucket NAME          Bucket name (default: directus)"
      echo "  --public y|n           Set public read access (default: y)"
      echo "  --test                 Test mode - print configuration without executing"
      echo ""
      echo "Environment variables:"
      echo "  MINIO_ENDPOINT         Minio endpoint URL"
      echo "  MINIO_ACCESS_KEY       Minio access key"
      echo "  MINIO_SECRET_KEY       Minio secret key"
      echo "  MINIO_BUCKET_NAME      Bucket name"
      echo "  MINIO_SET_PUBLIC       Set public read access (y/n)"
      exit 0
      ;;
    *)
      echo "Unknown option: $1"
      echo "Use --help for usage information"
      exit 1
      ;;
  esac
done

echo "Setting up Minio for Directus..."
echo "Using the following configuration:"
echo "  Minio Endpoint: $MINIO_ENDPOINT"
echo "  Minio Access Key: $MINIO_ACCESS_KEY"
echo "  Minio Secret Key: ${MINIO_SECRET_KEY:0:3}*****"
echo "  Bucket Name: $BUCKET_NAME"
echo "  Set Public Access: $SET_PUBLIC"
echo "  Test Mode: $TEST_MODE"
echo ""

# If test mode is enabled, exit here
if [ "$TEST_MODE" = "true" ]; then
    echo "Test mode enabled. Exiting without making any changes."
    exit 0
fi

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

# Set public read access if requested
if [ "$SET_PUBLIC" = "y" ] || [ "$SET_PUBLIC" = "Y" ]; then
    # Set public read policy
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
fi

# Print configuration for Directus
echo ""
echo "Minio bucket setup complete!"
echo ""
echo "To configure Directus to use Minio, add the following to your .env file:"
echo ""
echo "STORAGE_LOCATIONS=s3"
echo "STORAGE_S3_DRIVER=s3"
echo "STORAGE_S3_KEY=$MINIO_ACCESS_KEY"
echo "STORAGE_S3_SECRET=$MINIO_SECRET_KEY"
echo "STORAGE_S3_ENDPOINT=$MINIO_ENDPOINT"
echo "STORAGE_S3_BUCKET=$BUCKET_NAME"
echo "STORAGE_S3_REGION=us-east-1"
echo "STORAGE_S3_FORCE_PATH_STYLE=true"
echo ""
echo "Or uncomment and update these values in your existing .env file."

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
