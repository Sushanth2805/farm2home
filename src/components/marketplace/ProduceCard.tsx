
import React from "react";
import { Link } from "react-router-dom";
import { Produce } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart, MapPin } from "lucide-react";

interface ProduceCardProps {
  produce: Produce;
}

const ProduceCard: React.FC<ProduceCardProps> = ({ produce }) => {
  const { isLoggedIn } = useAuth();
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

    await addToCart(produce, 1); // Fixed to pass both produce and quantity
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
          <div className="flex items-center text-organic-700 text-sm mb-2">
            <span>by {produce.farmer?.full_name || "Unknown Farmer"}</span>
            {produce.farmer?.rating && (
              <div className="ml-2 flex items-center">
                <span className="bg-yellow-100 text-yellow-800 text-xs px-1.5 py-0.5 rounded-full">
                  ★ {produce.farmer.rating}
                </span>
              </div>
            )}
          </div>
          <p className="text-organic-600 text-sm mb-2 line-clamp-2">
            {produce.description}
          </p>
          {produce.location && (
            <div className="flex items-center text-organic-600 text-xs mb-2">
              <MapPin className="h-3 w-3 mr-1" />
              <span>{produce.location}</span>
            </div>
          )}
        </div>
        
        <div className="flex justify-between items-center mt-auto">
          <p className="text-organic-900 font-bold">
            ₹{produce.price.toFixed(2)}
          </p>
          
          {isLoggedIn && (
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
