
import { supabase } from "@/lib/supabase";
import type { Profile } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { toast } from "sonner";

interface UseProfileMethodsProps {
  user: User | null;
  setIsLoading: (loading: boolean) => void;
  setProfile: (profile: Profile | null) => void;
  fetchProfile: (userId: string) => Promise<void>;
}

export function useProfileMethods({ 
  user, 
  setIsLoading, 
  setProfile, 
  fetchProfile 
}: UseProfileMethodsProps) {
  
  // Update user profile
  const updateProfile = async (data: Partial<Profile>) => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from("profiles")
        .update(data)
        .eq("id", user.id);

      if (error) {
        throw error;
      }

      // Update the local profile state
      setProfile((prev) => (prev ? { ...prev, ...data } : null));
      
      toast("Profile updated", {
        description: "Your profile has been updated successfully.",
      });
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast("Update failed", {
        description: error.message || "An error occurred while updating your profile",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh user profile data
  const refreshProfile = async () => {
    if (!user) return;
    
    try {
      await fetchProfile(user.id);
    } catch (error) {
      console.error("Error refreshing profile:", error);
    }
  };

  return {
    updateProfile,
    refreshProfile
  };
}
