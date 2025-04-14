#!/bin/bash

# Script to restore a PostgreSQL database backup for Directus

# Default backup directory
BACKUP_DIR="./backups"

# Check if backup directory exists
if [ ! -d "$BACKUP_DIR" ]; then
  echo "Error: Backup directory '$BACKUP_DIR' does not exist."
  exit 1
fi

# List available backups
echo "Available backups:"
ls -lh "$BACKUP_DIR" | grep -E "\.sql$|\.sql\.gz$"

# Ask for backup file to restore
echo ""
echo "Enter the backup filename to restore (from the list above):"
read BACKUP_FILE

# Check if the file exists
if [ ! -f "$BACKUP_DIR/$BACKUP_FILE" ]; then
  echo "Error: Backup file '$BACKUP_DIR/$BACKUP_FILE' does not exist."
  exit 1
fi

# Check if the file is compressed
if [[ "$BACKUP_FILE" == *.gz ]]; then
  echo "Backup file is compressed. Decompressing..."
  gunzip -c "$BACKUP_DIR/$BACKUP_FILE" > "$BACKUP_DIR/temp_restore.sql"
  RESTORE_FILE="$BACKUP_DIR/temp_restore.sql"
else
  RESTORE_FILE="$BACKUP_DIR/$BACKUP_FILE"
fi

echo "Warning: This will overwrite the current database. All existing data will be lost."
echo "Are you sure you want to continue? (y/n)"
read CONFIRM

if [ "$CONFIRM" != "y" ] && [ "$CONFIRM" != "Y" ]; then
  echo "Restore cancelled."
  
  # Clean up temporary file if it exists
  if [ -f "$BACKUP_DIR/temp_restore.sql" ]; then
    rm "$BACKUP_DIR/temp_restore.sql"
  fi
  
  exit 0
fi

echo "Starting database restore..."

# Restore the database
cat "$RESTORE_FILE" | docker-compose exec -T postgres psql -U postgres directus

# Check if restore was successful
if [ $? -eq 0 ]; then
  echo "Database restore completed successfully!"
else
  echo "Error: Database restore failed!"
fi

# Clean up temporary file if it exists
if [ -f "$BACKUP_DIR/temp_restore.sql" ]; then
  rm "$BACKUP_DIR/temp_restore.sql"
  echo "Temporary files cleaned up."
fi
