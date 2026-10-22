import type { Player, PromptRow } from './types';

export function answerPromptsFor(
  players: Player[],
  meId: string,
  prompts: PromptRow[]
): PromptRow[] {
  const sorted = [...players].sort((a, b) => a.joined_at.localeCompare(b.joined_at));
  const idx = sorted.findIndex((p) => p.id === meId);
  const bank = prompts.filter((p) => p.kind === 'answer');
  if (idx < 0 || bank.length === 0) return [];
  const a = bank[(idx * 2) % bank.length];
  const b = bank[(idx * 2 + 1) % bank.length];
  return [a, b].filter(Boolean);
}

export function votePromptsForRound(prompts: PromptRow[], roundIndex: number): PromptRow[] {
  const bank = prompts.filter((p) => p.kind === 'vote');
  if (bank.length === 0) return [];
  return [0, 1, 2].map((i) => bank[(roundIndex * 3 + i) % bank.length]);
}

export function shuffleAnon<T>(arr: T[], seed: number): T[] {
  const out = [...arr];
  let s = seed || 1;
  for (let i = out.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}