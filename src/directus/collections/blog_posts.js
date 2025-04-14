/**
 * Blog Posts collection definition for Directus
 */

export default {
  collection: 'blog_posts',
  meta: {
    icon: 'article',
    note: 'Blog posts for the website',
    display_template: '{{title}}',
    archive_field: 'status',
    archive_value: 'archived',
    unarchive_value: 'draft',
    singleton: false,
  },
  schema: {
    name: 'blog_posts',
  },
  fields: [
    {
      field: 'id',
      type: 'integer',
      meta: {
        hidden: true,
        readonly: true,
        interface: 'input',
        special: ['uuid'],
      },
      schema: {
        is_primary_key: true,
        has_auto_increment: true,
      },
    },
    {
      field: 'status',
      type: 'string',
      meta: {
        interface: 'select-dropdown',
        options: {
          choices: [
            { text: 'Published', value: 'published' },
            { text: 'Draft', value: 'draft' },
            { text: 'Archived', value: 'archived' },
          ],
        },
        width: 'half',
        required: true,
      },
      schema: {
        default_value: 'draft',
      },
    },
    {
      field: 'title',
      type: 'string',
      meta: {
        interface: 'input',
        width: 'full',
        required: true,
      },
    },
    {
      field: 'slug',
      type: 'string',
      meta: {
        interface: 'input',
        width: 'full',
        note: 'URL-friendly version of the title',
        required: true,
      },
    },
    {
      field: 'date_published',
      type: 'timestamp',
      meta: {
        interface: 'datetime',
        width: 'half',
        display: 'datetime',
        required: true,
      },
    },
    {
      field: 'author',
      type: 'string',
      meta: {
        interface: 'input',
        width: 'half',
      },
    },
    {
      field: 'featured_image',
      type: 'uuid',
      meta: {
        interface: 'file-image',
        special: ['file'],
        width: 'full',
      },
    },
    {
      field: 'content',
      type: 'text',
      meta: {
        interface: 'input-rich-text-md',
        width: 'full',
        note: 'Main content of the blog post',
        required: true,
      },
    },
    {
      field: 'excerpt',
      type: 'text',
      meta: {
        interface: 'input-multiline',
        width: 'full',
        note: 'Short summary of the blog post',
      },
    },
    {
      field: 'tags',
      type: 'json',
      meta: {
        interface: 'tags',
        width: 'full',
        options: {
          placeholder: 'Add a tag...',
        },
        special: ['cast-json'],
      },
    },
    {
      field: 'seo_title',
      type: 'string',
      meta: {
        interface: 'input',
        width: 'full',
        note: 'Title for SEO purposes (if different from main title)',
      },
    },
    {
      field: 'seo_description',
      type: 'text',
      meta: {
        interface: 'input-multiline',
        width: 'full',
        note: 'Description for SEO purposes',
      },
    },
  ],
};
