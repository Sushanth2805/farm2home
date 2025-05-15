
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { CartItem } from "@/lib/supabase";
import { toast } from "sonner";
import { useAuth } from "./useAuth";

export const useCartOrder = (
  cartItems: CartItem[], 
  clearCart: () => Promise<void>
) => {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  // Add placeOrder function
  const placeOrder = async (): Promise<boolean> => {
    if (!user) return false;
    
    setIsLoading(true);
    
    try {
      console.log("Placing order with cart items:", cartItems);
      
      // Create orders for each item in the cart
      const orderPromises = cartItems.map(item => {
        return supabase
          .from("orders")
          .insert({
            consumer_id: user.id,
            produce_id: item.produce_id,
            quantity: item.quantity,
            total_price: (item.produce?.price || 0) * item.quantity,
            status: "pending",
            created_at: new Date().toISOString()
          });
      });
      
      // Wait for all orders to be created
      const results = await Promise.all(orderPromises);
      
      // Check if any errors occurred
      const hasErrors = results.some(result => result.error);
      
      if (hasErrors) {
        throw new Error("Failed to create one or more orders");
      }
      
      // Log success
      console.log("Orders created successfully");
      
      // Clear the cart after successful order placement
      await clearCart();
      
      toast("Order placed!", {
        description: "Your order has been placed successfully",
      });
      
      return true;
    } catch (error) {
      console.error("Error placing order:", error);
      toast("Error", {
        description: "Failed to place order",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    placeOrder,
    isLoading,
  };
};
