"use client";
import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import AddToCartButton from "../Button/AddToCartButton";

type ProductQuantityProps = {
    stock : number,
    product: any
}

export default function ProductQuantity({ stock, product }:ProductQuantityProps) {
  const [quantity, setQuantity] = useState(1);

  return (
    <div>
        <div className="mb-8">
                <label className="text-xs uppercase tracking-widest text-neutral-800 mb-3 block">
                  Quantity
                </label>
                <div className="flex items-center rounded border border-neutral-300 w-fit">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 flex items-center justify-center hover:bg-neutral-100 transition-colors disabled:opacity-30"
                    disabled={quantity <= 1}
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-16 h-12 flex items-center justify-center text-sm font-medium border-x border-neutral-300">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-12 h-12 flex items-center justify-center hover:bg-neutral-100 transition-colors disabled:opacity-30"
                    disabled={quantity >= stock}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div> 
              <AddToCartButton
                product={product}
                quantity={quantity}
                disabled={stock <= 0}
                className="text-white bg-gray-900 hover:bg-gray-950 transition disabled:opacity-50"
              />
    </div>
  );
}
