
import React, { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/hooks/useAuth";
import { useProduce } from "@/hooks/useProduce";
import ProduceList from "@/components/marketplace/ProduceList";
import ProduceSearch from "@/components/marketplace/ProduceSearch";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Filter, Grid3X3, List } from "lucide-react";
import { Button } from "@/components/ui/button";

const BrowseProduce: React.FC = () => {
  const { profile } = useAuth();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  
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
      <section className="py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Header Section */}
          <Card className="mb-8 bg-organic-50 border-organic-100">
            <CardHeader>
              <CardTitle className="text-4xl font-bold text-organic-900">
                Browse Organic Produce
              </CardTitle>
              <CardDescription className="text-xl text-organic-700">
                Discover fresh, locally grown organic produce from farmers near you
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Search & Filter */}
              <ProduceSearch 
                searchQuery={searchQuery}
                locationFilter={locationFilter}
                metroCities={metroCities}
                onSearchChange={setSearchQuery}
                onLocationChange={setLocationFilter}
              />
            </CardContent>
          </Card>
          
          {/* Results Section */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-organic-900">
                {filteredProduces.length > 0 
                  ? `${filteredProduces.length} items found` 
                  : "No items found"}
              </h2>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-organic-600 mr-2">View:</span>
                <Button 
                  variant={viewMode === "grid" ? "default" : "outline"} 
                  size="icon"
                  onClick={() => setViewMode("grid")}
                  aria-label="Grid view"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button 
                  variant={viewMode === "list" ? "default" : "outline"} 
                  size="icon"
                  onClick={() => setViewMode("list")}
                  aria-label="List view"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Produce Listings */}
            <ProduceList 
              produces={filteredProduces}
              isLoading={isLoading}
              searchQuery={searchQuery}
              locationFilter={locationFilter}
              viewMode={viewMode}
            />
            
            {/* Pagination (static for now) */}
            {filteredProduces.length > 0 && (
              <Pagination className="mt-8">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href="#" />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#" isActive>1</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">2</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">3</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext href="#" />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default BrowseProduce;
