
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

  // If we have produces, show them in the selected view mode
  if (produces.length > 0) {
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
  }

  // Return null for empty state - we'll show a message in the parent component
  return null;
};

export default ProduceList;
