
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
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
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        toast.error("Login failed", {
          description: error.message,
        });
        throw error;
      } else {
        // Use timeout to avoid triggering navigate too early
        setTimeout(() => {
          toast.success("Welcome back!", {
            description: "You have successfully signed in.",
          });
          navigate("/profile");
        }, 100);
      }
    } catch (error: any) {
      console.error("Error signing in:", error);
      throw error;
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
          toast.error("Profile creation failed", {
            description: "Your account was created but we couldn't set up your profile.",
          });
        } else {
          toast.success("Account created!", {
            description: "Your account has been created successfully.",
          });
          navigate("/profile");
        }
      }
    } catch (error: any) {
      console.error("Error signing up:", error);
      toast.error("Signup failed", {
        description: error.message || "An error occurred during signup",
      });
      throw error;
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
          redirectTo: window.location.origin + '/profile',
          queryParams: {
            prompt: 'select_account'
          }
        }
      });

      if (error) {
        toast.error("Login failed", {
          description: error.message,
        });
        throw error;
      }
    } catch (error: any) {
      console.error("Error signing in with Google:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Sign out
  const signOut = async () => {
    setIsLoading(true);
    
    try {
      await supabase.auth.signOut();
      toast.success("Logged out", {
        description: "You have been successfully logged out.",
      });
      navigate("/");
    } catch (error: any) {
      console.error("Error signing out:", error);
      toast.error("Error", {
        description: "There was a problem signing out.",
      });
      throw error;
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
