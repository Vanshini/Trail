import { useCallback, useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type {
  Room,
  Player,
  Answer,
  Guess,
  Vote,
  Award,
  PromptRow,
} from '@/lib/types';

export function useRoom(roomId: string | undefined) {
  const [room, setRoom] = useState<Room | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [awards, setAwards] = useState<Award[]>([]);
  const [prompts, setPrompts] = useState<PromptRow[]>([]);
  const [loading, setLoading] = useState(true);
  const mounted = useRef(true);

  const load = useCallback(async () => {
    if (!roomId) return;
    const [r, p, a, g, v, aw, pr] = await Promise.all([
      supabase.from('rooms').select('*').eq('id', roomId).maybeSingle(),
      supabase.from('players').select('*').eq('room_id', roomId).order('joined_at'),
      supabase.from('answers').select('*').eq('room_id', roomId),
      supabase.from('guesses').select('*').eq('room_id', roomId),
      supabase.from('votes').select('*').eq('room_id', roomId),
      supabase.from('awards').select('*').eq('room_id', roomId),
      supabase.from('prompt_catalog').select('*').eq('active', true),
    ]);
    if (!mounted.current) return;
    setRoom((r.data as Room) ?? null);
    setPlayers((p.data as Player[]) ?? []);
    setAnswers((a.data as Answer[]) ?? []);
    setGuesses((g.data as Guess[]) ?? []);
    setVotes((v.data as Vote[]) ?? []);
    setAwards((aw.data as Award[]) ?? []);
    setPrompts((pr.data as PromptRow[]) ?? []);
    setLoading(false);
  }, [roomId]);

  useEffect(() => {
    mounted.current = true;
    load();
    return () => {
      mounted.current = false;
    };
  }, [load]);

  useEffect(() => {
    if (!roomId) return;
    const ch = supabase
      .channel(`room:${roomId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'rooms', filter: `id=eq.${roomId}` }, load)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'players', filter: `room_id=eq.${roomId}` }, load)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'answers', filter: `room_id=eq.${roomId}` }, load)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'guesses', filter: `room_id=eq.${roomId}` }, load)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'votes', filter: `room_id=eq.${roomId}` }, load)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'awards', filter: `room_id=eq.${roomId}` }, load)
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [roomId, load]);

  return { room, players, answers, guesses, votes, awards, prompts, loading, reload: load };
}