#!/bin/bash

# Script to set up a Minio bucket for Directus
# This script creates a bucket in Minio and configures it for use with Directus
# Uses direct API calls instead of the Minio Client (mc)

# Use environment variables if set, otherwise use default values
# First check for specific Minio client variables, then fall back to Minio server variables, then defaults
BUCKET_NAME=${MINIO_BUCKET_NAME:-"directus"}
MINIO_ENDPOINT=${MINIO_ENDPOINT:-"http://localhost:9000"}
MINIO_ACCESS_KEY=${MINIO_ACCESS_KEY:-${MINIO_ROOT_USER:-"minioadmin"}}
MINIO_SECRET_KEY=${MINIO_SECRET_KEY:-${MINIO_ROOT_PASSWORD:-"minioadmin"}}

echo "Setting up Minio bucket for Directus..."
echo "Using configuration:"
echo "  Minio Endpoint: $MINIO_ENDPOINT"
echo "  Minio Access Key: $MINIO_ACCESS_KEY"
echo "  Minio Secret Key: ${MINIO_SECRET_KEY:0:3}*****"
echo "  Bucket Name: $BUCKET_NAME"
echo ""

# Function to check if a bucket exists
check_bucket_exists() {
    # Make a HEAD request to the bucket
    status_code=$(curl -s -o /dev/null -w "%{http_code}" \
        -H "Host: $BUCKET_NAME.s3.amazonaws.com" \
        -X HEAD "$MINIO_ENDPOINT/$BUCKET_NAME" \
        -u "$MINIO_ACCESS_KEY:$MINIO_SECRET_KEY")
    
    if [ "$status_code" -eq 200 ]; then
        return 0  # Bucket exists
    else
        return 1  # Bucket doesn't exist
    fi
}

# Check if the bucket already exists
if check_bucket_exists; then
    echo "Bucket '$BUCKET_NAME' already exists."
else
    # Create the bucket
    echo "Creating bucket '$BUCKET_NAME'..."
    
    status_code=$(curl -s -o /dev/null -w "%{http_code}" \
        -X PUT "$MINIO_ENDPOINT/$BUCKET_NAME" \
        -u "$MINIO_ACCESS_KEY:$MINIO_SECRET_KEY")
    
    if [ "$status_code" -eq 200 ] || [ "$status_code" -eq 204 ]; then
        echo "Bucket created successfully."
    else
        echo "Failed to create bucket. Status code: $status_code"
        echo "Please check your Minio configuration and try again."
        exit 1
    fi
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
status_code=$(curl -s -o /dev/null -w "%{http_code}" \
    -X PUT "$MINIO_ENDPOINT/$BUCKET_NAME/?policy" \
    -u "$MINIO_ACCESS_KEY:$MINIO_SECRET_KEY" \
    -H "Content-Type: application/json" \
    -d @/tmp/policy.json)

if [ "$status_code" -eq 200 ] || [ "$status_code" -eq 204 ]; then
    echo "Public read access set successfully."
else
    echo "Failed to set bucket policy. Status code: $status_code"
    echo "Please check your Minio configuration and try again."
    rm /tmp/policy.json
    exit 1
fi

rm /tmp/policy.json
echo ""
