#!/bin/bash

# Script to configure Minio for Directus without interactive prompts
# This script can be used to automate the Minio configuration process
# Usage: ./configure-minio.sh [options]

# Change to the directus directory
cd "$(dirname "$0")"

# Display help message
function show_help {
    echo "Usage: $0 [options]"
    echo ""
    echo "This script configures Minio for Directus without interactive prompts."
    echo ""
    echo "Options:"
    echo "  -e, --endpoint ENDPOINT    Minio endpoint URL (default: http://localhost:9000)"
    echo "  -a, --access-key KEY       Minio access key (default: minioadmin)"
    echo "  -s, --secret-key SECRET    Minio secret key (default: minioadmin)"
    echo "  -b, --bucket NAME          Bucket name (default: directus)"
    echo "  -p, --public y|n           Set public read access (default: y)"
    echo "  -t, --test                 Test mode - print configuration without executing"
    echo "  -h, --help                 Show this help message"
    echo ""
    echo "Environment variables:"
    echo "  MINIO_ENDPOINT             Minio endpoint URL"
    echo "  MINIO_ACCESS_KEY           Minio access key"
    echo "  MINIO_SECRET_KEY           Minio secret key"
    echo "  MINIO_BUCKET_NAME          Bucket name"
    echo "  MINIO_SET_PUBLIC           Set public read access (y/n)"
    echo ""
    echo "Example:"
    echo "  $0 --endpoint http://minio:9000 --bucket my-bucket"
    echo "  $0 --access-key mykey --secret-key mysecret"
    echo ""
    echo "Note: This script requires the Minio Client (mc) to be installed."
    echo "      If not installed, the script will attempt to install it."
}

# Parse command line arguments
PARAMS=""
TEST_MODE="false"
while (( "$#" )); do
  case "$1" in
    -e|--endpoint)
      MINIO_ENDPOINT="$2"
      shift 2
      ;;
    -a|--access-key)
      MINIO_ACCESS_KEY="$2"
      shift 2
      ;;
    -s|--secret-key)
      MINIO_SECRET_KEY="$2"
      shift 2
      ;;
    -b|--bucket)
      MINIO_BUCKET_NAME="$2"
      shift 2
      ;;
    -p|--public)
      MINIO_SET_PUBLIC="$2"
      shift 2
      ;;
    -t|--test)
      TEST_MODE="true"
      shift
      ;;
    -h|--help)
      show_help
      exit 0
      ;;
    --) # end argument parsing
      shift
      break
      ;;
    -*|--*=) # unsupported flags
      echo "Error: Unsupported flag $1" >&2
      show_help
      exit 1
      ;;
    *) # preserve positional arguments
      PARAMS="$PARAMS $1"
      shift
      ;;
  esac
done

# Set positional arguments in their proper place
eval set -- "$PARAMS"

# Check for special case when called from npm script with -- --test
if [[ "$1" == "--" && "$2" == "--test" ]]; then
    TEST_MODE="true"
fi

# Run the automated setup script with the provided arguments
./setup-minio-automated.sh \
    ${MINIO_ENDPOINT:+--endpoint "$MINIO_ENDPOINT"} \
    ${MINIO_ACCESS_KEY:+--access-key "$MINIO_ACCESS_KEY"} \
    ${MINIO_SECRET_KEY:+--secret-key "$MINIO_SECRET_KEY"} \
    ${MINIO_BUCKET_NAME:+--bucket "$MINIO_BUCKET_NAME"} \
    ${MINIO_SET_PUBLIC:+--public "$MINIO_SET_PUBLIC"} \
    ${TEST_MODE:+$([ "$TEST_MODE" = "true" ] && echo "--test")}
