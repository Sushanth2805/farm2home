
import React from "react";
import { Produce } from "@/lib/supabase";
import ProduceCard from "@/components/marketplace/ProduceCard";
import { motion } from "framer-motion";

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
    <motion.div 
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
