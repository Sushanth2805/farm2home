
import { useEffect, useContext } from "react";
import { AuthContext } from "./auth/authContext";
import { useAuthState } from "./auth/useAuthState";
import { useAuthMethods } from "./auth/useAuthMethods";
import { useProfileMethods } from "./auth/useProfileMethods";
import { toast } from "sonner";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Get authentication state
  const { 
    session, 
    user, 
    profile, 
    isLoading, 
    userRole,
    setProfile,
    fetchProfile, 
    setIsLoading 
  } = useAuthState();

  // Get authentication methods
  const { 
    signIn, 
    signUp, 
    signInWithGoogle, 
    signOut 
  } = useAuthMethods({ 
    setIsLoading, 
    fetchProfile 
  });

  // Get profile management methods
  const { 
    updateProfile, 
    refreshProfile 
  } = useProfileMethods({ 
    user, 
    setIsLoading, 
    setProfile, 
    fetchProfile 
  });

  // Global error handler for authentication issues
  useEffect(() => {
    const handleAuthError = (event: ErrorEvent) => {
      if (event.error?.message?.includes('authentication') || 
          event.error?.message?.includes('auth') || 
          event.error?.message?.includes('supabase')) {
        console.error('Auth error caught:', event.error);
        toast('Authentication error', {
          description: 'Please try signing in again',
        });
      }
    };

    window.addEventListener('error', handleAuthError);
    return () => window.removeEventListener('error', handleAuthError);
  }, []);

  const value = {
    session,
    user,
    profile,
    isLoggedIn: !!user,
    isLoading,
    userRole,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    updateProfile,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
