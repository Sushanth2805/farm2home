
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "./useAuth";
import { useToast } from "./use-toast";
import { Produce, CartItem } from "@/lib/supabase";

interface CartContextType {
  cartItems: CartItem[];
  cartCount: number; // Add this property
  isLoading: boolean;
  addToCart: (produce: Produce, quantity: number) => Promise<void>;
  removeFromCart: (cartItemId: number) => Promise<void>;
  updateQuantity: (cartItemId: number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user, isLoggedIn } = useAuth();
  const { toast } = useToast();
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0); // Calculate cartCount

  // Load cart items when user logs in
  useEffect(() => {
    const loadCartItems = async () => {
      if (!isLoggedIn || !user) {
        setCartItems([]);
        return;
      }
      
      setIsLoading(true);
      
      try {
        const { data, error } = await supabase
          .from("cart")
          .select(`
            *,
            produce:produce_id(*)
          `)
          .eq("consumer_id", user.id);
          
        if (error) {
          throw error;
        }
        
        setCartItems(data as CartItem[]);
      } catch (error) {
        console.error("Error loading cart:", error);
        toast({
          title: "Error",
          description: "Failed to load your cart",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCartItems();
  }, [isLoggedIn, user]);

  // Add item to cart
  const addToCart = async (produce: Produce, quantity: number) => {
    if (!isLoggedIn || !user) {
      toast({
        title: "Not logged in",
        description: "Please log in to add items to your cart",
        variant: "destructive",
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
      
      toast({
        title: "Added to cart",
        description: `${quantity} × ${produce.name} added to your cart`,
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
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
      
      toast({
        title: "Item removed",
        description: "Item removed from your cart",
      });
    } catch (error) {
      console.error("Error removing from cart:", error);
      toast({
        title: "Error",
        description: "Failed to remove item from cart",
        variant: "destructive",
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
      
      toast({
        title: "Cart updated",
        description: "Item quantity updated",
      });
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast({
        title: "Error",
        description: "Failed to update item quantity",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Clear entire cart
  const clearCart = async () => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from("cart")
        .delete()
        .eq("consumer_id", user.id);
        
      if (error) throw error;
      
      setCartItems([]);
      
      toast({
        title: "Cart cleared",
        description: "Your cart has been cleared",
      });
    } catch (error) {
      console.error("Error clearing cart:", error);
      toast({
        title: "Error",
        description: "Failed to clear your cart",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      cartCount,
      isLoading,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
