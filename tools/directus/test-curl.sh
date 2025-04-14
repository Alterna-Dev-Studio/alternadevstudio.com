#!/bin/bash

# Test script for Directus connection using curl
# This script tests the connection to Directus and verifies that the
# required collections exist using curl commands.

# Set script to exit on error
set -e

# Directus connection details
DIRECTUS_URL=${DIRECTUS_URL:-http://localhost:8055}
DIRECTUS_EMAIL=${DIRECTUS_EMAIL:-admin@example.com}
DIRECTUS_PASSWORD=${DIRECTUS_PASSWORD:-change-me-please}

# Required collections
COLLECTIONS=("blog_posts" "projects" "stream_recap")

echo "Testing connection to Directus..."
echo "URL: $DIRECTUS_URL"
echo "Email: $DIRECTUS_EMAIL"
echo ""

# Check if Directus is running
echo "Checking if Directus is running..."
HEALTH_RESPONSE=$(curl -s $DIRECTUS_URL/server/health)
if [[ $HEALTH_RESPONSE == *"ok"* ]]; then
  echo "Directus health check: ok"
else
  echo "Directus health check failed: $HEALTH_RESPONSE"
  exit 1
fi
echo ""

# Login to Directus
echo "Logging in to Directus..."
LOGIN_RESPONSE=$(curl -s -X POST $DIRECTUS_URL/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$DIRECTUS_EMAIL\",\"password\":\"$DIRECTUS_PASSWORD\"}")

if [[ $LOGIN_RESPONSE == *"access_token"* ]]; then
  echo "Login successful!"
  # Extract the access token
  ACCESS_TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)
  echo "Token: ${ACCESS_TOKEN:0:10}..."
else
  echo "Login failed: $LOGIN_RESPONSE"
  exit 1
fi
echo ""

# Check if required collections exist
echo "Checking if required collections exist..."
echo "Collections found:"

for collection in "${COLLECTIONS[@]}"; do
  # Try to get items from the collection (limit 1)
  ITEMS_RESPONSE=$(curl -s -X GET "$DIRECTUS_URL/items/$collection?limit=1" \
    -H "Authorization: Bearer $ACCESS_TOKEN")
  
  if [[ $ITEMS_RESPONSE == *"data"* ]]; then
    echo "- $collection: ✅ Found"
    # Extract the total count
    TOTAL_COUNT=$(echo $ITEMS_RESPONSE | grep -o '"total_count":[0-9]*' | cut -d':' -f2)
    echo "  $TOTAL_COUNT items"
  else
    echo "- $collection: ❌ Not found"
    echo "  Response: $ITEMS_RESPONSE"
  fi
done
echo ""

echo "Connection test completed!"
echo ""
echo "You can now use Directus as a headless CMS for your website."
echo "Access the admin interface at:"
echo "$DIRECTUS_URL"
