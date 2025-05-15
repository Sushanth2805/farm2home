
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";

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
});

type ProduceFormValues = z.infer<typeof produceFormSchema>;

interface ProduceFormProps {
  produceId?: number;
  defaultValues?: Partial<ProduceFormValues>;
  onComplete: () => void;
}

const ProduceForm: React.FC<ProduceFormProps> = ({
  produceId,
  defaultValues = {
    name: "",
    description: "",
    price: 0,
  },
  onComplete,
}) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const isEditMode = !!produceId;

  const form = useForm<ProduceFormValues>({
    resolver: zodResolver(produceFormSchema),
    defaultValues,
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const onSubmit = async (data: ProduceFormValues) => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      let imageUrl = null;
      
      // Handle image upload if there's a selected image
      if (selectedImage) {
        const fileExt = selectedImage.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('produce-images')
          .upload(filePath, selectedImage);
          
        if (uploadError) {
          throw uploadError;
        }
        
        // Get the public URL
        const { data: urlData } = supabase.storage
          .from('produce-images')
          .getPublicUrl(filePath);
          
        if (urlData) {
          imageUrl = urlData.publicUrl;
        }
      }
      
      // Save or update the produce record
      if (isEditMode) {
        // Update existing produce
        const updateData: any = {
          name: data.name,
          description: data.description,
          price: data.price,
        };
        
        // Only update image if a new one was uploaded
        if (imageUrl) {
          updateData.image_url = imageUrl;
        }
        
        const { error } = await supabase
          .from('produce')
          .update(updateData)
          .eq('id', produceId)
          .eq('farmer_id', user.id);
          
        if (error) throw error;
        
        toast({
          title: "Produce updated",
          description: "Your produce has been updated successfully",
        });
      } else {
        // Create new produce
        const { error } = await supabase
          .from('produce')
          .insert([
            {
              farmer_id: user.id,
              name: data.name,
              description: data.description,
              price: data.price,
              image_url: imageUrl,
              created_at: new Date().toISOString(),
            },
          ]);
          
        if (error) throw error;
        
        toast({
          title: "Produce added",
          description: "Your produce has been added successfully",
        });
      }
      
      onComplete();
      
    } catch (error: any) {
      console.error("Error saving produce:", error);
      toast({
        title: "Error",
        description: error.message || "An error occurred while saving produce",
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
              <FormLabel>Product Name</FormLabel>
              <FormControl>
                <Input 
                  placeholder="e.g., Organic Carrots" 
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
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price (per unit)</FormLabel>
              <FormControl>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-organic-700">
                    ₹
                  </span>
                  <Input 
                    type="number" 
                    placeholder="0.00" 
                    {...field}
                    step="0.01"
                    min="0"
                    className="organic-input pl-8"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="space-y-2">
          <FormLabel htmlFor="image">Product Image</FormLabel>
          <div className="border-2 border-dashed border-organic-200 rounded-md p-4">
            <Input 
              id="image"
              type="file" 
              accept="image/*"
              onChange={handleImageChange}
              className="organic-input"
            />
            <p className="text-sm text-organic-600 mt-2">
              Upload a clear image of your product. Recommended size: 800x600px.
            </p>
          </div>
          {selectedImage && (
            <p className="text-sm text-organic-700">
              Selected file: {selectedImage.name}
            </p>
          )}
        </div>
        
        <div className="flex justify-end space-x-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onComplete}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            className="bg-organic-500 hover:bg-organic-600"
            disabled={isLoading}
          >
            {isLoading ? 
              (isEditMode ? "Updating..." : "Adding...") : 
              (isEditMode ? "Update Produce" : "Add Produce")}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProduceForm;
