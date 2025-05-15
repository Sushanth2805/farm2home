
import { supabase } from "@/integrations/supabase/client";

// Types for our Supabase tables
export type Profile = {
  id: string;
  full_name: string;
  location: string;
  bio?: string;
  rating?: number;
  role: string;
  created_at: string;
};

export type Produce = {
  id: number;
  farmer_id: string;
  name: string;
  description: string;
  price: number;
  location: string; // Adding the location field explicitly
  image_url: string | null;
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
  consumer_id: string; // Consumer ID instead of buyer_id
  produce_id: number;
  quantity: number;
  total_price: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "canceled";
  created_at: string;
  consumer?: Profile; // Changed from buyer to consumer
  produce?: Produce;
  rating?: number;
};

// Re-export the supabase client for easier imports
export { supabase };

// Helper functions for location-based filtering
export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
};

const deg2rad = (deg: number) => {
  return deg * (Math.PI / 180);
};

// Helper to get nearest major cities based on location string
export const getNearestMetroCities = async (location: string) => {
  // In a real app, this would call a geocoding API
  // For now, we'll return some hardcoded values
  return ["Bangalore", "Mumbai", "Delhi", "Chennai", "Hyderabad"];
};
