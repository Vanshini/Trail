import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

const EMOJIS = ['😎', '🤪', '🦄', '🐙', '👽', '🔥', '🍕', '🎲', '🧠', '💀', '🐸', '🌈'];

export default function Home() {
  const nav = useNavigate();
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState(EMOJIS[0]);
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);

  async function createRoom() {
    if (!name.trim()) return toast.error('Pick a name');
    setBusy(true);
    const { data, error } = await supabase.rpc('create_room', {
      p_name: name,
      p_emoji: emoji,
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    nav(`/room/${(data as { id: string }).id}`);
  }

  async function joinRoom() {
    if (!name.trim()) return toast.error('Pick a name');
    if (code.trim().length !== 6) return toast.error('Code must be 6 characters');
    setBusy(true);
    const { data, error } = await supabase.rpc('join_room', {
      p_code: code,
      p_name: name,
      p_emoji: emoji,
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    nav(`/room/${(data as { id: string }).id}`);
  }

  return (
    <div className="min-h-dvh bg-gradient-to-b from-fuchsia-600 via-purple-700 to-indigo-900 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md p-6 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-xl shadow-2xl">
        <h1 className="text-3xl font-black tracking-tight mb-1">THE FRIENDSHIP TRIALS</h1>
        <p className="text-white/70 mb-6 text-sm">Four friends. Zero mercy. One verdict.</p>

        <label className="text-xs uppercase tracking-widest text-white/60">Your name</label>
        <input
          value={name}
          maxLength={20}
          onChange={(e) => setName(e.target.value)}
          placeholder="Chaos Gremlin"
          className="w-full mt-1 mb-4 px-3 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder:text-white/50 outline-none focus:ring-2 focus:ring-amber-300"
        />

        <div className="mb-4">
          <div className="text-xs uppercase tracking-widest text-white/60 mb-2">Your vibe</div>
          <div className="flex flex-wrap gap-2">
            {EMOJIS.map((e) => (
              <button
                key={e}
                type="button"
                onClick={() => setEmoji(e)}
                className={`text-2xl p-2 rounded-lg transition ${
                  emoji === e ? 'bg-white/30 scale-110' : 'bg-white/10 hover:bg-white/20'
                }`}
              >
                {e}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={createRoom}
          disabled={busy}
          className="w-full mb-3 py-3 rounded-xl bg-gradient-to-r from-fuchsia-500 to-amber-400 text-black font-black disabled:opacity-50"
        >
          Create room
        </button>

        <div className="flex gap-2">
          <input
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            maxLength={6}
            placeholder="CODE"
            className="flex-1 px-3 py-2 rounded-lg bg-white/20 border border-white/30 text-white uppercase placeholder:text-white/50 outline-none"
          />
          <button
            onClick={joinRoom}
            disabled={busy}
            className="px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 font-bold disabled:opacity-50"
          >
            Join
          </button>
        </div>
      </div>
    </div>
  );
}