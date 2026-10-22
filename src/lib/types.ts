export type Phase = 'lobby' | 'prompts' | 'guessing' | 'voting' | 'reveal';

export type Room = {
  id: string;
  code: string;
  host_id: string;
  phase: Phase;
  round_index: number;
  created_at: string;
};

export type Player = {
  id: string;
  room_id: string;
  auth_uid: string;
  display_name: string;
  emoji: string;
  score: number;
  joined_at: string;
};

export type Answer = {
  id: string;
  room_id: string;
  round_index: number;
  author_id: string;
  prompt_id: number;
  body: string;
};

export type Guess = {
  id: string;
  room_id: string;
  round_index: number;
  answer_id: string;
  guesser_id: string;
  guessed_id: string;
  correct: boolean;
};

export type Vote = {
  id: string;
  room_id: string;
  round_index: number;
  prompt_id: number;
  voter_id: string;
  target_id: string;
};

export type Award = {
  id: string;
  room_id: string;
  title: string;
  player_id: string | null;
  detail: string | null;
};

export type PromptRow = {
  id: number;
  kind: 'answer' | 'vote';
  text: string;
};