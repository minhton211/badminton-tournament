export type Category = "singles" | "doubles";
export type MatchStatus = "pending" | "ready" | "assigned" | "in_progress" | "completed" | "held";
export type TournamentStatus = "scheduled" | "active" | "completed";

export type RatingSettings = { kFactor: number; ratingScale: number; marginWeight: number };
export const defaultRatingSettings: RatingSettings = { kFactor: 32, ratingScale: 400, marginWeight: 1 };

/** Uses initials for all given names and keeps the final name readable. */
export function compactPlayerName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length < 2) return parts[0] ?? "";
  return `${parts.slice(0, -1).map(part => part[0]?.toLocaleUpperCase() ?? "").join("")}${parts[parts.length - 1]}`;
}

export function displayStage(stage: string) {
  if (stage.startsWith("group_")) return `Group ${stage.slice("group_".length)}`;
  const names: Record<string, string> = {
    singles_semifinal: "Singles semi-final", doubles_semifinal: "Doubles semi-final",
    singles_final: "Singles final", doubles_final: "Doubles final",
    singles_bronze: "Singles bronze medal", doubles_bronze: "Doubles bronze medal"
  };
  return names[stage] ?? stage.replace(/_/g, " ");
}

export function expectedScore(self: number, opponent: number, scale = 400) {
  return 1 / (1 + Math.pow(10, (opponent - self) / scale));
}

export function eloDelta(winnerRating: number, loserRating: number, winnerScore: number, loserScore: number, settings = defaultRatingSettings) {
  if (winnerScore <= loserScore) throw new Error("A completed match needs a winner.");
  const margin = 1 + settings.marginWeight * ((winnerScore - loserScore) / winnerScore);
  return Math.round(settings.kFactor * (1 - expectedScore(winnerRating, loserRating, settings.ratingScale)) * margin);
}

export function isValidScore(a: number, b: number) {
  const high = Math.max(a, b), low = Math.min(a, b);
  return Number.isInteger(a) && Number.isInteger(b) && a >= 0 && b >= 0 && high > low && high - low >= 2;
}

export type QueueMatch = { id: string; status: MatchStatus; order: number; participants: string[]; courtNumber: number | null };

/** Assign available courts to ready matches without scheduling any participant twice. */
export function assignCourts(matches: QueueMatch[], courtCount: number): QueueMatch[] {
  const active = matches.filter(m => m.status === "assigned" || m.status === "in_progress");
  const busy = new Set(active.flatMap(m => m.participants));
  const used = new Set(active.map(m => m.courtNumber).filter((n): n is number => n !== null));
  const free = Array.from({ length: courtCount }, (_, i) => i + 1).filter(c => !used.has(c));
  const copy = matches.map(m => ({ ...m, participants: [...m.participants] }));
  for (const court of free) {
    const candidate = copy.filter(m => m.status === "ready" && m.participants.every(p => !busy.has(p))).sort((a, b) => a.order - b.order)[0];
    if (!candidate) break;
    candidate.status = "assigned";
    candidate.courtNumber = court;
    candidate.participants.forEach(p => busy.add(p));
  }
  return copy;
}
