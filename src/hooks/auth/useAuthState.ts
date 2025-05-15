
import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { supabase } from "@/lib/supabase";
import type { Profile } from "@/lib/supabase";
import { Session, User } from "@supabase/supabase-js";

export function useAuthState() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);

  // Fetch user profile
  const fetchProfile = async (userId: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        throw error;
      }

      setProfile(data as Profile);
      setUserRole(data?.role || null);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Check for authentication status on mount
  useEffect(() => {
    // First set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        // Use setTimeout to prevent potential auth flow deadlocks
        setTimeout(() => {
          setSession(currentSession);
          setUser(currentSession?.user ?? null);
          
          // Handle auth events
          if (event === 'SIGNED_IN' && currentSession?.user) {
            fetchProfile(currentSession.user.id);
          } else if (event === 'SIGNED_OUT') {
            setProfile(null);
            setUserRole(null);
            setIsLoading(false);
          }
        }, 0);
      }
    );

    // Then check for existing session
    const initializeAuth = async () => {
      setIsLoading(true);
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        // If there's a user, fetch their profile
        if (currentSession?.user) {
          await fetchProfile(currentSession.user.id);
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Clean up subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    session,
    user,
    profile,
    isLoading,
    userRole,
    setProfile,
    fetchProfile,
    setIsLoading,
  };
}
