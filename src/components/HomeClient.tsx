"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  Calendar,
  Clock,
  MapPin,
  ChevronRight,
  Play,
  ArrowUpRight01Icon,
} from "@hugeicons/core-free-icons";
import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";
import { getYoutubeIdFromUrl } from "@/lib/youtube";
import { Hero } from "@/components/Hero";
import { useSanityLiveQuery } from "@/sanity/lib/live-client";
import { STANDINGS_HOME_LATEST_QUERY } from "@/sanity/lib/queries";

/* ─── TYPES ─── */
interface NewsItem {
  _id: string;
  image: any;
  title: string;
  badge?: string;
  publishedAt: string;
  slug: string;
}

interface Match {
  _id: string;
  homeTeam: string;
  awayTeam: string;
  homeCrest?: string | null;
  awayCrest?: string | null;
  competition: string;
  date: string;
  event: string;
  venue: string;
  matchUrl?: string;
}

interface Partner {
  _id: string;
  name: string;
  logo: string;
  url: string;
  category?: string;
}

interface TrophyItem {
  _id: string;
  name: string;
  total: number;
}

interface StandingTeam {
  position: number;
  teamName: string;
  teamLogo?: string | null;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
  form?: string[] | null;
}

interface StandingDoc {
  _id: string;
  season: string;
  competition: string;
  teams: StandingTeam[];
}

interface YoutubeVideo {
  _id: string;
  title: string;
  youtubeUrl: string;
  publishedAt?: string;
}

interface HomeClientProps {
  news: NewsItem[];
  matches: Match[];
  mainPartners: Partner[];
  trophies: TrophyItem[];
  youtubeVideos: YoutubeVideo[];
  standings?: StandingDoc | null;
}

function formatGD(gd: number) {
  return gd > 0 ? `+${gd}` : `${gd}`;
}

function zoneFromPosition(position: number) {
  if (position === 1) return "green";
  if (position === 8) return "orange";
  if (position >= 9) return "red";
  return null;
}

