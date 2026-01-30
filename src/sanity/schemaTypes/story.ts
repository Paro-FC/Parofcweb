import { defineType, defineField, defineArrayMember } from 'sanity'
import { PlayIcon } from '@sanity/icons'

export const story = defineType({
  name: 'story',
  title: 'Story',
  type: 'document',
  icon: PlayIcon,
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
      description: 'Thumbnail shown in the stories carousel',
      options: {
        hotspot: true,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'media',
      title: 'Story Media',
      type: 'array',
      description: 'Add images and videos for this story',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'storyImage',
          title: 'Image',
          fields: [
            defineField({
              name: 'image',
              title: 'Image',
              type: 'image',
              options: { hotspot: true },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'caption',
              title: 'Caption',
              type: 'string',
            }),
            defineField({
              name: 'duration',
              title: 'Duration (seconds)',
              type: 'number',
              initialValue: 5,
              validation: (rule) => rule.min(1).max(30),
            }),
          ],
          preview: {
            select: {
              media: 'image',
              caption: 'caption',
            },
            prepare({ media, caption }) {
              return {
                title: caption || 'Image',
                media,
              }
            },
          },
        }),
        defineArrayMember({
          type: 'object',
          name: 'storyVideo',
          title: 'Video',
          fields: [
            defineField({
              name: 'video',
              title: 'Video',
              type: 'file',
              options: {
                accept: 'video/*',
              },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'caption',
              title: 'Caption',
              type: 'string',
            }),
            defineField({
              name: 'poster',
              title: 'Video Poster',
              type: 'image',
              description: 'Thumbnail shown while video loads',
            }),
          ],
          preview: {
            select: {
              caption: 'caption',
              poster: 'poster',
            },
            prepare({ caption, poster }) {
              return {
                title: caption || 'Video',
                media: poster,
              }
            },
          },
        }),
      ],
      validation: (rule) => rule.min(1).error('Add at least one image or video'),
    }),
    defineField({
      name: 'isNew',
      title: 'Mark as New',
      type: 'boolean',
      initialValue: true,
      description: 'Show "NEW" badge on this story',
    }),
    defineField({
      name: 'expiresAt',
      title: 'Expires At',
      type: 'datetime',
      description: 'Optional: When this story should no longer be shown',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'coverImage',
      isNew: 'isNew',
    },
    prepare({ title, media, isNew }) {
      return {
        title,
        subtitle: isNew ? '🆕 New' : '',
        media,
      }
    },
  },
})
