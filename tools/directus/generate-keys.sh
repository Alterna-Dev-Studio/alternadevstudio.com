#!/bin/bash

# Script to generate secure random keys for Directus

# Function to generate a random string
generate_random_string() {
  length=$1
  cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w $length | head -n 1
}

# Generate a 32-character KEY
KEY=$(generate_random_string 32)

# Generate a 32-character SECRET
SECRET=$(generate_random_string 32)

echo "Generated secure random keys for Directus:"
echo ""
echo "KEY: $KEY"
echo "SECRET: $SECRET"
echo ""
echo "Update these values in your docker-compose.yml file under the directus service:"
echo ""
echo "  environment:"
echo "    KEY: '$KEY'"
echo "    SECRET: '$SECRET'"
echo ""
echo "Remember to keep these values secure and don't share them publicly."
