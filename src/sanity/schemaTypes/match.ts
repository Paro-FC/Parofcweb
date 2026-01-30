import { defineType, defineField } from 'sanity'
import { CalendarIcon } from '@sanity/icons'

export const match = defineType({
  name: 'match',
  title: 'Match',
  type: 'document',
  icon: CalendarIcon,
  fields: [
    defineField({
      name: 'homeTeam',
      title: 'Home Team',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'awayTeam',
      title: 'Away Team',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'homeCrest',
      title: 'Home Team Logo',
      type: 'image',
      options: {
        hotspot: true,
      },
      description: 'Upload the home team logo/crest',
    }),
    defineField({
      name: 'awayCrest',
      title: 'Away Team Logo',
      type: 'image',
      options: {
        hotspot: true,
      },
      description: 'Upload the away team logo/crest',
    }),
    defineField({
      name: 'competition',
      title: 'Competition',
      type: 'string',
      options: {
        list: [
          { title: 'Liga Premier', value: 'Liga Premier' },
          { title: 'Copa Nacional', value: 'Copa Nacional' },
          { title: 'AFC Cup', value: 'AFC Cup' },
          { title: 'Friendly', value: 'Friendly' },
        ],
      },
    }),
    defineField({
      name: 'competitionLogo',
      title: 'Competition Logo',
      type: 'image',
      options: {
        hotspot: true,
      },
      description: 'Upload the competition logo',
    }),
    defineField({
      name: 'date',
      title: 'Match Date & Time',
      type: 'datetime',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'event',
      title: 'Event Description',
      type: 'string',
      description: 'e.g., Liga Premier, Matchday 8',
    }),
    defineField({
      name: 'venue',
      title: 'Venue',
      type: 'string',
    }),
    defineField({
      name: 'hasTickets',
      title: 'Tickets Available',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      homeTeam: 'homeTeam',
      awayTeam: 'awayTeam',
      date: 'date',
      competition: 'competition',
      homeCrest: 'homeCrest',
    },
    prepare({ homeTeam, awayTeam, date, competition, homeCrest }) {
      const formattedDate = date ? new Date(date).toLocaleDateString() : 'TBD'
      return {
        title: `${homeTeam} vs ${awayTeam}`,
        subtitle: `${competition} - ${formattedDate}`,
        media: homeCrest,
      }
    },
  },
})

