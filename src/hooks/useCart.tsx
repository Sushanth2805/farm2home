
import { createContext, useContext, useState, useEffect } from "react";
import { supabase, CartItem, Produce } from "@/lib/supabase";
import { useAuth } from "./useAuth";
import { useToast } from "./use-toast";

interface CartContextType {
  cartItems: CartItem[];
  totalPrice: number;
  cartCount: number;
  isLoading: boolean;
  addToCart: (produceId: number, quantity?: number) => Promise<void>;
  removeFromCart: (cartItemId: number) => Promise<void>;
  updateQuantity: (cartItemId: number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
  placeOrder: () => Promise<boolean>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, user } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const totalPrice = cartItems.reduce((total, item) => {
    return total + (item.produce?.price || 0) * item.quantity;
  }, 0);
  
  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  // Fetch cart items when the user changes
  useEffect(() => {
    if (isLoggedIn && user) {
      fetchCartItems();
    } else {
      setCartItems([]);
    }
  }, [isLoggedIn, user]);

  const fetchCartItems = async () => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from("cart")
        .select(`
          *,
          produce:produce_id(*)
        `)
        .eq("user_id", user.id);
        
      if (error) throw error;
      
      setCartItems(data as unknown as CartItem[]);
    } catch (error) {
      console.error("Error fetching cart items:", error);
      toast({
        title: "Error",
        description: "Failed to load your cart",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = async (produceId: number, quantity = 1) => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      // Check if the item already exists in the cart
      const existingItem = cartItems.find(item => item.produce_id === produceId);
      
      if (existingItem) {
        // Update the quantity of the existing item
        await updateQuantity(existingItem.id, existingItem.quantity + quantity);
      } else {
        // Add a new item to the cart
        // Use type casting to handle column name mismatch
        const { error } = await supabase
          .from("cart")
          .insert({
            // Use consumer_id for the database, but we know it's user_id in our app
            consumer_id: user.id,
            produce_id: produceId,
            quantity: quantity,
            created_at: new Date().toISOString(),
          });
          
        if (error) throw error;
        
        // Fetch the produce details for the newly added item
        const { data: produceData, error: produceError } = await supabase
          .from("produce")
          .select("*")
          .eq("id", produceId)
          .single();
          
        if (produceError) throw produceError;
        
        // Add the new item to the local state
        setCartItems([
          ...cartItems,
          {
            id: Date.now(), // Temporary ID until we fetch the cart again
            user_id: user.id,
            produce_id: produceId,
            quantity: quantity,
            created_at: new Date().toISOString(),
            produce: produceData as Produce,
          },
        ]);
        
        toast({
          title: "Added to cart",
          description: `${produceData.name} has been added to your cart`,
        });
      }
    } catch (error: any) {
      console.error("Error adding to cart:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to add item to cart",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (cartItemId: number) => {
    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from("cart")
        .delete()
        .eq("id", cartItemId);
        
      if (error) throw error;
      
      // Update local state
      setCartItems(cartItems.filter(item => item.id !== cartItemId));
      
      toast({
        title: "Removed from cart",
        description: "Item has been removed from your cart",
      });
    } catch (error: any) {
      console.error("Error removing from cart:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to remove item from cart",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (cartItemId: number, quantity: number) => {
    if (quantity < 1) {
      return removeFromCart(cartItemId);
    }
    
    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from("cart")
        .update({ quantity })
        .eq("id", cartItemId);
        
      if (error) throw error;
      
      // Update local state
      setCartItems(
        cartItems.map(item =>
          item.id === cartItemId ? { ...item, quantity } : item
        )
      );
    } catch (error: any) {
      console.error("Error updating quantity:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update quantity",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async () => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      // Use consumer_id for database queries
      const { error } = await supabase
        .from("cart")
        .delete()
        .eq("consumer_id", user.id);
        
      if (error) throw error;
      
      // Clear local state
      setCartItems([]);
      
      toast({
        title: "Cart cleared",
        description: "All items have been removed from your cart",
      });
    } catch (error: any) {
      console.error("Error clearing cart:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to clear cart",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const refreshCart = async () => {
    await fetchCartItems();
  };

  const placeOrder = async (): Promise<boolean> => {
    if (!user || cartItems.length === 0) return false;
    
    setIsLoading(true);
    
    try {
      // Start a transaction by creating a batch of orders
      const orderPromises = cartItems.map(async (item) => {
        if (!item.produce) return;
        
        const { error } = await supabase.from("orders").insert({
          // Use consumer_id for database
          consumer_id: user.id,
          produce_id: item.produce_id,
          quantity: item.quantity,
          total_price: (item.produce.price || 0) * item.quantity,
          status: "pending",
          created_at: new Date().toISOString(),
        });
        
        if (error) throw error;
      });
      
      // Wait for all orders to be created
      await Promise.all(orderPromises);
      
      // Clear the cart after successful order creation
      await clearCart();
      
      toast({
        title: "Order placed",
        description: "Your order has been placed successfully",
      });
      
      return true;
    } catch (error: any) {
      console.error("Error placing order:", error);
      toast({
        title: "Order failed",
        description: error.message || "There was a problem placing your order",
        variant: "destructive",
      });
      
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    cartItems,
    totalPrice,
    cartCount,
    isLoading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    refreshCart,
    placeOrder,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
