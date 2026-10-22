import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import Home from './pages/Home';
import Room from './pages/Room';
import { isSupabaseConfigured } from './lib/supabase';

export default function App() {
  if (!isSupabaseConfigured) {
    return (
      <main className="min-h-dvh bg-indigo-950 p-6 text-white flex items-center justify-center">
        <div className="max-w-lg rounded-xl border border-white/20 bg-white/10 p-6">
          <h1 className="mb-3 text-xl font-bold">Supabase setup required</h1>
          <p className="text-white/80">
            Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your Vercel project environment
            variables, then redeploy.
          </p>
        </div>
      </main>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/room/:id" element={<Room />} />
      </Routes>
      <Toaster position="top-center" richColors />
    </BrowserRouter>
  );
}
