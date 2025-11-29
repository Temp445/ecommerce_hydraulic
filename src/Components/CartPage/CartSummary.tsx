"use client";

import { Lock } from "lucide-react";
import { useRouter } from "next/navigation";

const CartSummary = ({
  itemCount,
  totalAmount,
  totalDeliveryCharge,
  totalPriceSave,
  inStockItems
  
}: any) => {
    const router = useRouter()
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sticky top-6">
            <h2 className="text-xl font-bold text-slate-800 mb-6">
              Order Summary
            </h2>

            <div className="space-y-3 mb-6 pb-6 border-b border-slate-200">
              <div className="flex justify-between text-slate-800">
                <span>Price ({itemCount} items)</span>
                <span className="font-semibold font-sans">
                  ₹{(totalAmount + totalPriceSave).toLocaleString()}
                </span>
              </div>

              {totalPriceSave > 0 && (
                <div className="flex justify-between text-slate-800 font-sans">
                  <span>Discount</span>
                  <span className="text-neutral-600">
                    -₹{totalPriceSave.toLocaleString()}
                  </span>
                </div>
              )}

              <div className="flex justify-between text-slate-800">
                <span>Delivery</span>
                <span className="text-emerald-600 font-sans">
                  {totalDeliveryCharge > 0 ? (
                    <span> ₹ {totalDeliveryCharge.toLocaleString()} </span>
                  ) : (
                    "Free"
                  )}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center mb-6 pb-6 border-b border-slate-200">
              <span className="text-lg font-bold text-slate-800">Total</span>
              <span className="text-xl font-semibold font-sans">
                ₹{(totalAmount + totalDeliveryCharge || 0).toLocaleString()}
              </span>
            </div>

            {totalPriceSave > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 text-center text-green-800 font-medium font-sans">
                You're saving ₹{totalPriceSave.toLocaleString()} on this order!
              </div>
            )}
            <button
              onClick={() => router.push("/checkout")}   
              disabled={inStockItems.length === 0}
              className={`w-full py-4 rounded-lg font-semibold shadow transition-all ${
                inStockItems.length === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-emerald-700 hover:bg-emerald-800 text-white hover:cursor-pointer"
              }`}
            >
              Proceed to Checkout
            </button>

            <div className="flex items-center justify-center gap-2 text-sm text-slate-500 mt-3">
              <Lock size={14} />
              <span>Secure checkout</span>
            </div>
          </div>
  );
};

export default CartSummary;
