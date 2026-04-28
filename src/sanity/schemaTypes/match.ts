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
      options: { hotspot: true },
      description: 'Upload the home team logo/crest',
    }),
    defineField({
      name: 'awayCrest',
      title: 'Away Team Logo',
      type: 'image',
      options: { hotspot: true },
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
      options: { hotspot: true },
      description: 'Upload the competition logo',
    }),
    defineField({
      name: 'date',
      title: 'Match Date & Time',
      type: 'datetime',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'matchday',
      title: 'Matchday',
      type: 'string',
      description: 'e.g., MD8, Semifinal, Group Stage',
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
      name: 'matchUrl',
      title: 'Match link',
      type: 'url',
      description:
        'External URL for this match (stream, recap, tickets, league page, etc.). Shown as a button on the match page.',
      validation: (rule) => rule.uri({ scheme: ['http', 'https'] }),
    }),
    defineField({
      name: 'status',
      title: 'Match Status',
      type: 'string',
      options: {
        list: [
          { title: 'Upcoming', value: 'upcoming' },
          { title: 'Live', value: 'live' },
          { title: 'Half Time', value: 'ht' },
          { title: 'Full Time', value: 'ft' },
          { title: 'Postponed', value: 'postponed' },
        ],
        layout: 'radio',
      },
      initialValue: 'upcoming',
    }),
    defineField({
      name: 'minute',
      title: 'Current Minute',
      type: 'string',
      description: 'Current match minute (e.g., 45, 90+3). Only relevant during live matches.',
      hidden: ({ document }) => document?.status !== 'live',
    }),
    defineField({
      name: 'homeScore',
      title: 'Home Score',
      type: 'number',
      initialValue: 0,
      validation: (rule) => rule.min(0),
    }),
    defineField({
      name: 'awayScore',
      title: 'Away Score',
      type: 'number',
      initialValue: 0,
      validation: (rule) => rule.min(0),
    }),
  ],
  preview: {
    select: {
      homeTeam: 'homeTeam',
      awayTeam: 'awayTeam',
      date: 'date',
      competition: 'competition',
      homeCrest: 'homeCrest',
      homeScore: 'homeScore',
      awayScore: 'awayScore',
      status: 'status',
    },
    prepare({ homeTeam, awayTeam, date, competition, homeCrest, homeScore, awayScore, status }) {
      const formattedDate = date ? new Date(date).toLocaleDateString() : 'TBD'
      const score = status && status !== 'upcoming' ? ` (${homeScore ?? 0} - ${awayScore ?? 0})` : ''
      return {
        title: `${homeTeam} vs ${awayTeam}${score}`,
        subtitle: `${competition} - ${formattedDate}`,
        media: homeCrest,
      }
    },
  },
})
