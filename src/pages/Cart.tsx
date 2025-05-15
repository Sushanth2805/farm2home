
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import { toast } from "@/components/ui/sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Minus, Plus, Trash2 } from "lucide-react";
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
      toast({
        title: "Checkout failed",
        description: "There was a problem processing your order",
        variant: "destructive",
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
                <Card>
                  <CardHeader>
                    <CardTitle>Your cart is empty</CardTitle>
                    <CardDescription>
                      Browse our selection of fresh organic produce and start adding items to your cart.
                    </CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Button
                      className="bg-organic-500 hover:bg-organic-600"
                      onClick={() => navigate("/browse")}
                    >
                      Browse Produce
                    </Button>
                  </CardFooter>
                </Card>
              ) : (
                <>
                  <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Product</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead>Subtotal</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {cartItems.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">
                              <div className="flex items-center">
                                {item.produce?.image_url && (
                                  <div className="w-12 h-12 mr-3 rounded overflow-hidden">
                                    <img
                                      src={item.produce.image_url}
                                      alt={item.produce?.name}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                )}
                                <div>
                                  <p className="font-semibold">{item.produce?.name}</p>
                                  <p className="text-sm text-organic-600">
                                    from {item.produce?.farmer?.full_name || "Unknown Farmer"}
                                  </p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>${item.produce?.price.toFixed(2)}</TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  onClick={() => handleDecrementQuantity(item.id, item.quantity)}
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span>{item.quantity}</span>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  onClick={() => handleIncrementQuantity(item.id, item.quantity)}
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                            </TableCell>
                            <TableCell className="font-semibold">
                              ${((item.produce?.price || 0) * item.quantity).toFixed(2)}
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-organic-700 hover:text-red-600"
                                onClick={() => removeFromCart(item.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  <div className="bg-white shadow rounded-lg p-6">
                    <div className="flex justify-between items-center mb-4 text-lg">
                      <span className="font-semibold">Total:</span>
                      <span className="font-bold text-xl">${totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-end">
                      <Button className="bg-organic-500 hover:bg-organic-600" onClick={handleCheckout}>
                        Place Order
                      </Button>
                    </div>
                  </div>
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
