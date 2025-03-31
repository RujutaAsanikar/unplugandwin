
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export function useAuthState() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      console.log("Auth state changed:", _event, newSession?.user?.email);
      setSession(newSession);
      setUser(newSession?.user ?? null);
      setIsLoading(false);
    });

    // THEN check for existing session
    const setData = async () => {
      try {
        const { data: { session: existingSession }, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Error getting session:", error);
        } else {
          console.log("Initial session check:", existingSession?.user?.email || "No session");
        }
        
        setSession(existingSession);
        setUser(existingSession?.user ?? null);
        setIsLoading(false);
      } catch (err) {
        console.error("Unexpected error during session check:", err);
        setIsLoading(false);
      }
    };

    setData();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { user, session, isLoading };
}
