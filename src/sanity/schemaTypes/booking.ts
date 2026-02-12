import { defineType, defineField } from 'sanity'
import { TagIcon } from '@sanity/icons'

export const booking = defineType({
  name: 'booking',
  title: 'Ticket Booking',
  type: 'document',
  icon: TagIcon,
  fields: [
    defineField({
      name: 'match',
      title: 'Match',
      type: 'reference',
      to: [{ type: 'match' }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (rule) => rule.required().min(1).max(100),
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (rule) => rule.required().email(),
    }),
    defineField({
      name: 'phone',
      title: 'Contact Number',
      type: 'string',
      validation: (rule) => rule.required().min(1).max(20),
    }),
    defineField({
      name: 'quantity',
      title: 'Quantity',
      type: 'number',
      validation: (rule) => rule.required().min(1).max(100),
    }),
    defineField({
      name: 'bookingId',
      title: 'Booking ID',
      type: 'string',
      validation: (rule) => rule.required(),
      readOnly: true,
      description: 'Unique booking identifier',
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Confirmed', value: 'confirmed' },
          { title: 'Cancelled', value: 'cancelled' },
        ],
      },
      initialValue: 'confirmed',
    }),
    defineField({
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      bookingId: 'bookingId',
      name: 'name',
      match: 'match.homeTeam',
      quantity: 'quantity',
      status: 'status',
    },
    prepare({ bookingId, name, match, quantity, status }) {
      return {
        title: `${bookingId || 'New Booking'}`,
        subtitle: `${name} - ${quantity} ticket(s) for ${match || 'Match'}`,
        media: TagIcon,
      }
    },
  },
})

