import { useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import type { Room, Player, Answer, Guess, PromptRow } from '@/lib/types';
import { shuffleAnon } from '@/lib/gameLogic';
import PhaseShell from './PhaseShell';

export default function GuessingScreen({
  room,
  players,
  me,
  isHost,
  prompts,
  answers,
  guesses,
}: {
  room: Room;
  players: Player[];
  me: Player;
  isHost: boolean;
  prompts: PromptRow[];
  answers: Answer[];
  guesses: Guess[];
}) {
  const roundAnswers = useMemo(
    () => answers.filter((a) => a.round_index === room.round_index && a.author_id !== me.id),
    [answers, room.round_index, me.id]
  );
  const shuffled = useMemo(
    () => shuffleAnon(roundAnswers, parseInt(room.id.slice(0, 8), 16) || 1),
    [roundAnswers, room.id]
  );

  if (shuffled.length === 0) {
    return (
      <PhaseShell title="Who Said It?" subtitle="Loading answers…">
        <div className="text-white/60 text-center py-20">Waiting for everyone's secrets…</div>
      </PhaseShell>
    );
  }

  const myGuesses = guesses.filter(
    (g) => g.guesser_id === me.id && g.round_index === room.round_index
  );
  const guessedFor = (aid: string) => myGuesses.find((g) => g.answer_id === aid)?.guessed_id;
  const promptText = (pid: number) => prompts.find((p) => p.id === pid)?.text ?? '';

  async function pick(aid: string, target: string) {
    const { error } = await supabase.rpc('submit_guess', {
      p_room: room.id,
      p_answer: aid,
      p_guessed: target,
    });
    if (error) toast.error(error.message);
  }

  async function advance() {
    const { error } = await supabase.rpc('advance_to_voting', { p_room: room.id });
    if (error) toast.error(error.message);
  }

  const done = myGuesses.length >= shuffled.length;

  return (
    <PhaseShell title="Who Said It?" subtitle={`${myGuesses.length}/${shuffled.length} assigned`}>
      <div className="space-y-4">
        {shuffled.map((a) => (
          <div key={a.id} className="rounded-2xl bg-white/10 border border-white/15 p-4">
            <p className="text-xs text-fuchsia-300 mb-1">{promptText(a.prompt_id)}</p>
            <p className="text-lg font-semibold mb-3">“{a.body}”</p>
            <div className="grid grid-cols-3 gap-2">
              {players
                .filter((p) => p.id !== me.id)
                .map((p) => {
                  const chosen = guessedFor(a.id) === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => pick(a.id, p.id)}
                      className={`py-2 rounded-xl text-sm font-bold truncate transition ${
                        chosen ? 'bg-amber-400 text-black' : 'bg-white/10 hover:bg-white/20'
                      }`}
                    >
                      {p.emoji} {p.display_name}
                    </button>
                  );
                })}
            </div>
          </div>
        ))}
      </div>

      {isHost && (
        <button
          onClick={advance}
          className="mt-8 w-full py-3 rounded-2xl bg-gradient-to-r from-fuchsia-500 to-amber-400 text-black font-black"
        >
          {done ? 'Reveal guesses & vote' : 'Advance when everyone is done'}
        </button>
      )}
    </PhaseShell>
  );
}