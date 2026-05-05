import type { StructureBuilder, StructureResolver } from "sanity/structure";
import { CalendarIcon, DocumentIcon, TagIcon } from "@sanity/icons";

const HIDDEN_TYPES = new Set([
  "match",
  "standing",
  "standingsCompetition",
]);

const matchesByTeam = (S: StructureBuilder, team: "men" | "women") =>
  S.documentTypeList("match")
    .title(`${team === "women" ? "Women's" : "Men's"} Matches`)
    .filter('_type == "match" && competition->team == $team')
    .params({ team })
    .apiVersion("2024-01-01")
    .defaultOrdering([{ field: "date", direction: "desc" }]);

const standingsByTeam = (S: StructureBuilder, team: "men" | "women") =>
  S.documentTypeList("standing")
    .title(`${team === "women" ? "Women's" : "Men's"} Standings`)
    .filter('_type == "standing" && competition->team == $team')
    .params({ team })
    .apiVersion("2024-01-01");

const competitionsByTeam = (S: StructureBuilder, team: "men" | "women") =>
  S.documentTypeList("standingsCompetition")
    .title(`${team === "women" ? "Women's" : "Men's"} Competitions`)
    .filter('_type == "standingsCompetition" && team == $team')
    .params({ team })
    .apiVersion("2024-01-01")
    .defaultOrdering([{ field: "order", direction: "asc" }]);

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Matches")
        .icon(CalendarIcon)
        .child(
          S.list()
            .title("Matches")
            .items([
              S.listItem()
                .title("Men's Matches")
                .icon(CalendarIcon)
                .child(matchesByTeam(S, "men")),
              S.listItem()
                .title("Women's Matches")
                .icon(CalendarIcon)
                .child(matchesByTeam(S, "women")),
            ])
        ),
      S.listItem()
        .title("Standings")
        .icon(DocumentIcon)
        .child(
          S.list()
            .title("Standings")
            .items([
              S.listItem()
                .title("Men's Standings")
                .icon(DocumentIcon)
                .child(standingsByTeam(S, "men")),
              S.listItem()
                .title("Women's Standings")
                .icon(DocumentIcon)
                .child(standingsByTeam(S, "women")),
            ])
        ),
      S.listItem()
        .title("Competitions")
        .icon(TagIcon)
        .child(
          S.list()
            .title("Competitions")
            .items([
              S.listItem()
                .title("Men's Competitions")
                .icon(TagIcon)
                .child(competitionsByTeam(S, "men")),
              S.listItem()
                .title("Women's Competitions")
                .icon(TagIcon)
                .child(competitionsByTeam(S, "women")),
            ])
        ),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) => !HIDDEN_TYPES.has(item.getId() ?? "")
      ),
    ]);
