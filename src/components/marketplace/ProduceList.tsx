
import React from "react";
import { Produce } from "@/lib/supabase";
import ProduceCard from "@/components/marketplace/ProduceCard";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

interface ProduceListProps {
  produces: Produce[];
  isLoading: boolean;
  searchQuery: string;
  locationFilter: string;
  viewMode?: "grid" | "list";
}

const ProduceList: React.FC<ProduceListProps> = ({ 
  produces, 
  isLoading, 
  searchQuery,
  locationFilter,
  viewMode = "grid"
}) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  // Show loading animation when refreshing data
  if (isLoading && produces.length > 0) {
    return (
      <div className="flex justify-center py-8">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-3 text-organic-500" />
          <p className="text-organic-600">Updating listings...</p>
        </div>
      </div>
    );
  }
  
  // Show initial loading state when there's no data yet
  if (isLoading && produces.length === 0) {
    return (
      <div className="flex justify-center py-12">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4 text-organic-500" />
          <p className="text-organic-600 text-lg">Loading produce...</p>
        </div>
      </div>
    );
  }

  // Show empty state when no results match the filters
  if (!isLoading && produces.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <h3 className="text-xl font-medium text-organic-800 mb-2">No produce found</h3>
        {searchQuery && (
          <p className="text-organic-600 mb-1">No results for "{searchQuery}"</p>
        )}
        {locationFilter && locationFilter !== 'all' && (
          <p className="text-organic-600 mb-1">No produce available in {locationFilter}</p>
        )}
        <p className="text-organic-600">Try adjusting your search or filter criteria</p>
      </div>
    );
  }

  // If we have produces, show them in the selected view mode
  return (
    <motion.div 
      key={`produce-list-${searchQuery}-${locationFilter}`}
      variants={container}
      initial="hidden"
      animate="show"
      className={viewMode === "grid" 
        ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
        : "flex flex-col gap-4"
      }
    >
      {produces.map((produce) => (
        <motion.div key={produce.id} variants={item}>
          <ProduceCard produce={produce} displayMode={viewMode} />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ProduceList;
