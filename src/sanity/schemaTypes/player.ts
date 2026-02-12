import { defineType, defineField } from 'sanity'
import { UserIcon } from '@sanity/icons'

export const player = defineType({
  name: 'player',
  title: 'Player',
  type: 'document',
  icon: UserIcon,
  fields: [
    defineField({
      name: 'firstName',
      title: 'First Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'lastName',
      title: 'Last Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'number',
      title: 'Jersey Number',
      type: 'number',
      validation: (rule) => rule.required().min(1).max(99),
    }),
    defineField({
      name: 'team',
      title: 'Team',
      type: 'string',
      options: {
        list: [
          { title: "Men's Team", value: 'mens' },
          { title: "Women's Team", value: 'womens' },
        ],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
      initialValue: 'mens',
    }),
    defineField({
      name: 'position',
      title: 'Position',
      type: 'string',
      options: {
        list: [
          { title: 'Goalkeeper', value: 'Goalkeeper' },
          { title: 'Defender', value: 'Defender' },
          { title: 'Midfielder', value: 'Midfielder' },
          { title: 'Forward', value: 'Forward' },
        ],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: (doc) => `${doc.firstName}-${doc.lastName}`,
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Player Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'bio',
      title: 'Biography',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Player biography and career information',
    }),
    defineField({
      name: 'placeOfBirth',
      title: 'Place of Birth',
      type: 'string',
    }),
    defineField({
      name: 'dateOfBirth',
      title: 'Date of Birth',
      type: 'date',
    }),
    defineField({
      name: 'height',
      title: 'Height (cm)',
      type: 'number',
    }),
    defineField({
      name: 'weight',
      title: 'Weight (kg)',
      type: 'number',
    }),
    defineField({
      name: 'honours',
      title: 'Honours',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'competition',
              title: 'Competition',
              type: 'string',
            }),
            defineField({
              name: 'season',
              title: 'Season',
              type: 'string',
            }),
            defineField({
              name: 'country',
              title: 'Country/Team',
              type: 'string',
              description: 'e.g., Spain, Paro FC',
            }),
          ],
        },
      ],
    }),
    defineField({
      name: 'stats',
      title: 'Statistics',
      type: 'object',
      fields: [
        defineField({
          name: 'appearances',
          title: 'Appearances',
          type: 'object',
          fields: [
            defineField({ name: 'value', title: 'Value', type: 'number' }),
            defineField({ name: 'season', title: 'Season', type: 'string' }),
          ],
        }),
        defineField({
          name: 'cleanSheets',
          title: 'Clean Sheets',
          type: 'object',
          fields: [
            defineField({ name: 'value', title: 'Value', type: 'number' }),
            defineField({ name: 'season', title: 'Season', type: 'string' }),
          ],
        }),
        defineField({
          name: 'saves',
          title: 'Saves',
          type: 'object',
          fields: [
            defineField({ name: 'value', title: 'Value', type: 'number' }),
            defineField({ name: 'season', title: 'Season', type: 'string' }),
          ],
        }),
        defineField({
          name: 'goals',
          title: 'Goals',
          type: 'object',
          fields: [
            defineField({ name: 'value', title: 'Value', type: 'number' }),
            defineField({ name: 'season', title: 'Season', type: 'string' }),
          ],
        }),
        defineField({
          name: 'assists',
          title: 'Assists',
          type: 'object',
          fields: [
            defineField({ name: 'value', title: 'Value', type: 'number' }),
            defineField({ name: 'season', title: 'Season', type: 'string' }),
          ],
        }),
      ],
    }),
  ],
  preview: {
    select: {
      firstName: 'firstName',
      lastName: 'lastName',
      number: 'number',
      position: 'position',
      media: 'image',
    },
    prepare({ firstName, lastName, number, position, media }) {
      return {
        title: `${number}. ${firstName} ${lastName}`,
        subtitle: position,
        media,
      }
    },
  },
})

