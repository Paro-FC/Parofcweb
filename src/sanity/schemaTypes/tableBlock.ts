import { defineType, defineField, defineArrayMember } from 'sanity'

export const tableBlock = defineType({
  name: 'tableBlock',
  title: 'Table',
  type: 'object',
  fields: [
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
      description: 'Optional caption displayed below the table',
    }),
    defineField({
      name: 'headerRow',
      title: 'First row is header',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'rows',
      title: 'Rows',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'cells',
              title: 'Cells',
              type: 'array',
              of: [defineArrayMember({ type: 'string' })],
            }),
          ],
          preview: {
            select: { cells: 'cells' },
            prepare({ cells }: { cells?: string[] }) {
              return {
                title: Array.isArray(cells) && cells.length
                  ? cells.join(' | ')
                  : 'Empty row',
              }
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: { rows: 'rows', caption: 'caption' },
    prepare({ rows, caption }: { rows?: { cells?: string[] }[]; caption?: string }) {
      const rowCount = Array.isArray(rows) ? rows.length : 0
      const colCount = rows?.[0]?.cells?.length ?? 0
      return {
        title: caption || 'Table',
        subtitle: rowCount ? `${rowCount} rows × ${colCount} cols` : 'Empty table',
      }
    },
  },
})
