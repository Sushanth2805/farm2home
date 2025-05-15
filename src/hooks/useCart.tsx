
import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase, CartItem, Produce } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface CartContextType {
  cartItems: CartItem[];
  totalPrice: number;
  isLoading: boolean;
  addToCart: (produceId: number, quantity?: number) => Promise<void>;
  updateQuantity: (cartItemId: number, quantity: number) => Promise<void>;
  removeFromCart: (cartItemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  placeOrder: () => Promise<boolean>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isLoggedIn } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Load cart items when user logs in
  useEffect(() => {
    const fetchCartItems = async () => {
      if (!isLoggedIn || !user) {
        setCartItems([]);
        setTotalPrice(0);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("cart")
          .select(`
            *,
            produce:produce_id(*, farmer:farmer_id(*))
          `)
          .eq("consumer_id", user.id);

        if (error) throw error;
        
        const typedCartItems = data as unknown as CartItem[];
        setCartItems(typedCartItems);
        
        // Calculate total price
        const total = typedCartItems.reduce((sum, item) => {
          return sum + ((item.produce?.price || 0) * item.quantity);
        }, 0);
        
        setTotalPrice(total);
      } catch (error) {
        console.error("Error fetching cart:", error);
        toast({
          title: "Error",
          description: "Failed to load your cart",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCartItems();
  }, [user, isLoggedIn]);

  // Add item to cart
  const addToCart = async (produceId: number, quantity = 1) => {
    if (!isLoggedIn || !user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to add items to your cart",
      });
      navigate("/login");
      return;
    }

    setIsLoading(true);
    try {
      // Check if item is already in cart
      const existingItemIndex = cartItems.findIndex(
        (item) => item.produce_id === produceId
      );

      if (existingItemIndex >= 0) {
        // Update quantity if already in cart
        const newQuantity = cartItems[existingItemIndex].quantity + quantity;
        await updateQuantity(cartItems[existingItemIndex].id, newQuantity);
      } else {
        // Add new item to cart
        const { data, error } = await supabase.from("cart").insert({
          consumer_id: user.id,
          produce_id: produceId,
          quantity,
        }).select(`
          *,
          produce:produce_id(*, farmer:farmer_id(*))
        `);

        if (error) throw error;

        const newItem = data?.[0] as unknown as CartItem;
        setCartItems([...cartItems, newItem]);
        
        // Update total price
        setTotalPrice(totalPrice + ((newItem.produce?.price || 0) * quantity));
        
        toast({
          title: "Added to cart",
          description: "Item has been added to your cart",
        });
      }
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

  // Update item quantity
  const updateQuantity = async (cartItemId: number, quantity: number) => {
    if (quantity < 1) {
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("cart")
        .update({ quantity })
        .eq("id", cartItemId);

      if (error) throw error;

      // Update local state
      const updatedItems = cartItems.map((item) => {
        if (item.id === cartItemId) {
          return { ...item, quantity };
        }
        return item;
      });

      setCartItems(updatedItems);
      
      // Recalculate total price
      const total = updatedItems.reduce((sum, item) => {
        return sum + ((item.produce?.price || 0) * item.quantity);
      }, 0);
      
      setTotalPrice(total);
    } catch (error) {
      console.error("Error updating cart:", error);
      toast({
        title: "Error",
        description: "Failed to update cart",
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

      // Find the item to remove for price calculation
      const itemToRemove = cartItems.find(item => item.id === cartItemId);
      const itemPrice = itemToRemove 
        ? (itemToRemove.produce?.price || 0) * itemToRemove.quantity 
        : 0;

      // Update local state
      const updatedItems = cartItems.filter((item) => item.id !== cartItemId);
      setCartItems(updatedItems);
      setTotalPrice(totalPrice - itemPrice);
      
      toast({
        title: "Item removed",
        description: "Item has been removed from your cart",
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

      // Update local state
      setCartItems([]);
      setTotalPrice(0);
      
      toast({
        title: "Cart cleared",
        description: "All items have been removed from your cart",
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

  // Place order
  const placeOrder = async (): Promise<boolean> => {
    if (!user || cartItems.length === 0) {
      toast({
        title: "Cannot place order",
        description: "Your cart is empty or you're not logged in",
        variant: "destructive",
      });
      return false;
    }

    setIsLoading(true);
    try {
      // Create orders for each item in cart
      const orderPromises = cartItems.map(async (item) => {
        return supabase.from("orders").insert({
          buyer_id: user.id,
          consumer_id: user.id, // For backward compatibility
          produce_id: item.produce_id,
          quantity: item.quantity,
          total_price: (item.produce?.price || 0) * item.quantity,
          status: "pending",
        });
      });

      const results = await Promise.all(orderPromises);
      const errors = results.filter((result) => result.error);

      if (errors.length > 0) {
        throw new Error(`${errors.length} orders failed to process`);
      }

      // Clear cart after successful order
      await clearCart();
      
      toast({
        title: "Order placed",
        description: "Your order has been placed successfully!",
      });
      
      return true;
    } catch (error) {
      console.error("Error placing order:", error);
      toast({
        title: "Error",
        description: "Failed to place your order",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalPrice,
        isLoading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        placeOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
