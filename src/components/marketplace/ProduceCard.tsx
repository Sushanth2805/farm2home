
import React from "react";
import { Link } from "react-router-dom";
import { Produce } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart } from "lucide-react";

interface ProduceCardProps {
  produce: Produce;
}

const ProduceCard: React.FC<ProduceCardProps> = ({ produce }) => {
  const { isLoggedIn, userRole } = useAuth();
  const { addToCart, isLoading: isCartLoading } = useCart();
  const { toast } = useToast();

  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to add items to your cart",
      });
      return;
    }

    if (userRole !== "consumer") {
      toast({
        title: "Action not allowed",
        description: "Only consumers can add items to cart",
        variant: "destructive",
      });
      return;
    }

    await addToCart(produce.id);
  };

  return (
    <div className="organic-card flex flex-col h-full">
      <div className="relative h-48 bg-organic-100">
        {produce.image_url ? (
          <img
            src={produce.image_url}
            alt={produce.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-organic-200">
            <span className="text-organic-500">No image available</span>
          </div>
        )}
      </div>
      
      <div className="p-4 flex-grow flex flex-col">
        <div className="flex-grow">
          <h3 className="text-lg font-semibold text-organic-900 mb-1">{produce.name}</h3>
          <p className="text-organic-700 text-sm mb-2">
            by {produce.farmer?.full_name || "Unknown Farmer"}
          </p>
          <p className="text-organic-600 text-sm mb-4 line-clamp-2">
            {produce.description}
          </p>
        </div>
        
        <div className="flex justify-between items-center mt-auto">
          <p className="text-organic-900 font-bold">
            ${produce.price.toFixed(2)}
          </p>
          
          {isLoggedIn && userRole === "consumer" && (
            <Button
              variant="outline"
              className="text-organic-600 border-organic-300 hover:bg-organic-50"
              onClick={handleAddToCart}
              disabled={isCartLoading}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProduceCard;
