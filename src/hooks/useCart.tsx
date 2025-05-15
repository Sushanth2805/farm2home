
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "./useAuth";
import { toast } from "sonner";
import { Produce, CartItem } from "@/lib/supabase";
import { useCartActions } from "./useCartActions";
import { useCartOrder } from "./useCartOrder";

interface CartContextType {
  cartItems: CartItem[];
  cartCount: number;
  isLoading: boolean;
  totalPrice: number;
  addToCart: (produce: Produce, quantity: number) => Promise<void>;
  removeFromCart: (cartItemId: number) => Promise<void>;
  updateQuantity: (cartItemId: number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  placeOrder: () => Promise<boolean>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user, isLoggedIn } = useAuth();
  
  // Calculate cart count and total price
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = cartItems.reduce((total, item) => {
    return total + ((item.produce?.price || 0) * item.quantity);
  }, 0);

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
      
      toast("Cart cleared", {
        description: "Your cart has been cleared",
      });
    } catch (error) {
      console.error("Error clearing cart:", error);
      toast("Error", {
        description: "Failed to clear your cart",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Import cart action hooks
  const cartActions = useCartActions(cartItems, setCartItems);
  const cartOrder = useCartOrder(cartItems, clearCart);

  // Combine loading states
  const isLoadingCombined = isLoading || cartActions.isLoading || cartOrder.isLoading;

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
        toast("Error", {
          description: "Failed to load your cart",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCartItems();
  }, [isLoggedIn, user]);

  return (
    <CartContext.Provider value={{
      cartItems,
      cartCount,
      isLoading: isLoadingCombined,
      totalPrice,
      addToCart: cartActions.addToCart,
      removeFromCart: cartActions.removeFromCart,
      updateQuantity: cartActions.updateQuantity,
      clearCart,
      placeOrder: cartOrder.placeOrder,
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
