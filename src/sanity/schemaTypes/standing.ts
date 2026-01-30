import { defineType, defineField, defineArrayMember } from 'sanity'
import { DocumentIcon } from '@sanity/icons'

export const standing = defineType({
  name: 'standing',
  title: 'Standing',
  type: 'document',
  icon: DocumentIcon,
  fields: [
    defineField({
      name: 'season',
      title: 'Season',
      type: 'string',
      validation: (rule) => rule.required(),
      description: 'e.g., 2025, 2024-25',
    }),
    defineField({
      name: 'competition',
      title: 'Competition',
      type: 'string',
      options: {
        list: [
          { title: 'BOB Premier League', value: 'bpl' },
          { title: 'National Cup', value: 'cup' },
          { title: 'AFC Qualifiers', value: 'afc' },
        ],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'teams',
      title: 'Teams',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'position',
              title: 'Position',
              type: 'number',
              validation: (rule) => rule.required().min(1),
            }),
            defineField({
              name: 'teamName',
              title: 'Team Name',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'teamLogo',
              title: 'Team Logo',
              type: 'image',
              options: {
                hotspot: true,
              },
            }),
            defineField({
              name: 'played',
              title: 'Played',
              type: 'number',
              validation: (rule) => rule.required().min(0),
            }),
            defineField({
              name: 'won',
              title: 'Won',
              type: 'number',
              validation: (rule) => rule.required().min(0),
            }),
            defineField({
              name: 'drawn',
              title: 'Drawn',
              type: 'number',
              validation: (rule) => rule.required().min(0),
            }),
            defineField({
              name: 'lost',
              title: 'Lost',
              type: 'number',
              validation: (rule) => rule.required().min(0),
            }),
            defineField({
              name: 'goalsFor',
              title: 'Goals For',
              type: 'number',
              validation: (rule) => rule.required().min(0),
            }),
            defineField({
              name: 'goalsAgainst',
              title: 'Goals Against',
              type: 'number',
              validation: (rule) => rule.required().min(0),
            }),
            defineField({
              name: 'points',
              title: 'Points',
              type: 'number',
              validation: (rule) => rule.required().min(0),
            }),
            defineField({
              name: 'form',
              title: 'Form (Last 5 matches)',
              type: 'array',
              of: [
                {
                  type: 'string',
                  options: {
                    list: [
                      { title: 'Win', value: 'W' },
                      { title: 'Draw', value: 'D' },
                      { title: 'Loss', value: 'L' },
                    ],
                  },
                },
              ],
              validation: (rule) => rule.max(5),
              description: 'Last 5 match results (W = Win, D = Draw, L = Loss)',
            }),
          ],
          preview: {
            select: {
              position: 'position',
              teamName: 'teamName',
              points: 'points',
            },
            prepare({ position, teamName, points }) {
              return {
                title: `${position}. ${teamName}`,
                subtitle: `${points} points`,
              }
            },
          },
        }),
      ],
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: {
    select: {
      season: 'season',
      competition: 'competition',
    },
    prepare({ season, competition }) {
      const compNames: Record<string, string> = {
        bpl: 'BOB Premier League',
        cup: 'National Cup',
        afc: 'AFC Qualifiers',
      }
      return {
        title: `${compNames[competition] || competition} - ${season}`,
        subtitle: 'Standings',
      }
    },
  },
})

