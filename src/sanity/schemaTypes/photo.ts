import { defineType, defineField } from 'sanity'
import { ImageIcon } from '@sanity/icons'

export const photo = defineType({
  name: 'photo',
  title: 'Photo Gallery',
  type: 'document',
  icon: ImageIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      description: 'Single image used as the gallery thumbnail',
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'date',
      title: 'Date',
      type: 'datetime',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'galleryUrl',
      title: 'Gallery URL',
      type: 'url',
      description:
        'Link to the full gallery (Google Drive, Facebook album, website page, etc.)',
      validation: (rule) =>
        rule.required().uri({ scheme: ['http', 'https'] }),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      date: 'date',
      media: 'image',
      galleryUrl: 'galleryUrl',
    },
    prepare({ title, date, galleryUrl, media }) {
      const formattedDate = date ? new Date(date).toLocaleDateString() : ''
      return {
        title,
        subtitle: `${formattedDate}${galleryUrl ? ' - has link' : ''}`,
        media,
      }
    },
  },
})

