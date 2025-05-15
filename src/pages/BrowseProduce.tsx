
import React, { useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/hooks/useAuth";
import { useProduce } from "@/hooks/useProduce";
import ProduceList from "@/components/marketplace/ProduceList";
import ProduceSearch from "@/components/marketplace/ProduceSearch";

const BrowseProduce: React.FC = () => {
  const { profile } = useAuth();
  
  // Get initial location from user profile if available
  const initialLocation = profile?.location ? profile.location.split(',')[0].trim() : '';
  
  const { 
    filteredProduces,
    isLoading,
    searchQuery,
    setSearchQuery,
    locationFilter,
    setLocationFilter,
    metroCities
  } = useProduce(initialLocation);

  // Use user location if available
  useEffect(() => {
    if (profile?.location && !locationFilter && metroCities.length > 0) {
      const userCity = profile.location.split(',')[0].trim();
      if (metroCities.includes(userCity)) {
        setLocationFilter(userCity);
      }
    }
  }, [profile, metroCities, locationFilter, setLocationFilter]);

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
          <ProduceSearch 
            searchQuery={searchQuery}
            locationFilter={locationFilter}
            metroCities={metroCities}
            onSearchChange={setSearchQuery}
            onLocationChange={setLocationFilter}
          />

          {/* Results */}
          <ProduceList 
            produces={filteredProduces}
            isLoading={isLoading}
            searchQuery={searchQuery}
            locationFilter={locationFilter}
          />
        </div>
      </section>
    </Layout>
  );
};

export default BrowseProduce;
