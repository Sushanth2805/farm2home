
import React from "react";
import { Link, useLocation } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

const OrderConfirmation: React.FC = () => {
  const location = useLocation();
  const { orderId } = location.state || { orderId: null };

  return (
    <ProtectedRoute requiredRole="consumer">
      <Layout>
        <section className="py-12">
          <div className="container mx-auto px-6">
            <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8 border border-organic-100 text-center">
              <div className="flex justify-center mb-6">
                <div className="bg-organic-100 rounded-full p-3">
                  <CheckCircle className="h-12 w-12 text-organic-500" />
                </div>
              </div>
              
              <h1 className="text-3xl font-bold text-organic-900 mb-4">
                Order Confirmed!
              </h1>
              
              <p className="text-organic-700 mb-8">
                Thank you for your order{orderId ? ` #${orderId}` : ''}. 
                The farmers have been notified and will process your order shortly.
              </p>
              
              <div className="space-y-4">
                <Button className="w-full bg-organic-500 hover:bg-organic-600" asChild>
                  <Link to="/profile">View My Orders</Link>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/browse">Continue Shopping</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </ProtectedRoute>
  );
};

export default OrderConfirmation;
