import { defineType, defineField } from "sanity";
import { StarIcon } from "@sanity/icons";

export const topScorer = defineType({
  name: "topScorer",
  title: "Top Scorer",
  type: "document",
  icon: StarIcon,
  fields: [
    defineField({
      name: "name",
      title: "Player Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "image",
      title: "Player Image",
      type: "image",
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "goals",
      title: "Goals",
      type: "number",
      validation: (rule) => rule.required().min(0),
    }),
    defineField({
      name: "club",
      title: "Club",
      type: "string",
      validation: (rule) => rule.required(),
    }),
  ],
  orderings: [
    {
      title: "Goals (Descending)",
      name: "goalsDesc",
      by: [{ field: "goals", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "goals",
      media: "image",
      club: "club",
    },
    prepare({ title, subtitle, media, club }) {
      return {
        title,
        subtitle: `${subtitle} goals — ${club}`,
        media,
      };
    },
  },
});
