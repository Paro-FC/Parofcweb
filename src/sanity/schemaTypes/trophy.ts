import { defineType, defineField } from 'sanity'
import { StarIcon } from '@sanity/icons'

export const trophy = defineType({
  name: 'trophy',
  title: 'Trophy',
  type: 'document',
  icon: StarIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'total',
      title: 'Total',
      type: 'number',
      validation: (rule) => rule.required().min(0),
    }),
  ],
  preview: {
    select: {
      name: 'name',
      total: 'total',
    },
    prepare({ name, total }) {
      return {
        title: name,
        subtitle: `${total} trophies`,
      }
    },
  },
})

