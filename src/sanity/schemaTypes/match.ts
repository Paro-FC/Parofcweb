import { defineType, defineField, defineArrayMember } from 'sanity'
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

    // Match Events (goals, cards, substitutions)
    defineField({
      name: 'matchEvents',
      title: 'Match Events',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'type',
              title: 'Event Type',
              type: 'string',
              options: {
                list: [
                  { title: 'Goal', value: 'goal' },
                  { title: 'Penalty Goal', value: 'penalty' },
                  { title: 'Own Goal', value: 'ownGoal' },
                  { title: 'Yellow Card', value: 'yellowCard' },
                  { title: 'Red Card', value: 'redCard' },
                  { title: 'Substitution', value: 'substitution' },
                ],
              },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'minute',
              title: 'Minute',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'player',
              title: 'Player Name',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'team',
              title: 'Team',
              type: 'string',
              options: {
                list: [
                  { title: 'Home', value: 'home' },
                  { title: 'Away', value: 'away' },
                ],
              },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'assistPlayer',
              title: 'Assist / Substituted Player',
              type: 'string',
              description: 'Assist for goals, player substituted off for subs',
            }),
          ],
          preview: {
            select: {
              type: 'type',
              minute: 'minute',
              player: 'player',
              team: 'team',
            },
            prepare({ type, minute, player, team }) {
              const icons: Record<string, string> = {
                goal: '\u26BD',
                penalty: '\u26BD(P)',
                ownGoal: '\u26BD(OG)',
                yellowCard: '\uD83D\uDFE8',
                redCard: '\uD83D\uDFE5',
                substitution: '\uD83D\uDD04',
              }
              return {
                title: `${minute}' ${icons[type] || ''} ${player}`,
                subtitle: `${team === 'home' ? 'Home' : 'Away'}`,
              }
            },
          },
        }),
      ],
    }),

    // Match Statistics
    defineField({
      name: 'matchStats',
      title: 'Match Statistics',
      type: 'object',
      fields: [
        defineField({ name: 'homeShots', title: 'Home Shots', type: 'number', initialValue: 0 }),
        defineField({ name: 'awayShots', title: 'Away Shots', type: 'number', initialValue: 0 }),
        defineField({ name: 'homeShotsOnTarget', title: 'Home Shots on Target', type: 'number', initialValue: 0 }),
        defineField({ name: 'awayShotsOnTarget', title: 'Away Shots on Target', type: 'number', initialValue: 0 }),
        defineField({ name: 'homePossession', title: 'Home Possession (%)', type: 'number', initialValue: 50 }),
        defineField({ name: 'awayPossession', title: 'Away Possession (%)', type: 'number', initialValue: 50 }),
        defineField({ name: 'homePasses', title: 'Home Passes', type: 'number', initialValue: 0 }),
        defineField({ name: 'awayPasses', title: 'Away Passes', type: 'number', initialValue: 0 }),
        defineField({ name: 'homePassAccuracy', title: 'Home Pass Accuracy (%)', type: 'number', initialValue: 0 }),
        defineField({ name: 'awayPassAccuracy', title: 'Away Pass Accuracy (%)', type: 'number', initialValue: 0 }),
        defineField({ name: 'homeFouls', title: 'Home Fouls', type: 'number', initialValue: 0 }),
        defineField({ name: 'awayFouls', title: 'Away Fouls', type: 'number', initialValue: 0 }),
        defineField({ name: 'homeOffsides', title: 'Home Offsides', type: 'number', initialValue: 0 }),
        defineField({ name: 'awayOffsides', title: 'Away Offsides', type: 'number', initialValue: 0 }),
        defineField({ name: 'homeCorners', title: 'Home Corners', type: 'number', initialValue: 0 }),
        defineField({ name: 'awayCorners', title: 'Away Corners', type: 'number', initialValue: 0 }),
      ],
    }),

    // Lineups
    defineField({
      name: 'homeLineup',
      title: 'Home Team Lineup',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'name', title: 'Player Name', type: 'string', validation: (rule) => rule.required() }),
            defineField({ name: 'number', title: 'Number', type: 'number' }),
            defineField({
              name: 'position',
              title: 'Position',
              type: 'string',
              options: {
                list: [
                  { title: 'Goalkeeper', value: 'GK' },
                  { title: 'Defender', value: 'DEF' },
                  { title: 'Midfielder', value: 'MID' },
                  { title: 'Forward', value: 'FWD' },
                ],
              },
            }),
            defineField({ name: 'isCaptain', title: 'Captain', type: 'boolean', initialValue: false }),
            defineField({ name: 'rating', title: 'Rating', type: 'number', description: 'Player rating (0-10)' }),
          ],
          preview: {
            select: { name: 'name', number: 'number', position: 'position' },
            prepare({ name, number, position }) {
              return { title: `${number ? '#' + number + ' ' : ''}${name}`, subtitle: position }
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'awayLineup',
      title: 'Away Team Lineup',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'name', title: 'Player Name', type: 'string', validation: (rule) => rule.required() }),
            defineField({ name: 'number', title: 'Number', type: 'number' }),
            defineField({
              name: 'position',
              title: 'Position',
              type: 'string',
              options: {
                list: [
                  { title: 'Goalkeeper', value: 'GK' },
                  { title: 'Defender', value: 'DEF' },
                  { title: 'Midfielder', value: 'MID' },
                  { title: 'Forward', value: 'FWD' },
                ],
              },
            }),
            defineField({ name: 'isCaptain', title: 'Captain', type: 'boolean', initialValue: false }),
            defineField({ name: 'rating', title: 'Rating', type: 'number', description: 'Player rating (0-10)' }),
          ],
          preview: {
            select: { name: 'name', number: 'number', position: 'position' },
            prepare({ name, number, position }) {
              return { title: `${number ? '#' + number + ' ' : ''}${name}`, subtitle: position }
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'homeFormation',
      title: 'Home Formation',
      type: 'string',
      description: 'e.g., 4-3-3, 4-4-2',
    }),
    defineField({
      name: 'awayFormation',
      title: 'Away Formation',
      type: 'string',
      description: 'e.g., 4-3-3, 4-4-2',
    }),

    // Tickets
    defineField({
      name: 'hasTickets',
      title: 'Tickets Available',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'ticketAvailability',
      title: 'Ticket Availability',
      type: 'number',
      description: 'Number of tickets available for this match',
      validation: (rule) => rule.min(0),
      hidden: ({ document }) => !document?.hasTickets,
    }),
    defineField({
      name: 'ticketPrice',
      title: 'Ticket Price',
      type: 'number',
      description: 'Price per ticket (optional)',
      validation: (rule) => rule.min(0),
      hidden: ({ document }) => !document?.hasTickets,
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
