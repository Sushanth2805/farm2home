
import React, { useState, useRef } from "react";
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
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Produce } from "@/lib/supabase";

const produceFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters"
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters"
  }),
  price: z.coerce.number().positive({
    message: "Price must be a positive number"
  }),
  location: z.string().min(2, {
    message: "Location must be at least 2 characters"
  }),
});

type ProduceFormValues = z.infer<typeof produceFormSchema>;

interface ProduceFormProps {
  produceId?: number;
  defaultValues?: Partial<Produce>;
  onComplete: () => void;
}

const ProduceForm: React.FC<ProduceFormProps> = ({
  produceId,
  defaultValues = {
    name: "",
    description: "",
    price: 0,
    location: "",
  },
  onComplete,
}) => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<ProduceFormValues>({
    resolver: zodResolver(produceFormSchema),
    defaultValues: {
      name: defaultValues.name || "",
      description: defaultValues.description || "",
      price: defaultValues.price || 0,
      location: defaultValues.location || (profile?.location || ""),
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const onSubmit = async (data: ProduceFormValues) => {
    if (!user) {
      toast({
        title: "Not authenticated",
        description: "Please sign in to add produce",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // First check if the user has a profile, which is required due to foreign key constraints
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();
        
      if (profileError) {
        // Profile doesn't exist, create one with role
        const { error: createProfileError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            full_name: user.user_metadata?.full_name || 'Unknown Farmer',
            location: data.location,
            bio: null,
            role: 'user', // Add default role
            created_at: new Date().toISOString()
          });
          
        if (createProfileError) {
          throw new Error(`Error creating profile: ${createProfileError.message}`);
        }
      }
      
      let imageUrl = null;
      
      // Handle image upload if there's a selected image
      if (image) {
        const fileExt = image.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;
        
        const { error: uploadError, data: uploadData } = await supabase
          .storage
          .from('produce-images')
          .upload(filePath, image);
          
        if (uploadError) {
          throw uploadError;
        }
        
        if (uploadData) {
          const { data: { publicUrl } } = supabase
            .storage
            .from('produce-images')
            .getPublicUrl(filePath);
            
          imageUrl = publicUrl;
        }
      }
      
      if (produceId) {
        // Update existing produce
        const updateData = {
          name: data.name,
          description: data.description,
          price: data.price,
          location: data.location,
        };
        
        // Only update image if a new one was uploaded
        if (imageUrl) {
          Object.assign(updateData, { image_url: imageUrl });
        }
        
        const { error: updateError } = await supabase
          .from('produce')
          .update(updateData)
          .eq('id', produceId);
          
        if (updateError) {
          throw updateError;
        }
        
        toast({
          title: "Produce updated",
          description: "Your produce has been updated successfully.",
        });
      } else {
        // Create new produce
        const { error: insertError } = await supabase
          .from('produce')
          .insert({
            farmer_id: user.id,
            name: data.name,
            description: data.description,
            price: data.price,
            location: data.location,
            image_url: imageUrl,
            created_at: new Date().toISOString(),
          });
          
        if (insertError) {
          throw insertError;
        }
        
        toast({
          title: "Produce added",
          description: "Your produce has been added successfully.",
        });
      }
      
      // Reset form
      form.reset();
      setImage(null);
      if (imageInputRef.current) {
        imageInputRef.current.value = "";
      }
      
      // Call the onComplete callback
      onComplete();
      
    } catch (error: any) {
      console.error("Error saving produce:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save produce",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Produce Name</FormLabel>
              <FormControl>
                <Input 
                  placeholder="e.g., Organic Tomatoes" 
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
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Describe your produce..." 
                  {...field} 
                  className="organic-input min-h-[100px]"
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
                  placeholder="e.g., Bangalore, Karnataka" 
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
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price per unit (₹)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  step="0.01"
                  min="0" 
                  {...field}
                  className="organic-input"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div>
          <FormLabel htmlFor="image" className="block mb-2">Upload Image</FormLabel>
          <Input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            ref={imageInputRef}
            className="organic-input"
          />
          {image && (
            <p className="text-sm text-organic-600 mt-1">
              Selected: {image.name}
            </p>
          )}
          {!image && defaultValues.image_url && (
            <div className="mt-2">
              <p className="text-sm text-organic-600 mb-2">Current Image:</p>
              <img
                src={defaultValues.image_url}
                alt={defaultValues.name}
                className="h-32 w-auto object-cover rounded-md"
              />
            </div>
          )}
        </div>
        
        <div className="flex justify-end">
          <Button 
            type="submit" 
            className="bg-organic-500 hover:bg-organic-600"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {produceId ? "Updating..." : "Adding..."}
              </>
            ) : (
              produceId ? "Update Produce" : "Add Produce"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProduceForm;
