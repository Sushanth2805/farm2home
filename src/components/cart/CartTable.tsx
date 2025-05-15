
import React from "react";
import { CartItem } from "@/lib/supabase";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import CartItemRow from "./CartItemRow";

interface CartTableProps {
  cartItems: CartItem[];
  onIncrementQuantity: (cartItemId: number, currentQuantity: number) => void;
  onDecrementQuantity: (cartItemId: number, currentQuantity: number) => void;
  onRemoveItem: (cartItemId: number) => void;
}

const CartTable: React.FC<CartTableProps> = ({
  cartItems,
  onIncrementQuantity,
  onDecrementQuantity,
  onRemoveItem,
}) => {
  return (
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
            <CartItemRow
              key={item.id}
              item={item}
              onIncrementQuantity={onIncrementQuantity}
              onDecrementQuantity={onDecrementQuantity}
              onRemoveItem={onRemoveItem}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CartTable;
