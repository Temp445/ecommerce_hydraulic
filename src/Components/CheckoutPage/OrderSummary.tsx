"use client";

import React from "react";
import { ShoppingCart, Plus, Minus, Trash2, PackageOpen } from "lucide-react";
import { CartItem } from "./Checkout";

const OrderSummary = ({
  cartItems,
  onIncrease,
  onDecrease,
  onRemove,
}: {
  cartItems: CartItem[];
  onIncrease: (id: string) => void;
  onDecrease: (id: string) => void;
  onRemove: (id: string) => void;
}) => {
  return (
    <section className="bg-white rounded-2xl p-5 h-fit">
      <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-gray-200">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-500 p-2.5 rounded-xl shadow-md">
            <ShoppingCart className="text-white w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl text-slate-900">Order Summary</h2>
            <p className="text-xs text-slate-500">
              {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
            </p>
          </div>
        </div>
      </div>

      {cartItems.length === 0 ? (
        <div className="text-center py-10">
          <div className="bg-slate-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
            <PackageOpen className="w-12 h-12 text-slate-400" />
          </div>
          <p className="text-slate-600 font-medium text-base mb-1">
            No items in cart
          </p>
          <p className="text-slate-400 text-sm">Start shopping to add items</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="space-y-3 max-h-[450px] overflow-y-auto pr-1 scrollbar-thin">
            {cartItems.map((it, idx) => {
              const id = it._id ?? idx.toString();
              const name =
                it.name ??
                (typeof it.productId === "object" ? it.productId.name : "Product");
              const img =
                it.image ??
                (typeof it.productId === "object" ? it.productId.thumbnail : "");
              const price =
                typeof it.price === "number"
                  ? it.price
                  : typeof it.productId === "object"
                  ? it.productId.discountPrice && it.productId.discountPrice > 0
                    ? it.productId.discountPrice
                    : it.productId.price ?? 0
                  : 0;
              const stock =
                typeof it.productId === "object" ? it.productId.stock ?? 0 : 0;

              if (stock <= 0) {
                return (
                  <div
                    key={id}
                    className="relative bg-red-50 rounded-xl p-3 hover:bg-slate-100 transition-all text-center text-red-400 "
                  >
                    <p className="font-medium text-sm">
                      {name} is out of stock. <br />You cannot buy it now. Check later.
                    </p>
                  </div>
                );
              }

              return (
                <div
                  key={id}
                  className="relative bg-slate-50 rounded-xl p-3 hover:bg-slate-100 transition-all group"
                >
                  <button
                    type="button"
                    onClick={() => onRemove(id)}
                    className="absolute top-2 right-2 text-slate-400 hover:text-red-500 hover:bg-white p-1.5 rounded-lg transition-all shadow-sm opacity-0 group-hover:opacity-100"
                    aria-label="Remove item"
                  >
                    <Trash2 size={14} />
                  </button>

                  <div className="flex gap-3">
                    {img ? (
                      <img
                        src={img}
                        alt={name}
                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg object-contain flex-shrink-0 shadow-sm"
                      />
                    ) : (
                      <div className="w-20 h-20 sm:w-24 sm:h-24 bg-slate-200 rounded-lg flex-shrink-0 flex items-center justify-center">
                        <PackageOpen className="w-10 h-10 text-slate-400" />
                      </div>
                    )}

                    <div className="flex-1 min-w-0 pr-6">
                      <h3 className=" text-sm sm:text-base text-slate-900 mb-1 line-clamp-2 pr-2">
                        {name}
                      </h3>

                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-emerald-600 font-sans font-medium text-base sm:text-lg">
                          ₹{price.toLocaleString()}
                        </span>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center bg-white rounded-lg shadow-sm border border-slate-200">
                          <button
                            type="button"
                            onClick={() => onDecrease(id)}
                            disabled={it.quantity <= 1}
                            className="p-2 text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors rounded-l-lg"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={14} />
                          </button>

                          <span className="px-4 py-1.5 font-bold text-slate-800 text-sm min-w-[2.5rem] text-center border-x border-slate-200">
                            {it.quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() => onIncrease(id)}
                            disabled={it.quantity >= stock}
                            className="p-2 text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors rounded-r-lg"
                            aria-label="Increase quantity"
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        <div className="text-right">
                          <p className="text-xs text-slate-500 mb-0.5">Subtotal</p>
                          <p className="font-medium text-slate-900 text-sm font-sans sm:text-base">
                            ₹{(price * it.quantity).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}

export default OrderSummary;