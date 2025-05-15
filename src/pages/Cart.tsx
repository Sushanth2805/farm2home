
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Layout from "@/components/layout/Layout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useCart } from "@/hooks/useCart";
import EmptyCart from "@/components/cart/EmptyCart";
import CartTable from "@/components/cart/CartTable";
import CartSummary from "@/components/cart/CartSummary";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { cartItems, totalPrice, isLoading, updateQuantity, removeFromCart, placeOrder } = useCart();
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleDecrementQuantity = (cartItemId: number, currentQuantity: number) => {
    if (currentQuantity > 1) {
      updateQuantity(cartItemId, currentQuantity - 1);
    }
  };

  const handleIncrementQuantity = (cartItemId: number, currentQuantity: number) => {
    updateQuantity(cartItemId, currentQuantity + 1);
  };

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    try {
      const success = await placeOrder();
      if (success) {
        // Pass orderId to the confirmation page
        navigate('/order-confirmation', { 
          state: { orderId: Math.floor(Math.random() * 10000) + 1000 } 
        });
      }
    } catch (error) {
      console.error("Error during checkout:", error);
      toast("Checkout failed", {
        description: "There was a problem processing your order"
      });
    } finally {
      setIsCheckingOut(false);
    }
  };

  const confirmOrder = async () => {
    setIsOrderDialogOpen(false);
    const success = await placeOrder();
    if (success) {
      setIsConfirmationOpen(true);
    }
  };

  return (
    <ProtectedRoute requiredRole="consumer">
      <Layout>
        <section className="py-12">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-3xl font-bold text-organic-900 mb-8">Your Cart</h1>

              {isLoading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-organic-500"></div>
                </div>
              ) : cartItems.length === 0 ? (
                <EmptyCart />
              ) : (
                <>
                  <CartTable
                    cartItems={cartItems}
                    onIncrementQuantity={handleIncrementQuantity}
                    onDecrementQuantity={handleDecrementQuantity}
                    onRemoveItem={removeFromCart}
                  />

                  <CartSummary
                    totalPrice={totalPrice}
                    onCheckout={handleCheckout}
                    isCheckingOut={isCheckingOut}
                  />
                </>
              )}
            </div>
          </div>
        </section>

        {/* Order Confirmation Dialog */}
        <AlertDialog open={isOrderDialogOpen} onOpenChange={setIsOrderDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Place your order</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to place this order for ${totalPrice.toFixed(2)}?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction className="bg-organic-500 hover:bg-organic-600" onClick={confirmOrder}>
                Confirm Order
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Order Success Dialog */}
        <AlertDialog open={isConfirmationOpen} onOpenChange={setIsConfirmationOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Order Placed Successfully!</AlertDialogTitle>
              <AlertDialogDescription>
                Thank you for your order! The farmers have been notified and will process your order soon.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction
                className="bg-organic-500 hover:bg-organic-600 w-full"
                onClick={() => {
                  setIsConfirmationOpen(false);
                  navigate("/profile");
                }}
              >
                View My Orders
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </Layout>
    </ProtectedRoute>
  );
};

export default Cart;
