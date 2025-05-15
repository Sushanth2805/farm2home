
import { useEffect } from "react";
import { AuthContext } from "./auth/authContext";
import { useAuthState } from "./auth/useAuthState";
import { useAuthMethods } from "./auth/useAuthMethods";
import { useProfileMethods } from "./auth/useProfileMethods";

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

// Import at the top
import { useContext } from "react";
