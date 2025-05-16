
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Order } from "@/lib/supabase";

interface OrdersSectionProps {
  orders: Order[];
  isLoading: boolean;
  userRole: string;
}

const OrdersSection: React.FC<OrdersSectionProps> = ({ 
  orders, 
  isLoading, 
  userRole 
}) => {
  // Helper function to display customer ID
  const displayCustomerId = (order: Order) => {
    return order.consumer_id || "Unknown";
  };

  return (
    <>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-organic-900">
          {userRole === "farmer" ? "Orders for My Produce" : "My Orders"}
        </h2>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-organic-500"></div>
        </div>
      ) : orders.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No orders yet</CardTitle>
            <CardDescription>
              {userRole === "farmer"
                ? "You haven't received any orders for your produce yet."
                : "You haven't placed any orders yet."}
            </CardDescription>
          </CardHeader>
          {userRole === "consumer" && (
            <CardContent>
              <Button
                className="bg-organic-500 hover:bg-organic-600"
                onClick={() => window.location.href = "/browse"}
              >
                Browse Produce
              </Button>
            </CardContent>
          )}
        </Card>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-organic-100">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                {userRole === "farmer" && <TableHead>Customer</TableHead>}
                <TableHead>Produce</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Total Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  {userRole === "farmer" && (
                    <TableCell>
                      {displayCustomerId(order)}
                    </TableCell>
                  )}
                  <TableCell>
                    {order.produce?.name || "Unknown"}
                  </TableCell>
                  <TableCell>{order.quantity}</TableCell>
                  <TableCell>${order.total_price.toFixed(2)}</TableCell>
                  <TableCell>
                    <span className="capitalize px-2 py-1 bg-organic-100 text-organic-800 rounded-full text-xs">
                      {order.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    {new Date(order.created_at).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </>
  );
};

export default OrdersSection;
