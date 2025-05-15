
import React, { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import ProduceCard from "@/components/marketplace/ProduceCard";
import { Input } from "@/components/ui/input";
import { supabase, Produce } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Search } from "lucide-react";

const BrowseProduce: React.FC = () => {
  const [produces, setProduces] = useState<Produce[]>([]);
  const [filteredProduces, setFilteredProduces] = useState<Produce[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const fetchProduces = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("produce")
          .select(`
            *,
            farmer:farmer_id(*)
          `)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setProduces(data || []);
        setFilteredProduces(data || []);
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
        (produce.farmer?.location.toLowerCase().includes(location));
      
      return (nameMatch || descriptionMatch) && locationMatch;
    });
    
    setFilteredProduces(filtered);
  }, [searchQuery, locationFilter, produces]);

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
              Explore fresh, locally grown organic produce from farmers in your area.
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
                <label htmlFor="location" className="text-sm font-medium text-organic-700 mb-1 block">
                  Filter by Farmer Location
                </label>
                <Input
                  id="location"
                  placeholder="Enter location..."
                  className="organic-input"
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                />
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
