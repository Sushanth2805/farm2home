
import React from "react";
import { Link } from "react-router-dom";
import { Produce } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";
import { ShoppingCart, MapPin, Star, Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface ProduceCardProps {
  produce: Produce;
  displayMode?: "grid" | "list";
}

const ProduceCard: React.FC<ProduceCardProps> = ({ produce, displayMode = "grid" }) => {
  const { isLoggedIn } = useAuth();
  const { addToCart, isLoading: isCartLoading } = useCart();

  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      toast("Please log in", {
        description: "You need to be logged in to add items to your cart",
      });
      return;
    }

    await addToCart(produce, 1);
  };

  // Grid view (default)
  if (displayMode === "grid") {
    return (
      <Card className="organic-card flex flex-col h-full hover:shadow-md transition-all duration-300">
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
        
        <CardContent className="p-4 flex-grow flex flex-col">
          <div className="flex-grow">
            <h3 className="text-lg font-semibold text-organic-900 mb-1">{produce.name}</h3>
            <div className="flex items-center text-organic-700 text-sm mb-2">
              <span>by {produce.farmer?.full_name || "Unknown Farmer"}</span>
              {produce.farmer?.rating && (
                <div className="ml-2 flex items-center">
                  <span className="bg-yellow-100 text-yellow-800 text-xs px-1.5 py-0.5 rounded-full flex items-center">
                    <Star className="h-3 w-3 mr-1 text-yellow-600" />
                    {produce.farmer.rating}
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
          
          <div className="flex justify-between items-center mt-4">
            <p className="text-organic-900 font-bold">
              ₹{produce.price.toFixed(2)}
            </p>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="text-organic-600 border-organic-300 hover:bg-organic-50"
                onClick={handleAddToCart}
                disabled={isCartLoading}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // List view
  return (
    <Card className="organic-card hover:shadow-md transition-all duration-300">
      <div className="flex flex-col sm:flex-row">
        <div className="sm:w-48 h-48 bg-organic-100">
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
        
        <CardContent className="p-4 flex-grow flex flex-col">
          <div className="flex flex-col sm:flex-row justify-between">
            <div>
              <h3 className="text-xl font-semibold text-organic-900 mb-1">{produce.name}</h3>
              <div className="flex items-center text-organic-700 text-sm mb-2">
                <span>by {produce.farmer?.full_name || "Unknown Farmer"}</span>
                {produce.farmer?.rating && (
                  <div className="ml-2 flex items-center">
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-1.5 py-0.5 rounded-full flex items-center">
                      <Star className="h-3 w-3 mr-1 text-yellow-600" />
                      {produce.farmer.rating}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <p className="text-organic-900 font-bold text-lg">
              ₹{produce.price.toFixed(2)}
            </p>
          </div>
          
          <p className="text-organic-600 mb-3">
            {produce.description}
          </p>
          
          {produce.location && (
            <div className="flex items-center text-organic-600 text-sm mb-3">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{produce.location}</span>
            </div>
          )}
          
          <div className="flex justify-end mt-auto">
            <Button
              variant="outline"
              className="text-organic-600 border-organic-300 hover:bg-organic-50 mr-2"
              size="sm"
            >
              <Info className="h-4 w-4 mr-2" />
              Details
            </Button>
            
            <Button
              variant="default"
              className="bg-organic-500 hover:bg-organic-600"
              size="sm"
              onClick={handleAddToCart}
              disabled={isCartLoading}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

export default ProduceCard;
