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
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'category' }],
      validation: (rule) => rule.required(),
      description: 'Product category (required)',
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
    defineField({
      name: 'assemblyRequired',
      title: 'Assembly Required',
      type: 'boolean',
      initialValue: false,
      description: 'Whether the product requires assembly',
    }),
    defineField({
      name: 'color',
      title: 'Color',
      type: 'string',
      description: 'Product color (e.g., natural, black, white)',
    }),
    defineField({
      name: 'dimensions',
      title: 'Dimensions',
      type: 'string',
      description: 'Product dimensions (e.g., 40cm base x 200cm height x 180cm reach)',
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      initialValue: false,
      description: 'Whether this product should be featured prominently',
    }),
    defineField({
      name: 'images',
      title: 'Additional Images',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
      description: 'Additional product images (supplements main image and hover image)',
    }),
    defineField({
      name: 'material',
      title: 'Material',
      type: 'string',
      description: 'Product material (e.g., metal, wood, fabric)',
    }),
    defineField({
      name: 'stock',
      title: 'Stock Quantity',
      type: 'number',
      description: 'Number of items in stock',
      validation: (rule) => rule.min(0),
    }),
  ],
  preview: {
    select: {
      title: 'name',
      categoryTitle: 'category.title',
      media: 'image',
      price: 'price',
      currency: 'currency',
    },
    prepare({ title, categoryTitle, media, price, currency }) {
      const currencySymbol = currency === 'BTN' ? 'Nu.' : '$'
      return {
        title,
        subtitle: `${categoryTitle || 'No category'} - ${currencySymbol}${price}`,
        media,
      }
    },
  },
})

