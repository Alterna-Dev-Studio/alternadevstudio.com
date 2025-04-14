# Testing the Directus Connection

This guide demonstrates how to test the connection to Directus and verify that the required collections exist using the command line.

## Using the Test Script

The easiest way to test the connection is to use the provided test script:

```bash
# Run the test script
pnpm directus:test
```

This script will:
1. Check if Directus is running
2. Attempt to log in with the configured credentials
3. Check if the required collections exist
4. Count the number of items in each collection

### Expected Output

If everything is working correctly, you should see output similar to:

```
Testing connection to Directus...
URL: http://localhost:8055
Email: admin@alternadevstudio.com

Checking if Directus is running...
Directus health check: ok

Initializing Directus client...
Logging in to Directus...
Login successful!

Checking if required collections exist...
Collections found:
- blog_posts: ✅ Found
- projects: ✅ Found
- stream_recap: ✅ Found

Checking for items in collections...
- blog_posts: 0 items
- projects: 0 items
- stream_recap: 0 items

Connection test completed successfully!

You can now use Directus as a headless CMS for your website.
Access the admin interface at:
http://localhost:8055
```

## Manual Testing with curl

If you prefer to test the connection manually, you can use curl commands:

### 1. Check if Directus is running

```bash
curl -s http://localhost:8055/server/health | jq
```

Expected output:
```json
{
  "status": "ok"
}
```

### 2. Get an authentication token

```bash
curl -s -X POST http://localhost:8055/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@alternadevstudio.com","password":"admin123"}' | jq
```

Expected output (token will be different):
```json
{
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expires": 900000,
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

Save the access_token for the next steps:
```bash
export TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### 3. List collections

```bash
curl -s -X GET http://localhost:8055/collections \
  -H "Authorization: Bearer $TOKEN" | jq
```

Expected output (abbreviated):
```json
{
  "data": [
    {
      "collection": "blog_posts",
      "meta": {
        "collection": "blog_posts",
        "icon": "article",
        "note": "Blog posts for the website",
        "display_template": "{{title}}",
        "hidden": false,
        "singleton": false,
        "translations": null,
        "archive_field": "status",
        "archive_value": "archived",
        "unarchive_value": "draft",
        "archive_app_filter": true,
        "sort_field": null,
        "accountability": "all",
        "color": null,
        "item_duplication_fields": null,
        "sort": null,
        "group": null,
        "collapse": "open"
      },
      "schema": {
        "name": "blog_posts"
      }
    },
    {
      "collection": "projects",
      "meta": {
        "collection": "projects",
        "icon": "code",
        "note": "Development projects showcase",
        "display_template": "{{title}}",
        "hidden": false,
        "singleton": false,
        "translations": null,
        "archive_field": "status",
        "archive_value": "archived",
        "unarchive_value": "draft",
        "archive_app_filter": true,
        "sort_field": null,
        "accountability": "all",
        "color": null,
        "item_duplication_fields": null,
        "sort": null,
        "group": null,
        "collapse": "open"
      },
      "schema": {
        "name": "projects"
      }
    },
    {
      "collection": "stream_recap",
      "meta": {
        "collection": "stream_recap",
        "icon": "videocam",
        "note": "Recaps of streaming sessions",
        "display_template": "{{title}}",
        "hidden": false,
        "singleton": false,
        "translations": null,
        "archive_field": "status",
        "archive_value": "archived",
        "unarchive_value": "draft",
        "archive_app_filter": true,
        "sort_field": null,
        "accountability": "all",
        "color": null,
        "item_duplication_fields": null,
        "sort": null,
        "group": null,
        "collapse": "open"
      },
      "schema": {
        "name": "stream_recap"
      }
    }
  ]
}
```

### 4. Check items in a collection

```bash
# Check blog_posts
curl -s -X GET http://localhost:8055/items/blog_posts \
  -H "Authorization: Bearer $TOKEN" | jq

# Check projects
curl -s -X GET http://localhost:8055/items/projects \
  -H "Authorization: Bearer $TOKEN" | jq

# Check stream_recap
curl -s -X GET http://localhost:8055/items/stream_recap \
  -H "Authorization: Bearer $TOKEN" | jq
```

Expected output for a collection with no items:
```json
{
  "data": [],
  "meta": {
    "filter_count": 0,
    "total_count": 0
  }
}
```

## Troubleshooting

If you encounter issues:

1. Make sure Directus is running:
   ```bash
   pnpm directus:start
   ```

2. Check Docker container status:
   ```bash
   cd tools/directus
   docker-compose ps
   ```

3. Check Docker logs:
   ```bash
   cd tools/directus
   docker-compose logs directus
   ```

4. If needed, reset the environment:
   ```bash
   cd tools/directus
   docker-compose down -v
   pnpm directus:setup
   ```
