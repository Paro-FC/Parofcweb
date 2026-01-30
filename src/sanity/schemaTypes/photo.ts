import { defineType, defineField, defineArrayMember } from 'sanity'
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
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      description: 'Main image displayed in the gallery grid',
      options: {
        hotspot: true,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Match', value: 'Match' },
          { title: 'Training', value: 'Training' },
          { title: 'Press', value: 'Press' },
          { title: 'Team', value: 'Team' },
          { title: 'First Team', value: 'FIRST TEAM' },
        ],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'date',
      title: 'Date',
      type: 'datetime',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'images',
      title: 'Gallery Images',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            defineField({
              name: 'alt',
              title: 'Alt Text',
              type: 'string',
            }),
            defineField({
              name: 'caption',
              title: 'Caption',
              type: 'string',
            }),
          ],
        }),
      ],
      description: 'All images in this gallery',
      validation: (rule) => rule.required().min(1),
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
      category: 'category',
      date: 'date',
      media: 'coverImage',
      imageCount: 'images',
    },
    prepare({ title, category, date, media, imageCount }) {
      const imageCountValue = Array.isArray(imageCount) ? imageCount.length : 0
      const formattedDate = date ? new Date(date).toLocaleDateString() : ''
      return {
        title,
        subtitle: `${category} - ${imageCountValue} photos - ${formattedDate}`,
        media,
      }
    },
  },
})

