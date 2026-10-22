import { useParams, Link } from 'react-router-dom';
import { useSession } from '@/hooks/useSession';
import { useRoom } from '@/hooks/useRoom';
import LobbyScreen from '@/components/LobbyScreen';
import PromptsScreen from '@/components/PromptsScreen';
import GuessingScreen from '@/components/GuessingScreen';
import VotingScreen from '@/components/VotingScreen';
import RevealScreen from '@/components/RevealScreen';

export default function Room() {
  const { id } = useParams();
  const { user, ready } = useSession();
  const { room, players, answers, guesses, votes, awards, prompts, loading } = useRoom(id);

  if (!ready || loading) return <Center>Summoning the council…</Center>;
  if (!room || !user)
    return (
      <Center>
        Room not found. <Link to="/" className="underline">Go home</Link>
      </Center>
    );

  const me = players.find((p) => p.auth_uid === user.id);
  if (!me)
    return (
      <Center>
        You're not in this room. <Link to="/" className="underline">Go home</Link>
      </Center>
    );

  const isHost = room.host_id === user.id;
  const shared = { room, players, me, isHost };

  switch (room.phase) {
    case 'lobby':
      return <LobbyScreen {...shared} />;
    case 'prompts':
      return <PromptsScreen {...shared} prompts={prompts} answers={answers} />;
    case 'guessing':
      return <GuessingScreen {...shared} prompts={prompts} answers={answers} guesses={guesses} />;
    case 'voting':
      return <VotingScreen {...shared} prompts={prompts} votes={votes} />;
    case 'reveal':
      return <RevealScreen {...shared} awards={awards} />;
  }
}

function Center({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-indigo-950 text-white flex items-center justify-center p-6 text-center">
      <div>{children}</div>
    </div>
  );
}