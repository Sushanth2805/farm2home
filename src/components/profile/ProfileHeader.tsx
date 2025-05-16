
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { Profile } from "@/lib/supabase";

const profileSchema = z.object({
  full_name: z.string().min(2, {
    message: "Full name must be at least 2 characters",
  }),
  location: z.string().min(2, {
    message: "Location must be at least 2 characters",
  }),
  bio: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileHeaderProps {
  profile: Profile | null;
  updateProfile: (data: Partial<Profile>) => Promise<void>;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ profile, updateProfile }) => {
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: profile?.full_name || "",
      location: profile?.location || "",
      bio: profile?.bio || "",
    },
  });

  // Update form values when profile changes
  React.useEffect(() => {
    if (profile) {
      form.reset({
        full_name: profile.full_name || "",
        location: profile.location || "",
        bio: profile.bio || "",
      });
    }
  }, [profile, form]);

  const onSubmitProfile = async (data: ProfileFormValues) => {
    await updateProfile(data);
    setIsEditingProfile(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 md:p-8 border border-organic-100 mb-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-organic-900">
            {profile?.full_name || "Your Profile"}
          </h1>
          <p className="text-organic-600 mt-1 capitalize">
            {profile?.role || "User"} Account
          </p>
        </div>
        {!isEditingProfile && (
          <Button
            variant="outline"
            className="mt-4 md:mt-0"
            onClick={() => setIsEditingProfile(true)}
          >
            Edit Profile
          </Button>
        )}
      </div>

      {isEditingProfile ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmitProfile)} className="space-y-6">
            <FormField
              control={form.control}
              name="full_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Your name"
                      {...field}
                      className="organic-input"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="City, State"
                      {...field}
                      className="organic-input"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us about yourself..."
                      {...field}
                      className="organic-input min-h-[100px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditingProfile(false)}
              >
                Cancel
              </Button>
              <Button className="bg-organic-500 hover:bg-organic-600">
                Save Changes
              </Button>
            </div>
          </form>
        </Form>
      ) : (
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-organic-600">Location</h3>
            <p className="mt-1">{profile?.location || "Not specified"}</p>
          </div>
          {profile?.bio && (
            <div>
              <h3 className="text-sm font-medium text-organic-600">About</h3>
              <p className="mt-1">{profile.bio}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfileHeader;
