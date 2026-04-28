import React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Trophy,
  Calendar,
  Clock,
  MapPin,
  PlayCircleIcon,
  Ticket,
  ChevronRight,
  ChevronDown,
  SearchIcon,
  User,
  Play,
  Globe,
} from "@hugeicons/core-free-icons";

/* ─── DATA ─── */
const standings = [
  [1, "Paro FC", 19, 17, 1, 1, 47, 11, "+36", 52, ["W", "W", "W", "D", "W"], "green"],
  [2, "RTC FC", 19, 15, 2, 2, 42, 13, "+29", 47, ["W", "W", "W", "W", "D"], null],
  [3, "Transport United", 19, 10, 4, 5, 28, 18, "+10", 34, ["L", "W", "L", "D", "W"], null],
  [4, "Thimphu City FC", 19, 8, 5, 6, 26, 20, "+6", 29, ["W", "L", "W", "L", "D"], null],
  [5, "Druk Lha-Yul FC", 19, 7, 3, 9, 23, 24, "-1", 24, ["L", "W", "D", "L", "W"], null],
  [6, "BFF Academy", 19, 6, 3, 10, 20, 28, "-8", 21, ["L", "W", "L", "L", "D"], null],
  [7, "Samtse FC", 19, 5, 3, 11, 17, 30, "-13", 18, ["L", "L", "W", "L", "D"], null],
  [8, "Bumthang FC", 19, 3, 2, 14, 14, 36, "-22", 11, ["L", "L", "D", "L", "L"], "orange"],
  [9, "Phuentsholing FC", 19, 2, 3, 14, 12, 33, "-21", 9, ["L", "L", "L", "D", "W"], "red"],
  [10, "Gelephu FC", 19, 1, 1, 17, 8, 43, "-35", 4, ["L", "L", "L", "L", "L"], "red"],
];

const news = [
  ["Paro FC secure important win against Druk Lha-Yul FC", "18 MAY 2025", "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=900&auto=format&fit=crop"],
  ["Jigme Dorji: We are focused on the title race", "15 MAY 2025", "https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=900&auto=format&fit=crop"],
  ["Training gallery: Preparations in full swing", "10 MAY 2025", "https://images.unsplash.com/photo-1526232761682-d26e03ac148e?q=80&w=900&auto=format&fit=crop"],
];

const videos = [
  { title: "Behind the Scenes", sub: "Matchday v Thimphu City FC", duration: "03:45" },
  { title: "Tunnel Cam", sub: "Paro FC v Transport United", duration: "02:16" },
  { title: "Training Session", sub: "Preparation for next match", duration: "04:32" },
  { title: "Post Match Interview", sub: "Coach Dawa Tshering", duration: "03:12" },
  { title: "Goal of the Week", sub: "Best goals of the month", duration: "01:50" },
];

const raceToTitle = [
  { pos: 1, name: "Paro FC", pts: 52, color: "text-[#ffad3d]" },
  { pos: 2, name: "RTC FC", pts: 47, color: "text-white" },
  { pos: 3, name: "Transport United", pts: 34, color: "text-white" },
];

/* ─── COMPONENTS ─── */
function Crest({ size = "md" }) {
  const sizes = { sm: "h-7 w-7", md: "h-12 w-12", lg: "h-16 w-16" };
  const iconSizes = { sm: 14, md: 22, lg: 30 };
  return (
    <div className={`${sizes[size]} shrink-0 rounded-full bg-gradient-to-br from-[#ffad3d] via-yellow-500 to-[#ce0505] p-[2px] shadow-lg`}>
      <div className="flex h-full w-full items-center justify-center rounded-full bg-[#1a0a00] text-[#ffad3d]">
        <HugeiconsIcon icon={Trophy} size={iconSizes[size]} primaryColor="currentColor" strokeWidth={1.8} />
      </div>
    </div>
  );
}

function FormBadge({ v }) {
  const styles = v === "W" ? "bg-green-500" : v === "D" ? "bg-yellow-500" : "bg-red-600";
  return <span className={`grid h-[18px] w-[18px] place-items-center rounded-[4px] text-3xs font-black text-white ${styles}`}>{v}</span>;
}

function ZoneBar({ zone }) {
  if (!zone) return null;
  const c = zone === "green" ? "bg-green-500" : zone === "orange" ? "bg-orange-400" : "bg-red-500";
  return <div className={`absolute left-0 top-0 h-full w-[3px] ${c}`} />;
}

