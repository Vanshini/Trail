import { useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import type { Room, Player, PromptRow, Answer } from '@/lib/types';
import { answerPromptsFor } from '@/lib/gameLogic';
import PhaseShell from './PhaseShell';

export default function PromptsScreen({
  room,
  players,
  me,
  isHost,
  prompts,
  answers,
}: {
  room: Room;
  players: Player[];
  me: Player;
  isHost: boolean;
  prompts: PromptRow[];
  answers: Answer[];
}) {
  const myPrompts = useMemo(
    () => answerPromptsFor(players, me.id, prompts),
    [players, me.id, prompts]
  );
  const myAnswers = answers.filter(
    (a) => a.author_id === me.id && a.round_index === room.round_index
  );
  const byPrompt = (pid: number) => myAnswers.find((a) => a.prompt_id === pid)?.body ?? '';
  const [drafts, setDrafts] = useState<Record<number, string>>({});

  async function submit(pid: number) {
    const body = (drafts[pid] ?? byPrompt(pid)).trim();
    if (!body) return toast.error('Write something first');
    const { error } = await supabase.rpc('submit_answer', {
      p_room: room.id,
      p_prompt_id: pid,
      p_body: body,
    });
    if (error) toast.error(error.message);
    else toast.success('Locked in');
  }

  const submittedCount = players.reduce((n, p) => {
    const mine = answers.filter(
      (a) => a.author_id === p.id && a.round_index === room.round_index
    ).length;
    return n + (mine >= 2 ? 1 : 0);
  }, 0);

  async function advance() {
    const { error } = await supabase.rpc('advance_to_guessing', { p_room: room.id });
    if (error) toast.error(error.message);
  }

  return (
    <PhaseShell title="Confession Hour" subtitle={`${submittedCount}/4 friends have confessed`}>
      <div className="space-y-5">
        {myPrompts.map((pr) => {
          const saved = byPrompt(pr.id);
          const value = drafts[pr.id] ?? saved;
          return (
            <div key={pr.id} className="rounded-2xl bg-white/10 border border-white/15 p-4">
              <p className="text-sm text-white/80 mb-3">{pr.text}</p>
              <textarea
                maxLength={280}
                value={value}
                onChange={(e) => setDrafts((d) => ({ ...d, [pr.id]: e.target.value }))}
                placeholder="Be honest. Be funny. Be unhinged."
                className="w-full h-24 rounded-xl bg-black/30 p-3 text-white placeholder:text-white/30 outline-none resize-none border border-white/10 focus:ring-2 focus:ring-amber-300"
              />
              <div className="flex items-center justify-between mt-2">
                <span className="text-[10px] text-white/40">{value.length}/280</span>
                <button
                  onClick={() => submit(pr.id)}
                  className="px-3 py-1.5 rounded-lg bg-fuchsia-500 text-black font-bold text-sm"
                >
                  {saved ? 'Update' : 'Lock it in'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {isHost && (
        <button
          onClick={advance}
          className="mt-8 w-full py-3 rounded-2xl border border-white/20 text-white/80 hover:bg-white/5"
        >
          Skip to guessing (when everyone's done)
        </button>
      )}
    </PhaseShell>
  );
}