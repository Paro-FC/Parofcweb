/**
 * Parse a YouTube watch / short / youtu.be URL and return the video id.
 */
export function getYoutubeIdFromUrl(url: string): string | null {
  if (!url || typeof url !== "string") return null;
  try {
    const u = new URL(url.trim());
    const host = u.hostname.replace(/^www\./, "").toLowerCase();

    if (host === "youtu.be") {
      const id = u.pathname.replace(/^\//, "").split("/")[0];
      return id && /^[\w-]{11}$/.test(id) ? id : null;
    }

    if (
      host === "youtube.com" ||
      host === "m.youtube.com" ||
      host === "music.youtube.com"
    ) {
      const v = u.searchParams.get("v");
      if (v && /^[\w-]{11}$/.test(v)) return v;

      const embed = u.pathname.match(/^\/embed\/([\w-]{11})/);
      if (embed) return embed[1];

      const shorts = u.pathname.match(/^\/shorts\/([\w-]{11})/);
      if (shorts) return shorts[1];

      const live = u.pathname.match(/^\/live\/([\w-]{11})/);
      if (live) return live[1];
    }

    return null;
  } catch {
    return null;
  }
}

export function getYoutubeThumbnailUrl(
  videoId: string,
  quality: "maxres" | "hq" = "maxres",
): string {
  const suffix = quality === "maxres" ? "maxresdefault" : "hqdefault";
  return `https://i.ytimg.com/vi/${videoId}/${suffix}.jpg`;
}

export function getYoutubeNocookieEmbedUrl(
  videoId: string,
  autoplay = true,
): string {
  const params = new URLSearchParams({
    autoplay: autoplay ? "1" : "0",
    rel: "0",
    modestbranding: "1",
  });
  return `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`;
}

export function getYoutubeWatchUrl(videoId: string): string {
  return `https://www.youtube.com/watch?v=${videoId}`;
}
