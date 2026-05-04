"use client";

import Image from "next/image";

export interface StandingTeam {
  teamName: string;
  teamLogo?: string | null;
  position: number;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
  form?: string[] | null;
}

export function sortTeamsByPoints(teams: StandingTeam[]): StandingTeam[] {
  return teams
    .slice()
    .sort(
      (a, b) =>
        Number(b.points) - Number(a.points) ||
        (Number(b.goalsFor) - Number(b.goalsAgainst)) -
          (Number(a.goalsFor) - Number(a.goalsAgainst)),
    )
    .map((t, i) => ({ ...t, position: i + 1 }));
}

function formatGD(gd: number) {
  return gd > 0 ? `+${gd}` : `${gd}`;
}

function ZoneBar({ position }: { position: number }) {
  if (position === 1) return <div className="absolute left-0 top-0 h-full w-[3px] bg-green-500" />;
  if (position === 8) return <div className="absolute left-0 top-0 h-full w-[3px] bg-orange-400" />;
  if (position >= 9) return <div className="absolute left-0 top-0 h-full w-[3px] bg-red-500" />;
  return null;
}

function FormBadge({ v }: { v: string }) {
  const c = v === "W" ? "bg-green-500" : v === "D" ? "bg-yellow-500" : "bg-red-600";
  return (
    <span className={`grid h-[18px] w-[18px] place-items-center rounded-[4px] text-3xs font-black text-white ${c}`}>
      {v}
    </span>
  );
}

function TeamInitialsLogo({ name }: { name: string }) {
  const initials = name.split(" ").filter(Boolean).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white/5 ring-1 ring-white/10">
      <span className="text-3xs font-black uppercase tracking-wide text-white/40">{initials || "—"}</span>
    </div>
  );
}

interface Props {
  teams: StandingTeam[];
}

export function LiveStandingsTable({ teams }: Props) {
  return (
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
          {teams.length === 0 ? (
            <tr>
              <td colSpan={11} className="py-10 text-center text-xs text-white/30">
                No standings data available
              </td>
            </tr>
          ) : (
            teams.map((team) => {
              const gd = Number(team.goalsFor) - Number(team.goalsAgainst);
              return (
                <tr
                  key={team.teamName}
                  className="relative border-b border-white/5 transition hover:bg-white/[0.03]"
                >
                  <td className="px-2 py-3 font-black relative">
                    <ZoneBar position={team.position} />
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
                      <span className="truncate font-black uppercase">{team.teamName}</span>
                    </div>
                  </td>
                  {[team.played, team.won, team.drawn, team.lost, team.goalsFor, team.goalsAgainst, formatGD(gd), team.points].map((v, i) => (
                    <td key={i} className={`px-2 py-3 text-center font-bold ${i === 7 ? "text-lg" : "text-white/70"}`}>
                      {v}
                    </td>
                  ))}
                  <td className="px-2 py-3">
                    <div className="flex justify-center gap-[3px]">
                      {(team.form ?? []).map((f, i) => <FormBadge key={i} v={f} />)}
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
