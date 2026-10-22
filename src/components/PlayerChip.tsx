import type { Player } from '@/lib/types';

export default function PlayerChip({
  p,
  you,
  host,
}: {
  p: Player;
  you?: boolean;
  host?: boolean;
}) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 border border-white/15">
      <span className="text-2xl">{p.emoji}</span>
      <div className="min-w-0">
        <div className="font-semibold truncate">
          {p.display_name}
          {you && ' (you)'}
        </div>
        <div className="text-[10px] uppercase text-white/50">{host ? 'host' : 'friend'}</div>
      </div>
      <div className="ml-auto font-mono text-sm text-amber-300">{p.score}</div>
    </div>
  );
}