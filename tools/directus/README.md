# Directus with PostgreSQL, Minio, and MailDev

This directory contains a Docker Compose configuration for running Directus with PostgreSQL as the database, along with Minio for S3 storage and MailDev for email testing.

## Configuration

The `docker-compose.yml` file is configured to run:

- **Directus**: The latest version of Directus headless CMS
- **PostgreSQL**: Version 13 with PostGIS extension for spatial data support (the only database)
- **Minio**: S3-compatible object storage
- **MailDev**: SMTP server and web interface for email testing

## Prerequisites

- Docker and Docker Compose installed on your system
- Basic understanding of Docker and containerization

## Getting Started

### Option 1: Using Environment Variables (Recommended for Production)

1. **Generate secure keys** for your Directus instance:
   ```bash
   cd tools/directus
   ./generate-keys.sh
   ```
   This will generate random secure strings for the `KEY` and `SECRET` environment variables.

2. **Create an environment file**:
   ```bash
   cp example.env .env
   ```

3. **Edit the .env file** with your preferred settings:
   - Update the generated `KEY` and `SECRET` values
   - Set your admin credentials (`ADMIN_EMAIL` and `ADMIN_PASSWORD`)
   - Configure any other settings as needed

4. **Start the services**:
   ```bash
   docker-compose up -d
   ```

### Option 2: Using Default Values (Quick Start for Development)

1. **Start the services** with default values:
   ```bash
   cd tools/directus
   docker-compose up -d
   ```

   Note: This will use the default values specified in the docker-compose.yml file. For production use, it's recommended to use Option 1 with a proper .env file.

4. **Access Directus**:
   - The Directus admin interface will be available at: http://localhost:8055
   - Log in with the admin credentials you configured

## Service Connection Details

### PostgreSQL Database
- **Host**: localhost
- **Port**: 5432
- **Database**: directus
- **Username**: postgres
- **Password**: secret

### Minio S3 Storage
- **Console URL**: http://localhost:9001
- **S3 Endpoint**: http://localhost:9000
- **Access Key**: minioadmin
- **Secret Key**: minioadmin

#### Interactive Setup

To set up Minio for use with Directus using an interactive prompt:
```bash
cd tools/directus
./setup-minio.sh
```
This script will:
1. Create a bucket in Minio for Directus
2. Set the bucket policy to allow public read access (optional)
3. Help you configure Directus to use Minio for storage

#### Automated Setup

To automate the Minio setup without interactive prompts:
```bash
cd tools/directus
./configure-minio.sh [options]
```

Available options:
- `-e, --endpoint ENDPOINT`: Minio endpoint URL (default: http://localhost:9000)
- `-a, --access-key KEY`: Minio access key (default: minioadmin)
- `-s, --secret-key SECRET`: Minio secret key (default: minioadmin)
- `-b, --bucket NAME`: Bucket name (default: directus)
- `-p, --public y|n`: Set public read access (default: y)
- `-h, --help`: Show help message

Examples:
```bash
# Use all defaults
./configure-minio.sh

# Specify a custom bucket name
./configure-minio.sh --bucket my-custom-bucket

# Specify custom credentials
./configure-minio.sh --access-key mykey --secret-key mysecret

# Disable public read access
./configure-minio.sh --public n

# Test mode - print configuration without executing
./configure-minio.sh --test
```

You can also use environment variables:
```bash
MINIO_BUCKET_NAME=my-bucket MINIO_SET_PUBLIC=n ./configure-minio.sh
```

The test mode option (`--test` or `-t`) is particularly useful for verifying your configuration without actually making any changes. This can be helpful when automating the setup process or when you want to ensure your configuration is correct before proceeding.

For convenience, there's also an npm script that runs the setup in test mode:
```bash
# From the project root directory
pnpm directus:minio-setup-test
```

### MailDev Email Testing
- **SMTP Server**: localhost:1025
- **Web Interface**: http://localhost:1080

## Persistence

The following Docker volumes are created for data persistence:

- `postgres_data`: Stores the PostgreSQL database files
- `directus_uploads`: Stores files uploaded to Directus
- `directus_extensions`: Stores Directus extensions

## Version Control

A `.gitignore` file template (`directus.gitignore`) is provided to ensure sensitive files are not committed to version control. To use it:

```bash
# If you're using this in a Git repository
cp directus.gitignore .gitignore
```

This will prevent the following from being committed:
- Environment variables (.env)
- Database backups
- Logs and temporary files

## Database Backup and Restore

This setup includes scripts to help you backup and restore your PostgreSQL database:

### Backup

To create a backup of your database:

```bash
cd tools/directus
./backup-database.sh
```

This will:
1. Create a timestamped SQL dump of your database
2. Compress it with gzip
3. Store it in the `./backups` directory

### Restore

To restore a database from a backup:

```bash
cd tools/directus
./restore-database.sh
```

This interactive script will:
1. Show you available backups
2. Ask which backup you want to restore
3. Confirm before overwriting your current database
4. Restore the selected backup

## Production Considerations

Before using this setup in production, consider:

1. Changing all default passwords
2. Enabling HTTPS with proper certificates
3. Setting up regular automated backups using the provided backup script
4. Configuring a more robust caching solution (Redis)
5. Adjusting resource limits based on your workload
6. Implementing a proper monitoring solution

For more information on production deployment, refer to the [official Directus documentation](https://docs.directus.io/self-hosted/docker-guide.html).
