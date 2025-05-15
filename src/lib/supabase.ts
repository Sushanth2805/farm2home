
import { supabase } from "@/integrations/supabase/client";

// Types for our Supabase tables
export type Profile = {
  id: string;
  role: string; // Changed from "farmer" | "consumer" to string
  full_name: string;
  location: string;
  bio?: string;
  created_at: string;
};

export type Produce = {
  id: number;
  farmer_id: string;
  name: string;
  description: string;
  price: number;
  image_url: string | null;
  created_at: string;
  farmer?: Profile;
};

export type CartItem = {
  id: number;
  user_id: string; // Changed from consumer_id
  produce_id: number;
  quantity: number;
  created_at: string;
  produce?: Produce;
};

export type Order = {
  id: number;
  buyer_id: string; // Changed from consumer_id
  produce_id: number;
  quantity: number;
  total_price: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "canceled";
  created_at: string;
  buyer?: Profile; // Changed from consumer
  produce?: Produce;
};

// Re-export the supabase client for easier imports
export { supabase };

// Database configuration for RLS policies
export const setupDatabase = async () => {
  // This is the setup for database schemas when integrating with Supabase
  // Your Supabase schema setup would happen in the Supabase dashboard
  // or through migrations in a production environment
  // This function is a placeholder to document the schema
};
