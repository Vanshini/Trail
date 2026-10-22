import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';

export function useSession() {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    (async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session?.user) {
        if (mounted) {
          setUser(data.session.user);
          setReady(true);
        }
        return;
      }
      const { data: anon, error } = await supabase.auth.signInAnonymously();
      if (error) console.error('anon signin failed', error);
      if (mounted) {
        setUser(anon.user);
        setReady(true);
      }
    })();

    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setUser(s?.user ?? null);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return { user, ready };
}