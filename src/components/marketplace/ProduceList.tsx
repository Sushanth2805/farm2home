
import React from "react";
import { Produce } from "@/lib/supabase";
import ProduceCard from "@/components/marketplace/ProduceCard";

interface ProduceListProps {
  produces: Produce[];
  isLoading: boolean;
  searchQuery: string;
  locationFilter: string;
}

const ProduceList: React.FC<ProduceListProps> = ({ 
  produces, 
  isLoading, 
  searchQuery,
  locationFilter 
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-organic-500"></div>
      </div>
    );
  }

  if (produces.length === 0) {
    return (
      <div className="text-center py-12 bg-organic-50 rounded-lg border border-organic-100">
        <h3 className="text-xl font-semibold text-organic-800 mb-2">No produce found</h3>
        <p className="text-organic-600">
          {searchQuery || locationFilter
            ? "Try adjusting your search or filter criteria."
            : "There are no produce listings available right now."}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {produces.map((produce) => (
        <ProduceCard key={produce.id} produce={produce} />
      ))}
    </div>
  );
};

export default ProduceList;
