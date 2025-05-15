
import { createClient } from "@supabase/supabase-js";

// Get the Supabase URL and anon key from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create a Supabase client instance
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our Supabase tables
export type Profile = {
  id: string;
  role: "farmer" | "consumer";
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
  image_url: string;
  created_at: string;
  farmer?: Profile;
};

export type CartItem = {
  id: number;
  consumer_id: string;
  produce_id: number;
  quantity: number;
  created_at: string;
  produce?: Produce;
};

export type Order = {
  id: number;
  consumer_id: string;
  produce_id: number;
  quantity: number;
  total_price: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "canceled";
  created_at: string;
  consumer?: Profile;
  produce?: Produce;
};

// Database configuration for RLS policies
export const setupDatabase = async () => {
  // This is the setup for database schemas when integrating with Supabase
  // Your Supabase schema setup would happen in the Supabase dashboard
  // or through migrations in a production environment
  // This function is a placeholder to document the schema
};
