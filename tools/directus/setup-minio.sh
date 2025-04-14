#!/bin/bash

# Script to set up Minio for Directus
# This script creates a bucket in Minio and configures it for use with Directus

# Default values
BUCKET_NAME="directus"
MINIO_ENDPOINT="http://localhost:9000"
MINIO_ACCESS_KEY="minioadmin"
MINIO_SECRET_KEY="minioadmin"

echo "Setting up Minio for Directus..."
echo ""
echo "This script will:"
echo "1. Create a bucket in Minio for Directus"
echo "2. Set the bucket policy to allow public read access (optional)"
echo "3. Help you configure Directus to use Minio for storage"
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

# Ask for Minio configuration
echo "Enter Minio configuration (press Enter to use defaults):"
read -p "Minio Endpoint [$MINIO_ENDPOINT]: " input
MINIO_ENDPOINT=${input:-$MINIO_ENDPOINT}

read -p "Minio Access Key [$MINIO_ACCESS_KEY]: " input
MINIO_ACCESS_KEY=${input:-$MINIO_ACCESS_KEY}

read -p "Minio Secret Key [$MINIO_SECRET_KEY]: " input
MINIO_SECRET_KEY=${input:-$MINIO_SECRET_KEY}

read -p "Bucket Name [$BUCKET_NAME]: " input
BUCKET_NAME=${input:-$BUCKET_NAME}

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

# Ask if the user wants to set public read access
echo ""
echo "Do you want to set public read access for the bucket? (y/n)"
echo "This is recommended for serving public assets from Directus."
read -p "Set public read access? [y/n]: " SET_PUBLIC

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