function CountdownBlock({ value, label, showDivider = true }) {
  return (
    <div className="flex items-stretch">
      <div className="px-4 py-1 text-center">
        <div className="text-4xl font-black tabular-nums text-[#ffad3d]">{value}</div>
        <p className="text-2xs font-bold uppercase tracking-wider text-white/40">{label}</p>
      </div>
      {showDivider && <div className="my-4 w-px bg-gradient-to-b from-transparent via-[#ffad3d]/40 to-transparent" />}
    </div>
  );
}

function SectionCard({ children, className = "" }) {
  return <div className={`rounded-lg border border-[#ffad3d]/20 bg-[#111111] ${className}`}>{children}</div>;
}

/* ─── MAIN ─── */
export default function ParoFCRedWebsite() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] font-sans text-white">
      {/* ══════ HEADER ══════ */}
      <header className="sticky top-0 z-50 bg-transparent backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-5 py-3">
          <div className="flex items-center gap-3">
            <Crest />
            <div>
              <div className="text-2xl font-black tracking-tight text-[#ffad3d]" style={{ fontFamily: "serif" }}>PARO FC</div>
              <div className="text-2xs font-bold uppercase tracking-[0.3em] text-white/50">Pride of Paro</div>
            </div>
          </div>
          <nav className="hidden items-center gap-6 text-xs font-bold uppercase tracking-wider lg:flex">
            <a className="text-[#ffad3d]" href="#">Home</a>
            {["Club", "Team", "Match Center"].map((item) => (
              <a key={item} className="flex items-center gap-1 text-white/70 transition hover:text-[#ffad3d]" href="#">
                {item} <HugeiconsIcon icon={ChevronDown} size={12} primaryColor="currentColor" strokeWidth={2} />
              </a>
            ))}
            <a className="text-white/70 transition hover:text-[#ffad3d]" href="#">Paro FC TV</a>
            <a className="text-white/70 transition hover:text-[#ffad3d]" href="#">Tickets</a>
            <a className="text-white/70 transition hover:text-[#ffad3d]" href="#">Shop</a>
            <a className="text-white/70 transition hover:text-[#ffad3d]" href="#">Academy</a>
            <a className="flex items-center gap-1 text-white/70 transition hover:text-[#ffad3d]" href="#">
              More <HugeiconsIcon icon={ChevronDown} size={12} primaryColor="currentColor" strokeWidth={2} />
            </a>
          </nav>
          <div className="flex items-center gap-4 text-white/60">
            <HugeiconsIcon icon={SearchIcon} size={18} primaryColor="currentColor" className="cursor-pointer hover:text-[#ffad3d]" strokeWidth={1.8} />
            <HugeiconsIcon icon={User} size={18} primaryColor="currentColor" className="cursor-pointer hover:text-[#ffad3d]" strokeWidth={1.8} />
            <div className="flex items-center gap-1 text-xs font-bold cursor-pointer hover:text-[#ffad3d]">
              <HugeiconsIcon icon={Globe} size={14} primaryColor="currentColor" strokeWidth={1.8} /> EN{" "}
              <HugeiconsIcon icon={ChevronDown} size={10} primaryColor="currentColor" strokeWidth={2} />
            </div>
          </div>
        </div>
      </header>

      {/* ══════ HERO ══════ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent z-10" />
        <div className="absolute inset-0 opacity-50" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1800&auto=format&fit=crop')", backgroundSize: "cover", backgroundPosition: "center top" }} />
        {/* Subtle golden glow */}
        <div className="absolute top-0 right-1/4 h-96 w-96 rounded-full bg-[#ffad3d]/10 blur-[120px] z-10" />

        <div className="relative z-20 mx-auto max-w-[1400px] px-5 py-16 md:py-24 lg:py-32">
          <h1 className="text-5xl font-black uppercase leading-[0.95] tracking-tight md:text-7xl lg:text-8xl">
            Five Titles.<br />One Legacy.<br /><span className="text-[#ffad3d]">One Future.</span>
          </h1>
          <p className="mt-4 text-sm font-bold uppercase tracking-wider text-white/60">Paro FC — Bhutan&apos;s Champions</p>

          {/* Trophy row */}
          <div className="mt-6 flex items-center gap-4">
            {[2019, 2020, 2021, 2022, 2023].map((yr) => (
              <div key={yr} className="text-center">
                <HugeiconsIcon icon={Trophy} size={24} primaryColor="currentColor" className="mx-auto text-[#ffad3d]" strokeWidth={1.8} />
                <span className="mt-1 block text-2xs font-bold text-[#ffad3d]">{yr}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <button className="flex items-center gap-2 rounded-md border border-white/20 bg-[#ffad3d] px-6 py-3 text-sm font-bold text-black uppercase tracking-wider backdrop-blur-sm transition ">
              <HugeiconsIcon icon={PlayCircleIcon} size={18} primaryColor="currentColor" strokeWidth={1.8} /> Watch Highlights
            </button>
            <button className="flex items-center gap-2 rounded-md border border-[#ffad3d] bg-white/10 px-6 py-3 text-sm font-bold uppercase tracking-wider backdrop-blur-sm transition hover:bg-white/20">
                View Fixtures <HugeiconsIcon icon={Calendar} size={18} primaryColor="currentColor" strokeWidth={1.8} /> 
            </button>
          </div>
        </div>
      </section>

      {/* ══════ NEXT MATCH BAR ══════ */}
      <section className="mx-auto max-w-[1400px] px-5 py-6">
        <div className="rounded-lg border border-[#ffad3d]/25 bg-[#141414] px-6 py-5">
          {/* Top labels */}
          <div className="mb-5">
            <h2 className="text-lg font-black uppercase text-[#ffad3d]">Next Match</h2>
            <p className="text-xs font-bold uppercase tracking-wider text-white/40">Bhutan Premier League</p>
          </div>

          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            {/* Teams VS */}
            <div className="flex items-center gap-8">
              <div className="text-center">
                <Crest size="lg" />
                <p className="mt-2 text-base font-black uppercase tracking-wider">Paro FC</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="h-8 w-px bg-gradient-to-b from-transparent via-[#ffad3d]/40 to-transparent" />
                <span className="text-4xl font-black text-white">VS</span>
                <div className="h-8 w-px bg-gradient-to-b from-transparent via-[#ffad3d]/40 to-transparent" />
              </div>
              <div className="text-center">
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-blue-800 text-base font-black">TC</div>
                <p className="mt-2 text-base font-black uppercase tracking-wider">Thimphu City FC</p>
              </div>
            </div>

            {/* Divider */}
            <div className="hidden h-28 w-px bg-gradient-to-b from-transparent via-[#ffad3d]/40 to-transparent lg:block" />

            {/* Date / Time / Venue */}
            <div className="flex items-stretch">
              <div className="flex flex-col items-center justify-center px-7">
                <HugeiconsIcon icon={Calendar} size={32} primaryColor="currentColor" className="mb-2 text-white/50" strokeWidth={1.8} />
                <p className="text-base font-black uppercase">24 May 2025</p>
                <p className="text-xs font-bold uppercase tracking-wider text-white/40">Saturday</p>
              </div>
              <div className="my-2 w-px bg-gradient-to-b from-transparent via-[#ffad3d]/40 to-transparent" />
              <div className="flex flex-col items-center justify-center px-7">
                <HugeiconsIcon icon={Clock} size={32} primaryColor="currentColor" className="mb-2 text-white/50" strokeWidth={1.8} />
                <p className="text-base font-black uppercase">17:30</p>
                <p className="text-xs font-bold uppercase tracking-wider text-white/40">Kick Off</p>
              </div>
              <div className="my-2 w-px bg-gradient-to-b from-transparent via-[#ffad3d]/40 to-transparent" />
              <div className="flex flex-col items-center justify-center px-7">
                <HugeiconsIcon icon={MapPin} size={32} primaryColor="currentColor" className="mb-2 text-white/50" strokeWidth={1.8} />
                <p className="text-base font-black uppercase">Woochu Sports</p>
                <p className="text-xs font-bold uppercase tracking-wider text-white/40">Paro</p>
              </div>
            </div>

            {/* Divider */}
            <div className="hidden h-28 w-px bg-gradient-to-b from-transparent via-[#ffad3d]/40 to-transparent lg:block" />

            {/* Countdown + Buy Tickets */}
            <div className="flex flex-col items-end gap-3">
              <div className="flex items-stretch rounded-md">
                <CountdownBlock value="02" label="Days" />
                <CountdownBlock value="14" label="Hrs" />
                <CountdownBlock value="36" label="Mins" />
                <CountdownBlock value="48" label="Secs" showDivider={false} />
              </div>
              <button className="flex w-full items-center justify-center gap-2 rounded-md bg-[#ffad3d] px-6 py-3 text-sm font-black uppercase tracking-wider text-black transition hover:bg-[#ffc164]">
                <HugeiconsIcon icon={Ticket} size={16} primaryColor="currentColor" strokeWidth={1.9} /> Buy Tickets
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ══════ STANDINGS + SIDEBAR ══════ */}
      <section className="mx-auto grid max-w-[1400px] gap-5 px-5 py-8 lg:grid-cols-[1fr_360px]">
        {/* Standings Table */}
        <SectionCard className="p-5">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <h2 className="flex items-center gap-2 text-xl font-black uppercase">
                Live Standings <span className="flex items-center gap-1 text-xs font-bold text-red-500"><span className="inline-block h-2 w-2 rounded-full bg-red-500 animate-pulse" /> LIVE</span>
              </h2>
              <p className="text-2xs font-bold uppercase tracking-wider text-white/40">Bhutan Premier League 2024/25</p>
            </div>
            <a className="text-xs font-bold uppercase tracking-wider text-[#ffad3d] hover:underline" href="#">View Full Table →</a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] border-collapse text-xs">
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
                {standings.map((row) => {
                  const isParo = row[1] === "Paro FC";
                  return (
                    <tr key={row[1]} className={`relative border-b border-white/5 transition ${isParo ? "bg-[#ffad3d]/10" : "hover:bg-white/[0.03]"}`}>
                      <td className="px-2 py-3 font-black relative">
                        <ZoneBar zone={row[11]} />
                        {row[0]}
                      </td>
                      <td className="px-2 py-3">
                        <div className="flex items-center gap-2">
                          <Crest size="sm" />
                          <span className={`font-black uppercase ${isParo ? "text-[#ffad3d]" : ""}`}>{row[1]}</span>
                        </div>
                      </td>
                      {row.slice(2, 10).map((v, i) => (
                        <td key={i} className={`px-2 py-3 text-center font-bold ${i === 7 ? (isParo ? "text-lg text-[#ffad3d]" : "text-lg") : "text-white/70"}`}>{v}</td>
                      ))}
                      <td className="px-2 py-3">
                        <div className="flex justify-center gap-[3px]">{row[10].map((f, i) => <FormBadge key={i} v={f} />)}</div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {/* Zone legend */}
          <div className="mt-4 flex flex-wrap gap-5 text-2xs font-bold uppercase tracking-wider text-white/40">
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-green-500" /> AFC Qualification</span>
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-orange-400" /> Relegation Play-off</span>
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-red-500" /> Relegation</span>
          </div>
        </SectionCard>

        {/* Sidebar */}
        <div className="flex flex-col gap-5">
          {/* Race to the Title */}
          <SectionCard className="p-4">
            <h3 className="mb-3 text-sm font-black uppercase tracking-wider">Race to the Title</h3>
            <div className="space-y-2">
              {raceToTitle.map((t) => {
                const isParo = t.pos === 1;
                const barColor = isParo ? "bg-[#ffad3d]" : "bg-white/30";
                const barWidth = isParo ? "w-full" : t.pos === 2 ? "w-3/4" : "w-1/2";
                return (
                  <div key={t.pos} className="flex items-center gap-3">
                    <span className="w-5 text-lg font-black text-white/30">{t.pos}</span>
                    <div className={`flex-1 rounded-md border px-3 py-2.5 ${isParo ? "border-[#ffad3d]/30 bg-gradient-to-r from-[#ffad3d]/15 to-transparent" : "border-white/10"}`}>
                      <div className="flex items-center gap-2">
                        <Crest size="sm" />
                        <div className="flex-1">
                          <p className={`text-xs font-black uppercase ${isParo ? "text-[#ffad3d]" : ""}`}>{t.name}</p>
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
            <div className="mt-4 grid grid-cols-3 text-center">
              <div className="border-r border-white/10">
                <p className="text-3xs font-bold uppercase tracking-wider text-white/40">Gap</p>
                <div className="flex items-baseline justify-center">
                  <b className="text-lg text-[#ffad3d]">+5</b>
                  <span className="ml-0.5 text-2xs font-bold text-white/40">PTS</span>
                </div>
              </div>
              <div className="border-r border-white/10">
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
            {/* Player image on the right */}
            <div className="absolute right-0 top-0 h-full w-1/2">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=400&auto=format&fit=crop')] bg-cover bg-center opacity-30" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#111111] via-[#111111]/80 to-transparent" />
            </div>

            <div className="relative z-10 p-5">
              <h3 className="mb-4 text-base font-black uppercase tracking-wider">Top Scorer</h3>

              <div className="flex items-baseline gap-2">
                <span className="text-6xl font-black text-[#ffad3d]">18</span>
                <div className="h-11 w-px bg-gradient-to-b from-transparent via-[#ffad3d]/40 to-transparent" />
                <span className="text-base font-bold uppercase text-white/50">Goals</span>
              </div>

              <h4 className="mt-4 text-xl font-black uppercase">Kinley Dorji</h4>
              <p className="text-xs font-bold uppercase tracking-wider text-white/40">Paro FC</p>

              <button className="mt-5 flex items-center gap-2 rounded-md border border-[#ffad3d]/30 px-5 py-2.5 text-2xs font-black uppercase tracking-wider text-[#ffad3d] transition hover:bg-[#ffad3d]/10">
                View All Stats <HugeiconsIcon icon={ChevronRight} size={12} primaryColor="currentColor" strokeWidth={2} />
              </button>
            </div>
          </SectionCard>
        </div>
      </section>

      {/* ══════ LATEST NEWS ══════ */}
      <section className="mx-auto max-w-[1400px] px-5 py-8">
        <SectionCard className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-base font-black uppercase">Latest News</h2>
            <a className="text-xs font-bold uppercase tracking-wider text-[#ffad3d] hover:underline" href="#">View All News →</a>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {news.map(([title, date, img]) => (
              <article key={title} className="group cursor-pointer overflow-hidden rounded-md border border-[#ffad3d]/20 bg-[#0e0e0e]">
                <div className="relative aspect-[2/1] overflow-hidden">
                  <img src={img} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" alt="" />
                </div>
                <div className="p-5">
                  <p className="text-2xs font-bold uppercase tracking-wider text-white/40">{date}</p>
                  <h3 className="mt-2 text-lg font-black leading-snug">{title}</h3>
                  <a className="mt-4 inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#ffad3d]" href="#">
                    Read More <HugeiconsIcon icon={ChevronRight} size={14} primaryColor="currentColor" strokeWidth={2} />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </SectionCard>
      </section>

      {/* ══════ PARO FC TV ══════ */}
      <section className="mx-auto max-w-[1400px] px-5 py-8">
        <SectionCard className="p-5">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-black uppercase">Paro FC TV</h2>
            <a className="rounded-lg border border-[#ffad3d]/30 px-4 py-2 text-2xs font-black uppercase tracking-wider text-[#ffad3d] transition hover:bg-[#ffad3d]/10" href="#">View All Videos →</a>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
            {videos.map((v) => (
              <div key={v.title} className="group cursor-pointer">
                <div className="relative aspect-video overflow-hidden rounded-md bg-gradient-to-br from-[#ce0505]/30 to-[#1a0a00]">
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=400&auto=format&fit=crop')] bg-cover bg-center opacity-40" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="grid h-10 w-10 place-items-center rounded-full bg-white/20 backdrop-blur-sm transition group-hover:bg-[#ffad3d]/80">
                      <HugeiconsIcon icon={Play} size={18} primaryColor="currentColor" className="text-white ml-0.5" strokeWidth={2.1} />
                    </div>
                  </div>
                  <span className="absolute bottom-2 right-2 rounded bg-black/70 px-1.5 py-0.5 text-2xs font-bold tabular-nums">{v.duration}</span>
                </div>
                <h4 className="mt-2 text-xs font-black">{v.title}</h4>
                <p className="text-2xs text-white/40">{v.sub}</p>
              </div>
            ))}
          </div>
        </SectionCard>
      </section>

      {/* ══════ PARTNERS ══════ */}
      <section className="mx-auto max-w-[1400px] px-5 py-8">
        <SectionCard className="p-6">
          <h2 className="mb-6 text-base font-black uppercase">Our Partners</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
            {[
              { name: "SMART", role: "Principal Sponsor" },
              { name: "Drukair", role: "Official Airline" },
              { name: "PNB", role: "Official Banking Partner" },
              { name: "Pepsi", role: "Official Beverage Partner" },
              { name: "Nivia", role: "Official Kit Partner" },
            ].map((p) => (
              <div key={p.name} className="group flex flex-col items-center justify-between rounded-md border border-white/10 overflow-hidden">
                {/* Logo area with liquid glass effect */}
                <div className="relative flex h-24 w-full items-center justify-center bg-white/[0.03] backdrop-blur-md">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-transparent to-white/[0.03]" />
                  <div className="absolute inset-0 opacity-20" style={{ background: "radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.15), transparent 60%)" }} />
                  <span className="relative z-10 text-2xl font-black">{p.name}</span>
                </div>
                {/* Role label */}
                <div className="w-full border-t border-white/5 py-2.5 text-center">
                  <span className="text-3xs font-bold uppercase tracking-widest text-white/35">{p.role}</span>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </section>

      {/* ══════ FOOTER ══════ */}
      <footer className="border-t border-[#ffad3d]/15 bg-[#0e0e0e]">
        <div className="mx-auto grid max-w-[1400px] gap-8 px-5 py-10 md:grid-cols-[1.4fr_1fr_1fr_1fr_1fr_1.2fr]">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3">
              <Crest size="md" />
              <div>
                <b className="text-xl text-[#ffad3d]" style={{ fontFamily: "serif" }}>PARO FC</b>
              </div>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-white/40">
              Pride of Paro. Pride of Bhutan.<br />Together, we build a legacy that inspires generations.
            </p>
            <div className="mt-4 flex gap-2">
              {["FB", "IG", "YT", "X", "TT"].map((s) => (
                <span key={s} className="grid h-7 w-7 cursor-pointer place-items-center rounded-full border border-white/15 text-3xs font-bold text-white/50 transition hover:border-[#ffad3d]/40 hover:text-[#ffad3d]">{s}</span>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <b className="text-2xs font-black uppercase tracking-wider text-[#ffad3d]">Quick Links</b>
            <div className="mt-3 space-y-2 text-xs text-white/40">
              {["Home", "Club", "Team", "Match Center", "Paro FC TV"].map((l) => (
                <a key={l} className="block transition hover:text-[#ffad3d]" href="#">{l}</a>
              ))}
            </div>
          </div>

          {/* Tickets & Shop */}
          <div>
            <b className="text-2xs font-black uppercase tracking-wider text-[#ffad3d]">Tickets & Shop</b>
            <div className="mt-3 space-y-2 text-xs text-white/40">
              {["Buy Tickets", "Season Pass", "Membership", "Shop"].map((l) => (
                <a key={l} className="block transition hover:text-[#ffad3d]" href="#">{l}</a>
              ))}
            </div>
          </div>

          {/* Academy */}
          <div>
            <b className="text-2xs font-black uppercase tracking-wider text-[#ffad3d]">Academy</b>
            <div className="mt-3 space-y-2 text-xs text-white/40">
              {["Youth Teams", "Coaching Philosophy", "Trials", "Grassroots"].map((l) => (
                <a key={l} className="block transition hover:text-[#ffad3d]" href="#">{l}</a>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <b className="text-2xs font-black uppercase tracking-wider text-[#ffad3d]">Contact Us</b>
            <div className="mt-3 space-y-2 text-xs text-white/40">
              <p>info@parofc.bt</p>
              <p>+975 7728 0000</p>
              <p>Woochu Sports Arena,<br />Paro, Bhutan</p>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <b className="text-2xs font-black uppercase tracking-wider text-[#ffad3d]">Newsletter</b>
            <p className="mt-2 text-2xs text-white/30">Subscribe for the latest news, updates and exclusive offers.</p>
            <input className="mt-3 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-xs text-white placeholder:text-white/30 focus:border-[#ffad3d]/40 focus:outline-none" placeholder="Enter your email" />
            <button className="mt-2 w-full rounded-lg bg-[#ce0505] py-2.5 text-2xs font-black uppercase tracking-wider text-white transition hover:bg-[#e00606]">Subscribe</button>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5">
          <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-4 px-5 py-4 text-2xs text-white/25">
            <span>© 2025 Paro Football Club. All Rights Reserved.</span>
            <div className="flex gap-5">
              <a href="#" className="hover:text-white/50">Privacy Policy</a>
              <a href="#" className="hover:text-white/50">Terms & Conditions</a>
              <a href="#" className="hover:text-white/50">Media Enquiries</a>
            </div>
            <span className="text-sm italic text-[#ffad3d]/40" style={{ fontFamily: "cursive" }}>pride of paro</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
