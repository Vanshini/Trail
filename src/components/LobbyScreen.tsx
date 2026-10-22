import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import type { Room, Player } from '@/lib/types';
import PhaseShell from './PhaseShell';
import PlayerChip from './PlayerChip';
import CopyCode from './CopyCode';

export default function LobbyScreen({
  room,
  players,
  me,
  isHost,
}: {
  room: Room;
  players: Player[];
  me: Player;
  isHost: boolean;
}) {
  async function start() {
    const { error } = await supabase.rpc('start_game', { p_room: room.id });
    if (error) toast.error(error.message);
  }

  return (
    <PhaseShell title="The Gathering" subtitle={`${players.length}/4 friends present`}>
      <div className="mb-4">
        <p className="text-xs uppercase tracking-widest text-white/60 mb-2">Invite code</p>
        <CopyCode code={room.code} />
      </div>

      <div className="space-y-2 mb-6">
        {players.map((p) => (
          <PlayerChip
            key={p.id}
            p={p}
            you={p.id === me.id}
            host={p.auth_uid === room.host_id}
          />
        ))}
        {Array.from({ length: Math.max(0, 4 - players.length) }).map((_, i) => (
          <div
            key={i}
            className="px-3 py-2 rounded-xl border border-dashed border-white/15 text-white/30 text-sm"
          >
            Waiting for a friend to appear…
          </div>
        ))}
      </div>

      {isHost ? (
        <button
          disabled={players.length !== 4}
          onClick={start}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-fuchsia-500 to-amber-400 text-black font-black disabled:opacity-40"
        >
          {players.length === 4 ? 'Begin the Trials' : `Waiting on ${4 - players.length} more`}
        </button>
      ) : (
        <p className="text-center text-white/50 text-sm">Waiting for the host to start…</p>
      )}
    </PhaseShell>
  );
}