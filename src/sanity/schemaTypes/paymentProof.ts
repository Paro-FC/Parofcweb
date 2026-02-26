import { defineType, defineField } from 'sanity'
import { ImageIcon } from '@sanity/icons'

export const paymentProof = defineType({
  name: 'paymentProof',
  title: 'Payment Proof',
  type: 'document',
  icon: ImageIcon,
  fields: [
    defineField({
      name: 'orderId',
      title: 'Order ID',
      type: 'string',
      validation: (rule) => rule.required(),
      description: 'Checkout order ID (e.g. PFC-xxx)',
    }),
    defineField({
      name: 'paymentImage',
      title: 'Payment screenshot',
      type: 'image',
      validation: (rule) => rule.required(),
      description: 'Customer-uploaded proof of payment',
    }),
    defineField({
      name: 'uploadedAt',
      title: 'Uploaded at',
      type: 'datetime',
      description: 'When the proof was uploaded',
    }),
  ],
  preview: {
    select: {
      orderId: 'orderId',
      media: 'paymentImage',
    },
    prepare({ orderId, media }) {
      return {
        title: orderId ? `Payment proof: ${orderId}` : 'Payment proof',
        media,
      }
    },
  },
})
