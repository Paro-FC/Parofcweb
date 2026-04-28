export type StandingsCompetitionId = string;

export type StandingsCompetition = {
  id: StandingsCompetitionId;
  name: string;
  short: string;
};

export const STANDINGS_COMPETITION_LABELS: Record<
  StandingsCompetitionId,
  { name: string; short: string }
> = {
  bpl: { name: "BOB Premier League", short: "BPL" },
  cup: { name: "National Cup", short: "Cup" },
  afc: { name: "AFC Qualifiers", short: "AFC" },
};

export const STANDINGS_COMPETITION_ORDER: StandingsCompetitionId[] = [
  "bpl",
  "cup",
  "afc",
];

export const STANDINGS_COMPETITIONS_FALLBACK: StandingsCompetition[] =
  STANDINGS_COMPETITION_ORDER.map((id) => ({
    id,
    name: STANDINGS_COMPETITION_LABELS[id]?.name ?? id.toUpperCase(),
    short: STANDINGS_COMPETITION_LABELS[id]?.short ?? id.toUpperCase(),
  }));

export const STANDINGS_COMPETITION_OPTIONS = STANDINGS_COMPETITIONS_FALLBACK.map(
  (c) => ({ title: c.name, value: c.id }),
);

export const STANDINGS_COMPETITION_NAME_BY_ID: Record<
  StandingsCompetitionId,
  string
> = Object.fromEntries(
  Object.entries(STANDINGS_COMPETITION_LABELS).map(([id, v]) => [id, v.name]),
);

export function buildStandingsCompetitions(
  liveIds: StandingsCompetitionId[] | null | undefined,
): StandingsCompetition[] {
  const ids = (liveIds?.length ? liveIds : STANDINGS_COMPETITIONS_FALLBACK.map((c) => c.id))
    .filter(Boolean);

  const ordered = [...ids].sort((a, b) => {
    const ia = STANDINGS_COMPETITION_ORDER.indexOf(a);
    const ib = STANDINGS_COMPETITION_ORDER.indexOf(b);
    return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
  });

  return ordered.map((id) => ({
    id,
    name: STANDINGS_COMPETITION_LABELS[id]?.name ?? id.toUpperCase(),
    short: STANDINGS_COMPETITION_LABELS[id]?.short ?? id.toUpperCase(),
  }));
}

