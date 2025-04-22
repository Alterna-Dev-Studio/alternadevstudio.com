# Makefile for AlternaDevStudio.com
# This Makefile simplifies managing the development environment

# Use bash as the shell
SHELL := /bin/bash

# Default target
.PHONY: help
help:
	@echo "AlternaDevStudio.com Development Environment"
	@echo ""
	@echo "Available targets:"
	@echo "  build         - Build the site for production"
	@echo "  clean         - Clean the build directory"
	@echo "  dev           - Start both Directus and the development server"
	@echo "  shutdown      - Stop both Directus and the development server"
	@echo "  reset         - Reset the entire development environment"
	@echo "  test          - Run all tests"

# Build the site for production
.PHONY: build
build:
	@echo "Building site for production..."
	pnpm build
	@echo "Build complete. Output is in the _site directory."

# Clean the build directory
.PHONY: clean
clean:
	@echo "Cleaning build directory..."
	pnpm clean

# Start both Directus and the development server
.PHONY: dev
dev:
	@echo "Starting development environment..."
	@echo "Starting Directus..."
	pnpm directus:start
	@echo "Starting development server..."
	pnpm start
	@echo "Development environment started."
	@echo "- Website: http://localhost:8080"
	@echo "- Directus: http://localhost:8055"

# Stop both Directus and the development server
.PHONY: shutdown
shutdown:
	@echo "Shutting down development environment..."
	@echo "Stopping development server..."
	pnpm eleventy:shutdown
	@echo "Stopping Directus..."
	pnpm directus:stop
	@echo "Development environment shut down."

# Reset the entire development environment
.PHONY: reset
reset:
	@echo "Resetting development environment..."
	@echo "Shutting down development environment..."
	pnpm eleventy:shutdown
	pnpm directus:stop
	@echo "Cleaning build directory..."
	pnpm clean
	@echo "Cleaning up Directus..."
	pnpm directus:clean
	@echo "Setting up development environment..."
	pnpm install
	pnpm directus:setup
	pnpm test:directus
	cd tools/directus && ./setup-minio-bucket.sh
	@if [ ! -f .env ]; then \
		echo "Creating .env file from .env.example..."; \
		cp .env.example .env; \
		echo "Environment file created."; \
	else \
		echo ".env file already exists. Skipping creation."; \
	fi
	pnpm directus:sample-content
	@echo "Development environment reset complete."

# Run all tests
.PHONY: test
test:
	@echo "Running all tests..."
	pnpm test
