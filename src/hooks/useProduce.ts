
import { useState, useEffect } from 'react';
import { supabase } from "@/lib/supabase";
import { Produce } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

export const useProduce = (initialLocation: string = '') => {
  const [produces, setProduces] = useState<Produce[]>([]);
  const [filteredProduces, setFilteredProduces] = useState<Produce[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState(initialLocation);
  const [metroCities, setMetroCities] = useState<string[]>([]);
  const { toast } = useToast();

  // Fetch all produce items
  useEffect(() => {
    const fetchProduces = async () => {
      setIsLoading(true);
      try {
        console.log("Fetching produce data...");
        const { data, error } = await supabase
          .from("produce")
          .select(`
            *,
            farmer:farmer_id(*)
          `);

        if (error) {
          console.error("Supabase error:", error);
          throw error;
        }
        
        console.log("Produce data fetched:", data);
        
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
          console.log("Cities extracted:", cities);
        }
      } catch (error) {
        console.error("Error fetching produces:", error);
        toast({
          title: "Error",
          description: "Failed to load produce listings",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduces();
  }, []);

  // Filter produces when search query or location filter changes
  useEffect(() => {
    const query = searchQuery.toLowerCase();
    const location = locationFilter.toLowerCase();
    
    const filtered = produces.filter(produce => {
      const nameMatch = produce.name.toLowerCase().includes(query);
      const descriptionMatch = produce.description.toLowerCase().includes(query);
      const locationMatch = !location || 
        (produce.location && produce.location.toLowerCase().includes(location));
      
      return (nameMatch || descriptionMatch) && locationMatch;
    });
    
    setFilteredProduces(filtered);
  }, [searchQuery, locationFilter, produces]);

  return {
    produces,
    filteredProduces,
    isLoading,
    searchQuery,
    setSearchQuery,
    locationFilter,
    setLocationFilter,
    metroCities
  };
};
