import { useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import type { Room, Player, Vote, PromptRow } from '@/lib/types';
import { votePromptsForRound } from '@/lib/gameLogic';
import PhaseShell from './PhaseShell';

export default function VotingScreen({
  room,
  players,
  me,
  isHost,
  prompts,
  votes,
}: {
  room: Room;
  players: Player[];
  me: Player;
  isHost: boolean;
  prompts: PromptRow[];
  votes: Vote[];
}) {
  const votePrompts = useMemo(
    () => votePromptsForRound(prompts, room.round_index),
    [prompts, room.round_index]
  );
  const myVotes = votes.filter(
    (v) => v.voter_id === me.id && v.round_index === room.round_index
  );
  const myPick = (pid: number) => myVotes.find((v) => v.prompt_id === pid)?.target_id;

  async function vote(pid: number, target: string) {
    const { error } = await supabase.rpc('submit_vote', {
      p_room: room.id,
      p_prompt_id: pid,
      p_target: target,
    });
    if (error) toast.error(error.message);
  }

  async function finalize() {
    const { error } = await supabase.rpc('finalize_game', { p_room: room.id });
    if (error) toast.error(error.message);
  }

  return (
    <PhaseShell
      title="The Judgment"
      subtitle={`${myVotes.length}/${votePrompts.length} verdicts cast`}
    >
      <div className="space-y-5">
        {votePrompts.map((pr) => (
          <div key={pr.id} className="rounded-2xl bg-white/10 border border-white/15 p-4">
            <p className="text-sm text-white/80 mb-3">{pr.text}</p>
            <div className="grid grid-cols-2 gap-2">
              {players
                .filter((p) => p.id !== me.id)
                .map((p) => {
                  const chosen = myPick(pr.id) === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => vote(pr.id, p.id)}
                      className={`py-2 px-2 rounded-xl text-sm font-bold truncate transition ${
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
          onClick={finalize}
          className="mt-8 w-full py-3 rounded-2xl bg-gradient-to-r from-fuchsia-500 to-amber-400 text-black font-black"
        >
          Deliver the verdict
        </button>
      )}
    </PhaseShell>
  );
}