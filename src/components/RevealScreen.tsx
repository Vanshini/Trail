import { useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import type { Room, Player, Award } from '@/lib/types';
import PhaseShell from './PhaseShell';

export default function RevealScreen({
  room,
  players,
  me,
  isHost,
  awards,
}: {
  room: Room;
  players: Player[];
  me: Player;
  isHost: boolean;
  awards: Award[];
}) {
  const ranked = useMemo(() => [...players].sort((a, b) => b.score - a.score), [players]);
  const winner = ranked[0];

  useEffect(() => {
    confetti({ particleCount: 220, spread: 90, origin: { y: 0.6 } });
  }, []);

  const playerName = (id: string | null) => {
    const p = players.find((x) => x.id === id);
    return p ? `${p.emoji} ${p.display_name}` : '—';
  };

  async function playAgain() {
    const { error } = await supabase.rpc('restart_room', { p_room: room.id });
    if (error) toast.error(error.message);
  }

  return (
    <PhaseShell title="The Verdict" subtitle={`Room ${room.code}`}>
      <div className="rounded-3xl bg-gradient-to-br from-amber-300 to-fuchsia-500 text-black p-6 mb-6 text-center">
        <p className="text-xs uppercase tracking-widest opacity-70">Certified Best Friend</p>
        <p className="text-5xl mt-2">{winner?.emoji}</p>
        <p className="text-3xl font-black mt-1">{winner?.display_name}</p>
        <p className="text-sm opacity-80 mt-1">{winner?.score} pts of friendship</p>
      </div>

      <div className="space-y-2 mb-6">
        {ranked.map((p, i) => (
          <div key={p.id} className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/10">
            <span className="font-mono text-white/50 w-5">{i + 1}.</span>
            <span className="text-2xl">{p.emoji}</span>
            <span className="font-bold">
              {p.display_name}
              {p.id === me.id && ' (you)'}
            </span>
            <span className="ml-auto font-mono text-amber-300">{p.score}</span>
          </div>
        ))}
      </div>

      <h2 className="text-lg font-bold mb-2">Awards</h2>
      <div className="space-y-2">
        {awards.map((a) => (
          <div key={a.id} className="rounded-2xl bg-white/10 border border-white/15 p-4">
            <p className="text-xs uppercase tracking-widest text-amber-300">{a.title}</p>
            <p className="font-bold">{playerName(a.player_id)}</p>
            {a.detail && <p className="text-sm text-white/60">{a.detail}</p>}
          </div>
        ))}
      </div>

      {isHost ? (
        <button
          onClick={playAgain}
          className="block w-full mt-8 py-3 rounded-2xl bg-gradient-to-r from-fuchsia-500 to-amber-400 text-black font-black"
        >
          Play again
        </button>
      ) : (
        <p className="mt-8 text-center text-white/50 text-sm">Waiting for host to restart…</p>
      )}
    </PhaseShell>
  );
}