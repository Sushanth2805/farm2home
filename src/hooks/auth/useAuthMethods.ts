
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import type { Profile } from "@/lib/supabase";
import { toast } from "sonner";

interface UseAuthMethodsProps {
  setIsLoading: (loading: boolean) => void;
  fetchProfile: (userId: string) => Promise<void>;
}

export function useAuthMethods({ setIsLoading, fetchProfile }: UseAuthMethodsProps) {
  const navigate = useNavigate();

  // Sign in with email
  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        toast("Login failed", {
          description: error.message,
        });
      } else {
        toast("Welcome back!", {
          description: "You have successfully signed in.",
        });
        navigate("/profile");
      }
    } catch (error: any) {
      console.error("Error signing in:", error);
      toast("Login failed", {
        description: error.message || "An error occurred during login",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Sign up with email
  const signUp = async (email: string, password: string, fullName: string, location: string) => {
    setIsLoading(true);
    
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            location
          }
        }
      });

      if (authError) {
        throw authError;
      }

      if (authData.user) {
        // Create profile entry - using one of the allowed role values
        const { error: profileError } = await supabase
          .from("profiles")
          .insert({
            id: authData.user.id,
            full_name: fullName,
            location,
            bio: "",
            role: "user", // This matches our constraint
            created_at: new Date().toISOString()
          });

        if (profileError) {
          console.error("Error creating profile:", profileError);
          toast("Profile creation failed", {
            description: "Your account was created but we couldn't set up your profile.",
          });
        } else {
          toast("Account created!", {
            description: "Your account has been created successfully.",
          });
          navigate("/profile");
        }
      }
    } catch (error: any) {
      console.error("Error signing up:", error);
      toast("Signup failed", {
        description: error.message || "An error occurred during signup",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });

      if (error) {
        toast("Login failed", {
          description: error.message,
        });
      }
    } catch (error: any) {
      console.error("Error signing in with Google:", error);
      toast("Login failed", {
        description: error.message || "An error occurred during login",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Sign out
  const signOut = async () => {
    setIsLoading(true);
    
    try {
      await supabase.auth.signOut();
      toast("Logged out", {
        description: "You have been successfully logged out.",
      });
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
      toast("Error", {
        description: "There was a problem signing out.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    signIn,
    signUp,
    signInWithGoogle,
    signOut
  };
}
