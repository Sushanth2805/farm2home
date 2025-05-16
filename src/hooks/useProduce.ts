
import { useState, useEffect, useCallback } from 'react';
import { supabase } from "@/lib/supabase";
import { Produce } from "@/lib/supabase";
import { toast } from "sonner";

export const useProduce = (initialLocation: string = 'all') => {
  const [produces, setProduces] = useState<Produce[]>([]);
  const [filteredProduces, setFilteredProduces] = useState<Produce[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState(initialLocation);
  const [metroCities, setMetroCities] = useState<string[]>([]);

  // Fetch all produce items
  const fetchProduces = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("produce")
        .select(`
          *,
          farmer:farmer_id(*)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Supabase error:", error);
        toast("Error loading produce", {
          description: "Please try refreshing the page",
        });
        throw error;
      }
      
      // Check if data is valid
      if (!data || data.length === 0) {
        console.log("No produce items found");
        setProduces([]);
        setFilteredProduces([]);
        setMetroCities([]);
      } else {
        // Set the data
        setProduces(data as Produce[]);
        setFilteredProduces(data as Produce[]);
        
        // Extract unique cities from produce locations
        const cities = Array.from(
          new Set((data as Produce[]).map(p => {
            const location = p.location || '';
            return location.split(',')[0].trim();
          }))
        ).filter(Boolean).sort();
        
        setMetroCities(cities);
      }
    } catch (error) {
      console.error("Error fetching produces:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchProduces();
  }, [fetchProduces]);

  // Filter produces when search query or location filter changes
  useEffect(() => {
    if (produces.length === 0) return;

    const query = searchQuery.toLowerCase().trim();
    const location = locationFilter.toLowerCase().trim();
    
    let filtered = [...produces];
    
    // Apply search filter if query exists
    if (query) {
      filtered = filtered.filter(produce => {
        const nameMatch = produce.name.toLowerCase().includes(query);
        const descriptionMatch = produce.description && 
          produce.description.toLowerCase().includes(query);
        return nameMatch || descriptionMatch;
      });
    }
    
    // Apply location filter if not 'all'
    if (location !== 'all') {
      filtered = filtered.filter(produce => 
        produce.location && produce.location.toLowerCase().includes(location)
      );
    }
    
    setFilteredProduces(filtered);
  }, [searchQuery, locationFilter, produces]);

  // Set search query with proper update to filtered produces
  const setSearchQueryWithFilter = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  // Set location filter with proper update
  const setLocationFilterWithUpdate = useCallback((location: string) => {
    setLocationFilter(location);
  }, []);

  // Function to refresh data
  const refreshProduces = useCallback(() => {
    fetchProduces();
  }, [fetchProduces]);

  return {
    produces,
    filteredProduces,
    isLoading,
    searchQuery,
    setSearchQuery: setSearchQueryWithFilter,
    locationFilter,
    setLocationFilter: setLocationFilterWithUpdate,
    metroCities,
    refreshProduces
  };
};
