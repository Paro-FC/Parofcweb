import { defineType, defineField } from "sanity";
import { PlayIcon } from "@sanity/icons";

function isYoutubeHost(hostname: string): boolean {
  const h = hostname.replace(/^www\./, "").toLowerCase();
  return (
    h === "youtube.com" ||
    h === "youtu.be" ||
    h === "m.youtube.com" ||
    h === "music.youtube.com"
  );
}

export const youtubeVideo = defineType({
  name: "youtubeVideo",
  title: "YouTube video",
  type: "document",
  icon: PlayIcon,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "Shown on the homepage card (e.g. episode title).",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "youtubeUrl",
      title: "YouTube URL",
      type: "url",
      validation: (rule) =>
        rule.required().custom((value) => {
          if (!value || typeof value !== "string") return true;
          try {
            const u = new URL(value);
            if (!isYoutubeHost(u.hostname)) {
              return "Use a youtube.com or youtu.be link";
            }
            return true;
          } catch {
            return "Invalid URL";
          }
        }),
    }),
    defineField({
      name: "publishedAt",
      title: "Published at",
      type: "datetime",
      description: "Optional. Used for relative time on the card (e.g. “3d”).",
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "youtubeUrl",
    },
  },
});
