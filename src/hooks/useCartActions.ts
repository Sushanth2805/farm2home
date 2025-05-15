
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { CartItem, Produce } from "@/lib/supabase";
import { toast } from "sonner";
import { useAuth } from "./useAuth";

export const useCartActions = (
  cartItems: CartItem[], 
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>
) => {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  // Add item to cart
  const addToCart = async (produce: Produce, quantity: number) => {
    if (!user) {
      toast("Not logged in", {
        description: "Please log in to add items to your cart"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Check if item already in cart
      const existingItem = cartItems.find(item => item.produce_id === produce.id);
      
      if (existingItem) {
        // Update quantity
        const newQuantity = existingItem.quantity + quantity;
        
        const { error } = await supabase
          .from("cart")
          .update({ quantity: newQuantity })
          .eq("id", existingItem.id);
          
        if (error) throw error;
        
        setCartItems(prevItems => 
          prevItems.map(item => 
            item.id === existingItem.id 
              ? { ...item, quantity: newQuantity } 
              : item
          )
        );
      } else {
        // Add new item
        const { data, error } = await supabase
          .from("cart")
          .insert({
            consumer_id: user.id,
            produce_id: produce.id,
            quantity,
            created_at: new Date().toISOString(),
          })
          .select(`
            *,
            produce:produce_id(*)
          `)
          .single();
          
        if (error) throw error;
        
        setCartItems(prevItems => [...prevItems, data as CartItem]);
      }
      
      toast("Added to cart", {
        description: `${quantity} × ${produce.name} added to your cart`,
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast("Error", {
        description: "Failed to add item to cart",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Remove item from cart
  const removeFromCart = async (cartItemId: number) => {
    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from("cart")
        .delete()
        .eq("id", cartItemId);
        
      if (error) throw error;
      
      setCartItems(prevItems => prevItems.filter(item => item.id !== cartItemId));
      
      toast("Item removed", {
        description: "Item removed from your cart",
      });
    } catch (error) {
      console.error("Error removing from cart:", error);
      toast("Error", {
        description: "Failed to remove item from cart",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Update quantity of cart item
  const updateQuantity = async (cartItemId: number, quantity: number) => {
    if (quantity < 1) {
      await removeFromCart(cartItemId);
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from("cart")
        .update({ quantity })
        .eq("id", cartItemId);
        
      if (error) throw error;
      
      setCartItems(prevItems => 
        prevItems.map(item => 
          item.id === cartItemId ? { ...item, quantity } : item
        )
      );
      
      toast("Cart updated", {
        description: "Item quantity updated",
      });
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast("Error", {
        description: "Failed to update item quantity",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    addToCart,
    removeFromCart,
    updateQuantity,
    isLoading,
  };
};
