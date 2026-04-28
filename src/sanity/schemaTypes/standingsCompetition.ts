import { defineType, defineField } from "sanity";
import { TagIcon } from "@sanity/icons";

export const standingsCompetition = defineType({
  name: "standingsCompetition",
  title: "Standings Competition",
  type: "document",
  icon: TagIcon,
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "short",
      title: "Short label",
      type: "string",
      validation: (rule) => rule.required().max(8),
      description: "Used on mobile tabs (e.g. BPL, Cup, AFC).",
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name", maxLength: 24 },
      validation: (rule) => rule.required(),
      description: "Internal ID used by the website (e.g. bpl, cup, afc).",
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
      initialValue: 100,
      validation: (rule) => rule.required().min(0),
      description: "Lower shows first in tabs.",
    }),
    defineField({
      name: "isActive",
      title: "Active",
      type: "boolean",
      initialValue: true,
      description: "If off, it won’t show in the website tabs.",
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "short",
      order: "order",
      active: "isActive",
    },
    prepare({ title, subtitle, order, active }) {
      return {
        title,
        subtitle: `${subtitle || ""} • order ${order}${active === false ? " • inactive" : ""}`,
      };
    },
  },
});

