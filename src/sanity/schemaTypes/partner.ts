import { defineType, defineField } from 'sanity'
import { LinkIcon } from '@sanity/icons'

export const partner = defineType({
  name: 'partner',
  title: 'Partner',
  type: 'document',
  icon: LinkIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Partner Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'url',
      title: 'Website URL',
      type: 'url',
      validation: (rule) => rule.required().uri({
        scheme: ['http', 'https'],
      }),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Main Partner', value: 'main' },
          { title: 'Official Partner', value: 'official' },
          { title: 'Regional Partner', value: 'regional' },
          { title: 'Media Partner', value: 'media' },
          { title: 'Technology Partner', value: 'technology' },
        ],
      },
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers appear first',
      initialValue: 0,
    }),
    defineField({
      name: 'isActive',
      title: 'Active',
      type: 'boolean',
      initialValue: true,
      description: 'Show this partner on the website',
    }),
  ],
  preview: {
    select: {
      name: 'name',
      media: 'logo',
      category: 'category',
      isActive: 'isActive',
    },
    prepare({ name, media, category, isActive }) {
      return {
        title: name,
        subtitle: `${category || 'No category'}${isActive ? '' : ' (Inactive)'}`,
        media,
      }
    },
  },
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
    {
      title: 'Name',
      name: 'nameAsc',
      by: [{ field: 'name', direction: 'asc' }],
    },
  ],
})

