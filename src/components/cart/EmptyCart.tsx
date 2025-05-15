
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const EmptyCart: React.FC = () => {
  const navigate = useNavigate();
  
  return (
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
  );
};

export default EmptyCart;
