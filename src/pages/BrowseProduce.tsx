
import React, { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import ProduceCard from "@/components/marketplace/ProduceCard";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { supabase, Produce } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Search, MapPin } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const BrowseProduce: React.FC = () => {
  const [produces, setProduces] = useState<Produce[]>([]);
  const [filteredProduces, setFilteredProduces] = useState<Produce[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [metroCities, setMetroCities] = useState<string[]>([]);
  const { toast } = useToast();
  const { profile } = useAuth();

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
        
        // Check if data is valid and has items
        if (!data || data.length === 0) {
          console.log("No produce items found");
          setProduces([]);
          setFilteredProduces([]);
        } else {
          // Set the data with proper typing
          setProduces(data as unknown as Produce[]);
          setFilteredProduces(data as unknown as Produce[]);
          
          // Extract unique cities from produce locations
          const cities = Array.from(
            new Set((data as unknown as Produce[]).map(p => {
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

  // Use user location as initial filter if available
  useEffect(() => {
    if (profile?.location && !locationFilter) {
      const userCity = profile.location.split(',')[0].trim();
      if (metroCities.includes(userCity)) {
        setLocationFilter(userCity);
      }
    }
  }, [profile, metroCities, locationFilter]);

  return (
    <Layout>
      <section className="py-12">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-organic-900 mb-4">
              Browse Organic Produce
            </h1>
            <p className="text-xl text-organic-700 max-w-2xl mx-auto">
              Explore fresh, locally grown organic produce from local sellers
            </p>
          </div>

          {/* Search & Filter */}
          <div className="bg-white shadow-md rounded-lg p-6 mb-8 border border-organic-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="search" className="text-sm font-medium text-organic-700 mb-1 block">
                  Search Produce
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-organic-500" />
                  <Input
                    id="search"
                    placeholder="Search by name or description..."
                    className="organic-input pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-organic-700 mb-1 block">
                  Filter by Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-organic-500 pointer-events-none" />
                  <Select value={locationFilter} onValueChange={setLocationFilter}>
                    <SelectTrigger className="organic-input pl-9">
                      <SelectValue placeholder="All locations" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All locations</SelectItem>
                      {metroCities.map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-organic-500"></div>
            </div>
          ) : filteredProduces.length === 0 ? (
            <div className="text-center py-12 bg-organic-50 rounded-lg border border-organic-100">
              <h3 className="text-xl font-semibold text-organic-800 mb-2">No produce found</h3>
              <p className="text-organic-600">
                {searchQuery || locationFilter
                  ? "Try adjusting your search or filter criteria."
                  : "There are no produce listings available right now."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProduces.map((produce) => (
                <ProduceCard key={produce.id} produce={produce} />
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default BrowseProduce;
