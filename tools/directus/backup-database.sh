#!/bin/bash

# Script to backup the PostgreSQL database used by Directus

# Default backup directory
BACKUP_DIR="./backups"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Generate timestamp for the backup filename
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILENAME="directus_db_backup_$TIMESTAMP.sql"

echo "Starting PostgreSQL database backup..."

# Run the backup command using docker-compose
docker-compose exec -T postgres pg_dump -U postgres directus > "$BACKUP_DIR/$BACKUP_FILENAME"

# Check if backup was successful
if [ $? -eq 0 ]; then
  echo "Backup completed successfully!"
  echo "Backup saved to: $BACKUP_DIR/$BACKUP_FILENAME"
  
  # Compress the backup file
  echo "Compressing backup file..."
  gzip "$BACKUP_DIR/$BACKUP_FILENAME"
  
  if [ $? -eq 0 ]; then
    echo "Backup compressed: $BACKUP_DIR/$BACKUP_FILENAME.gz"
    echo "Backup size: $(du -h "$BACKUP_DIR/$BACKUP_FILENAME.gz" | cut -f1)"
  else
    echo "Warning: Failed to compress backup file."
  fi
else
  echo "Error: Database backup failed!"
  exit 1
fi

# List existing backups
echo ""
echo "Existing backups:"
ls -lh "$BACKUP_DIR" | grep ".gz"

echo ""
echo "To restore a backup, use:"
echo "  docker-compose exec -T postgres psql -U postgres directus < your_backup_file.sql"
echo ""
echo "Note: You may need to decompress the .gz file first with:"
echo "  gunzip your_backup_file.sql.gz"
