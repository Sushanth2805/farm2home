
import React from "react";
import { CartItem } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Minus, Plus, Trash2 } from "lucide-react";

interface CartItemRowProps {
  item: CartItem;
  onIncrementQuantity: (cartItemId: number, currentQuantity: number) => void;
  onDecrementQuantity: (cartItemId: number, currentQuantity: number) => void;
  onRemoveItem: (cartItemId: number) => void;
}

const CartItemRow: React.FC<CartItemRowProps> = ({
  item,
  onIncrementQuantity,
  onDecrementQuantity,
  onRemoveItem,
}) => {
  return (
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
            onClick={() => onDecrementQuantity(item.id, item.quantity)}
          >
            <Minus className="h-3 w-3" />
          </Button>
          <span>{item.quantity}</span>
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => onIncrementQuantity(item.id, item.quantity)}
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
          onClick={() => onRemoveItem(item.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default CartItemRow;
