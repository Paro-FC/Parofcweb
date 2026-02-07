import { defineType, defineField } from 'sanity'
import { TagIcon } from '@sanity/icons'

export const product = defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  icon: TagIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'hoverImage',
      title: 'Hover Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      description: 'Optional image shown on hover',
    }),
    defineField({
      name: 'collection',
      title: 'Collection',
      type: 'string',
      options: {
        list: [
          { title: 'Home Kit', value: 'home-kit' },
          { title: 'Away Kit', value: 'away-kit' },
          { title: 'Third Kit', value: 'third-kit' },
          { title: 'Training', value: 'training' },
          { title: 'Retro Collection', value: 'retro' },
          { title: 'Fan Collection', value: 'fan' },
          { title: 'Accessories', value: 'accessories' },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'price',
      title: 'Price',
      type: 'number',
      validation: (rule) => rule.required().min(0),
    }),
    defineField({
      name: 'currency',
      title: 'Currency',
      type: 'string',
      initialValue: 'BTN',
      options: {
        list: [
          { title: 'BTN (Nu.)', value: 'BTN' },
          { title: 'USD ($)', value: 'USD' },
        ],
      },
    }),
    defineField({
      name: 'salePrice',
      title: 'Sale Price',
      type: 'number',
      description: 'Optional discounted price',
    }),
    defineField({
      name: 'badge',
      title: 'Badge',
      type: 'string',
      options: {
        list: [
          { title: 'New', value: 'new' },
          { title: 'Exclusive', value: 'exclusive' },
          { title: 'Sale', value: 'sale' },
          { title: 'Limited Edition', value: 'limited' },
          { title: 'Best Seller', value: 'bestseller' },
        ],
      },
    }),
    defineField({
      name: 'sizes',
      title: 'Available Sizes',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'XS', value: 'XS' },
          { title: 'S', value: 'S' },
          { title: 'M', value: 'M' },
          { title: 'L', value: 'L' },
          { title: 'XL', value: 'XL' },
          { title: 'XXL', value: 'XXL' },
        ],
      },
    }),
    defineField({
      name: 'inStock',
      title: 'In Stock',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'collection',
      media: 'image',
      price: 'price',
      currency: 'currency',
    },
    prepare({ title, subtitle, media, price, currency }) {
      const currencySymbol = currency === 'BTN' ? 'Nu.' : '$'
      return {
        title,
        subtitle: `${subtitle} - ${currencySymbol}${price}`,
        media,
      }
    },
  },
})

