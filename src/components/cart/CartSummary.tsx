
import React from "react";
import { Button } from "@/components/ui/button";

interface CartSummaryProps {
  totalPrice: number;
  onCheckout: () => void;
  isCheckingOut: boolean;
}

const CartSummary: React.FC<CartSummaryProps> = ({
  totalPrice,
  onCheckout,
  isCheckingOut,
}) => {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-4 text-lg">
        <span className="font-semibold">Total:</span>
        <span className="font-bold text-xl">${totalPrice.toFixed(2)}</span>
      </div>
      <div className="flex justify-end">
        <Button 
          className="bg-organic-500 hover:bg-organic-600" 
          onClick={onCheckout}
          disabled={isCheckingOut}
        >
          {isCheckingOut ? "Processing..." : "Place Order"}
        </Button>
      </div>
    </div>
  );
};

export default CartSummary;