/* ─── SMALL COMPONENTS ─── */
function Crest({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const s = { sm: "h-7 w-7", md: "h-12 w-12", lg: "h-16 w-16" }[size];
  return (
    <div className={`${s} shrink-0 overflow-hidden rounded-full`}>
      <Image src="/assets/logo.webp" alt="Paro FC" width={64} height={64} className="h-full w-full object-contain" />
    </div>
  );
}

function TeamInitialsLogo({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white/5 ring-1 ring-white/10">
      <span className="text-3xs font-black uppercase tracking-wide text-white/40">
        {initials || "—"}
      </span>
    </div>
  );
}

function FormBadge({ v }: { v: string }) {
  const c = v === "W" ? "bg-green-500" : v === "D" ? "bg-yellow-500" : "bg-red-600";
  return <span className={`grid h-[18px] w-[18px] place-items-center rounded-[4px] text-3xs font-black text-white ${c}`}>{v}</span>;
}

function ZoneBar({ zone }: { zone: string | null }) {
  if (!zone) return null;
  const c = zone === "green" ? "bg-green-500" : zone === "orange" ? "bg-orange-400" : "bg-red-500";
  return <div className={`absolute left-0 top-0 h-full w-[3px] ${c}`} />;
}

function CountdownBlock({ value, label, showDivider = true }: { value: string; label: string; showDivider?: boolean }) {
  return (
    <div className="flex items-stretch">
      <div className="px-3 py-1 text-center sm:px-4">
        <div className="text-3xl font-black tabular-nums text-parofc-red sm:text-4xl">{value}</div>
        <p className="text-3xs font-bold uppercase tracking-wider text-white/40 sm:text-2xs">{label}</p>
      </div>
      {showDivider && <div className="my-4 hidden w-px bg-gradient-to-b from-transparent via-parofc-red/40 to-transparent sm:block" />}
    </div>
  );
}

function SectionCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-lg border border-parofc-red/20 bg-[#111111] ${className}`}>{children}</div>;
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" }).toUpperCase();
}

/* ─── MAIN ─── */
export function HomeClient({ news, matches, mainPartners, trophies, youtubeVideos, standings }: HomeClientProps) {
  const nextMatch = matches?.[0];
  const topNews = news?.slice(0, 3) ?? [];
  const topVideos = youtubeVideos?.slice(0, 5) ?? [];
  const liveStandings = useSanityLiveQuery<StandingDoc | null>(
    STANDINGS_HOME_LATEST_QUERY,
    {},
    standings ?? null
  );
  const standingTeams = (liveStandings?.teams ?? []).slice().sort((a, b) => a.position - b.position);

  const raceToTitle =
    standingTeams.length > 0
      ? standingTeams
          .slice()
          .sort((a, b) => b.points - a.points)
          .slice(0, 3)
          .map((t, idx) => ({
            pos: idx + 1,
            name: t.teamName,
            pts: t.points,
            color: idx === 0 ? "text-parofc-red" : "text-white",
          }))
      : [];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* ══════ HERO ══════ */}
      <Hero news={news} />

      {/* ══════ NEXT MATCH BAR ══════ */}
      {nextMatch && (
        <section className="mx-auto max-w-[1400px] px-5 py-8">
          <div className="rounded-lg border border-parofc-red/25 bg-[#141414] px-4 py-5 sm:px-6">
            <div className="mb-5">
              <h2 className="text-lg font-black uppercase text-parofc-red">Next Match</h2>
              <p className="text-xs font-bold uppercase tracking-wider text-white/40">{nextMatch.competition}</p>
            </div>

            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-start sm:gap-8">
                <div className="text-center">
                  {nextMatch.homeCrest ? (
                    <div className="mx-auto h-16 w-16 overflow-hidden rounded-full">
                      <Image src={nextMatch.homeCrest} alt={nextMatch.homeTeam} width={64} height={64} className="h-full w-full object-contain" />
                    </div>
                  ) : <Crest size="lg" />}
                  <p className="mt-2 text-sm font-black uppercase tracking-wider sm:text-base">{nextMatch.homeTeam}</p>
                </div>
                <div className="flex items-center gap-3 sm:flex-col sm:gap-2">
                  <div className="h-8 w-px bg-gradient-to-b from-transparent via-parofc-red/40 to-transparent" />
                  <span className="text-3xl font-black text-white sm:text-4xl">VS</span>
                  <div className="h-8 w-px bg-gradient-to-b from-transparent via-parofc-red/40 to-transparent" />
                </div>
                <div className="text-center">
                  {nextMatch.awayCrest ? (
                    <div className="mx-auto h-16 w-16 overflow-hidden rounded-full">
                      <Image src={nextMatch.awayCrest} alt={nextMatch.awayTeam} width={64} height={64} className="h-full w-full object-contain" />
                    </div>
                  ) : (
                    <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-blue-800 text-base font-black">
                      {nextMatch.awayTeam.split(" ").map((w: string) => w[0]).join("").slice(0, 2)}
                    </div>
                  )}
                  <p className="mt-2 text-sm font-black uppercase tracking-wider sm:text-base">{nextMatch.awayTeam}</p>
                </div>
              </div>

              <div className="hidden h-28 w-px bg-gradient-to-b from-transparent via-parofc-red/40 to-transparent lg:block" />

              <div className="flex flex-col items-stretch sm:flex-row">
                <div className="flex items-center justify-between py-2 sm:flex-col sm:justify-center sm:px-7">
                  <HugeiconsIcon icon={Calendar} size={32} primaryColor="currentColor" className="text-white/50 sm:mb-2" strokeWidth={1.8} />
                  <div className="text-right sm:text-center">
                    <p className="text-sm font-black uppercase sm:text-base">{new Date(nextMatch.date).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}</p>
                    <p className="text-2xs font-bold uppercase tracking-wider text-white/40">{new Date(nextMatch.date).toLocaleDateString("en-US", { weekday: "long" })}</p>
                  </div>
                </div>
                <div className="my-2 h-px w-full bg-gradient-to-r from-transparent via-parofc-red/40 to-transparent sm:my-2 sm:h-auto sm:w-px sm:bg-gradient-to-b" />
                <div className="flex items-center justify-between py-2 sm:flex-col sm:justify-center sm:px-7">
                  <HugeiconsIcon icon={Clock} size={32} primaryColor="currentColor" className="text-white/50 sm:mb-2" strokeWidth={1.8} />
                  <div className="text-right sm:text-center">
                    <p className="text-sm font-black uppercase sm:text-base">{new Date(nextMatch.date).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })}</p>
                    <p className="text-2xs font-bold uppercase tracking-wider text-white/40">Kick Off</p>
                  </div>
                </div>
                <div className="my-2 h-px w-full bg-gradient-to-r from-transparent via-parofc-red/40 to-transparent sm:my-2 sm:h-auto sm:w-px sm:bg-gradient-to-b" />
                <div className="flex items-center justify-between py-2 sm:flex-col sm:justify-center sm:px-7">
                  <HugeiconsIcon icon={MapPin} size={32} primaryColor="currentColor" className="text-white/50 sm:mb-2" strokeWidth={1.8} />
                  <div className="text-right sm:text-center">
                    <p className="text-sm font-black uppercase sm:text-base">{nextMatch.venue}</p>
                    <p className="text-2xs font-bold uppercase tracking-wider text-white/40">Venue</p>
                  </div>
                </div>
              </div>

              <div className="hidden h-28 w-px bg-gradient-to-b from-transparent via-parofc-red/40 to-transparent lg:block" />

              <div className="flex flex-col gap-3 sm:items-end">
                <div className="grid grid-cols-2 gap-2 sm:flex sm:items-stretch sm:gap-0">
                  <div className="rounded-md border border-white/10 bg-white/[0.03] sm:rounded-none sm:border-0 sm:bg-transparent">
                    <CountdownBlock value="--" label="Days" />
                  </div>
                  <div className="rounded-md border border-white/10 bg-white/[0.03] sm:rounded-none sm:border-0 sm:bg-transparent">
                    <CountdownBlock value="--" label="Hrs" />
                  </div>
                  <div className="rounded-md border border-white/10 bg-white/[0.03] sm:rounded-none sm:border-0 sm:bg-transparent">
                    <CountdownBlock value="--" label="Mins" />
                  </div>
                  <div className="rounded-md border border-white/10 bg-white/[0.03] sm:rounded-none sm:border-0 sm:bg-transparent">
                    <CountdownBlock value="--" label="Secs" showDivider={false} />
                  </div>
                </div>
                {nextMatch.matchUrl ? (
                  <a
                    href={nextMatch.matchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-parofc-gold/35 bg-parofc-gold/10 px-4 py-2.5 text-xs font-black uppercase tracking-wider text-parofc-gold transition hover:bg-parofc-gold hover:text-[#0a0a0a] sm:w-auto"
                  >
                    Open match link
                    <HugeiconsIcon icon={ArrowUpRight01Icon} size={14} primaryColor="currentColor" strokeWidth={1.9} />
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ══════ STANDINGS + SIDEBAR ══════ */}
      <section className="mx-auto grid max-w-[1400px] gap-5 px-5 py-8 lg:grid-cols-[1fr_360px]">
        <SectionCard className="p-5">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="flex items-center gap-2 text-xl font-black uppercase">
                Live Standings <span className="flex items-center gap-1 text-xs font-bold text-red-500"><span className="inline-block h-2 w-2 rounded-full bg-red-500 animate-pulse" /> LIVE</span>
              </h2>
              <p className="text-2xs font-bold uppercase tracking-wider text-white/40">
                Bhutan Premier League {liveStandings?.season ? liveStandings.season : "—"}
              </p>
            </div>
            <Link href="/standings" className="w-fit text-xs font-bold uppercase tracking-wider text-parofc-red hover:underline">View Full Table →</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] sm:min-w-[700px] border-collapse text-xs">
              <thead>
                <tr className="border-b border-white/10 text-2xs font-bold uppercase tracking-wider text-white/40">
                  <th className="w-8 px-2 py-2.5 text-left">Pos</th>
                  <th className="px-2 py-2.5 text-left">Club</th>
                  {["P", "W", "D", "L", "GF", "GA", "GD", "Pts"].map((h) => (
                    <th key={h} className="px-2 py-2.5 text-center">{h}</th>
                  ))}
                  <th className="px-2 py-2.5 text-center">Form</th>
                </tr>
              </thead>
              <tbody>
                {(standingTeams.length > 0 ? standingTeams : []).map((team) => {
                  const isParo = team.teamName === "Paro FC";
                  const zone = zoneFromPosition(team.position);
                  const gd = team.goalsFor - team.goalsAgainst;
                  return (
                    <tr key={team.teamName} className={`relative border-b border-white/5 transition ${isParo ? "bg-parofc-red/10" : "hover:bg-white/[0.03]"}`}>
                      <td className="px-2 py-3 font-black relative">
                        <ZoneBar zone={zone} />
                        {team.position}
                      </td>
                      <td className="px-2 py-3">
                        <div className="flex min-w-0 items-center gap-2">
                          {team.teamLogo ? (
                            <div className="h-7 w-7 shrink-0 overflow-hidden rounded-full">
                              <Image src={team.teamLogo} alt={team.teamName} width={28} height={28} className="h-full w-full object-contain" />
                            </div>
                          ) : (
                            <TeamInitialsLogo name={team.teamName} />
                          )}
                          <span className={`truncate font-black uppercase ${isParo ? "text-parofc-red" : ""}`}>{team.teamName}</span>
                        </div>
                      </td>
                      {[
                        team.played,
                        team.won,
                        team.drawn,
                        team.lost,
                        team.goalsFor,
                        team.goalsAgainst,
                        formatGD(gd),
                        team.points,
                      ].map((v, i) => (
                        <td key={i} className={`px-2 py-3 text-center font-bold ${i === 7 ? (isParo ? "text-lg text-parofc-red" : "text-lg") : "text-white/70"}`}>{v}</td>
                      ))}
                      <td className="px-2 py-3">
                        <div className="flex justify-center gap-[3px]">{(team.form ?? []).map((f, i) => <FormBadge key={i} v={f} />)}</div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex flex-wrap gap-5 text-2xs font-bold uppercase tracking-wider text-white/40">
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-green-500" /> AFC Qualification</span>
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-orange-400" /> Relegation Play-off</span>
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-red-500" /> Relegation</span>
          </div>
        </SectionCard>

        <div className="flex flex-col gap-5">
          {/* Race to the Title */}
          <SectionCard className="p-4">
            <h3 className="mb-3 text-sm font-black uppercase tracking-wider">Race to the Title</h3>
            <div className="space-y-2">
              {raceToTitle.map((t) => {
                const isParo = t.pos === 1;
                const barColor = isParo ? "bg-parofc-red" : "bg-white/30";
                const barWidth = isParo ? "w-full" : t.pos === 2 ? "w-3/4" : "w-1/2";
                return (
                  <div key={t.pos} className="flex items-center gap-3">
                    <span className="w-5 text-lg font-black text-white/30">{t.pos}</span>
                    <div className={`flex-1 rounded-md border px-3 py-2.5 ${isParo ? "border-parofc-red/30 bg-gradient-to-r from-parofc-red/15 to-transparent" : "border-white/10"}`}>
                      <div className="flex items-center gap-2">
                        <Crest size="sm" />
                        <div className="min-w-0 flex-1">
                          <p className={`truncate text-xs font-black uppercase ${isParo ? "text-parofc-red" : ""}`}>{t.name}</p>
                          <p className={`text-base font-black ${t.color}`}>{t.pts} <span className="text-2xs font-bold text-white/40">PTS</span></p>
                        </div>
                      </div>
                      <div className="mt-2 h-[2px] rounded-full bg-white/10">
                        <div className={`h-full rounded-full ${barColor} ${barWidth}`} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 grid grid-cols-1 gap-3 text-center sm:grid-cols-3 sm:gap-0">
              <div className="sm:border-r sm:border-white/10">
                <p className="text-3xs font-bold uppercase tracking-wider text-white/40">Gap</p>
                <div className="flex items-baseline justify-center">
                  <b className="text-lg text-parofc-red">+5</b>
                  <span className="ml-0.5 text-2xs font-bold text-white/40">PTS</span>
                </div>
              </div>
              <div className="sm:border-r sm:border-white/10">
                <p className="text-3xs font-bold uppercase tracking-wider text-white/40">Games Left</p>
                <b className="block text-lg">3</b>
              </div>
              <div>
                <p className="text-3xs font-bold uppercase tracking-wider text-white/40">Win Probability</p>
                <b className="block text-lg">82%</b>
              </div>
            </div>
          </SectionCard>

          {/* Top Scorer */}
          <SectionCard className="relative overflow-hidden">
            <div className="absolute right-0 top-0 h-full w-[45%] sm:w-1/2">
              <div className="absolute inset-0 bg-gradient-to-r from-[#111111] via-[#111111]/80 to-transparent" />
            </div>
            <div className="relative z-10 p-5">
              <h3 className="mb-4 text-base font-black uppercase tracking-wider">Top Scorer</h3>
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="text-5xl font-black text-parofc-red sm:text-6xl">18</span>
                <div className="h-11 w-px bg-gradient-to-b from-transparent via-parofc-red/40 to-transparent" />
                <span className="text-base font-bold uppercase text-white/50">Goals</span>
              </div>
              <h4 className="mt-4 text-lg font-black uppercase sm:text-xl">Kinley Dorji</h4>
              <p className="text-xs font-bold uppercase tracking-wider text-white/40">Paro FC</p>
              <Link href="/players" className="mt-5 flex w-fit items-center gap-2 rounded-md border border-parofc-red/30 px-5 py-2.5 text-2xs font-black uppercase tracking-wider text-parofc-red transition hover:bg-parofc-red/10 sm:w-fit">
                View All Stats <HugeiconsIcon icon={ChevronRight} size={12} primaryColor="currentColor" strokeWidth={2} />
              </Link>
            </div>
          </SectionCard>
        </div>
      </section>

      {/* ══════ LATEST NEWS ══════ */}
      {topNews.length > 0 && (
        <section className="mx-auto max-w-[1400px] px-5 py-8">
          <SectionCard className="p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-base font-black uppercase">Latest News</h2>
              <Link href="/news" className="text-xs font-bold uppercase tracking-wider text-parofc-red hover:underline">View All News →</Link>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {topNews.map((item) => {
                const imgUrl = item.image ? urlFor(item.image).width(600).height(300).url() : null;
                return (
                  <Link key={item._id} href={`/news/${item.slug}`} className="group cursor-pointer overflow-hidden rounded-md border border-parofc-red/20 bg-[#0e0e0e]">
                    <div className="relative aspect-[2/1] overflow-hidden">
                      {imgUrl ? (
                        <Image src={imgUrl} alt={item.title} fill className="object-cover transition duration-500 group-hover:scale-105" />
                      ) : (
                        <div className="h-full w-full bg-gradient-to-br from-[#ce0505]/30 to-[#1a0a00]" />
                      )}
                    </div>
                    <div className="p-5">
                      <p className="text-2xs font-bold uppercase tracking-wider text-white/40">{formatDate(item.publishedAt)}</p>
                      <h3 className="mt-2 text-lg font-black leading-snug">{item.title}</h3>
                      <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-parofc-red">
                        Read More <HugeiconsIcon icon={ChevronRight} size={14} primaryColor="currentColor" strokeWidth={2} />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </SectionCard>
        </section>
      )}

      {/* ══════ PARO FC TV ══════ */}
      {topVideos.length > 0 && (
        <section className="mx-auto max-w-[1400px] px-5 py-8">
          <SectionCard className="p-5">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-black uppercase">Paro FC TV</h2>
              <a className="rounded-lg border border-parofc-red/30 px-4 py-2 text-2xs font-black uppercase tracking-wider text-parofc-red transition hover:bg-parofc-red/10" href="#">View All Videos →</a>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
              {topVideos.map((v) => {
                const ytId = getYoutubeIdFromUrl(v.youtubeUrl);
                const thumb = ytId ? `https://img.youtube.com/vi/${ytId}/mqdefault.jpg` : null;
                return (
                  <a key={v._id} href={v.youtubeUrl} target="_blank" rel="noopener noreferrer" className="group cursor-pointer">
                    <div className="relative aspect-video overflow-hidden rounded-md bg-gradient-to-br from-[#ce0505]/30 to-[#1a0a00]">
                      {thumb && <Image src={thumb} alt={v.title} fill className="object-cover opacity-70" />}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="grid h-10 w-10 place-items-center rounded-full bg-white/20 backdrop-blur-sm transition group-hover:bg-parofc-red/80">
                          <HugeiconsIcon icon={Play} size={18} primaryColor="currentColor" className="text-white ml-0.5" strokeWidth={2.1} />
                        </div>
                      </div>
                    </div>
                    <h4 className="mt-2 text-xs font-black line-clamp-1">{v.title}</h4>
                  </a>
                );
              })}
            </div>
          </SectionCard>
        </section>
      )}

      {/* ══════ PARTNERS ══════ */}
      {mainPartners.length > 0 && (
        <section className="mx-auto max-w-[1400px] px-5 py-8">
          <SectionCard className="p-6">
            <h2 className="mb-6 text-base font-black uppercase">Our Partners</h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
              {mainPartners.map((p) => (
                <a
                  key={p._id}
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-center rounded-md border border-white/10 bg-white/[0.03] backdrop-blur-md px-4 py-7 md:py-9 transition hover:border-white/20"
                >
                  <div className="relative flex h-16 md:h-20 w-full items-center justify-center">
                    {p.logo ? (
                      <Image
                        src={p.logo}
                        alt={p.name}
                        width={220}
                        height={110}
                        className="relative z-10 h-14 md:h-16 w-auto object-contain"
                      />
                    ) : (
                      <span className="relative z-10 text-2xs font-bold uppercase tracking-widest text-white/30">Logo</span>
                    )}
                  </div>
                </a>
              ))}
            </div>
          </SectionCard>
        </section>
      )}
    </div>
  );
}
