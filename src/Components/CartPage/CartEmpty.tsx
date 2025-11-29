"use client";

import Link from "next/link";
import Image from "next/image";
import Shopping from "@/assets/Shopping.png";

const CartEmpty = ({ isLoggedIn }: any) => {
  return (
  <div className=" bg-slate-50 flex items-center justify-center px-4 py-12">
        <div className="text-center max-w-md">
          <div className=" rounded-full flex items-center justify-center mx-auto mb-6">
            <Image src={Shopping} alt="cart" className="w-52 h-52"></Image>
          </div>

          {isLoggedIn ? (
            <>
              <h2 className="text-3xl font-bold text-slate-800 mb-3">
                Your cart is empty
              </h2>

              <p className="text-slate-600 mb-8">
                Nothing here yet — start exploring our products!
              </p>
              <Link
                href="/"
                className="inline-block px-8 py-3 bg-gray-900 text-white rounded font-medium hover:bg-gray-950 transition-colors"
              >
                Continue Shopping
              </Link>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center  px-6 text-center">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">
                Can’t see your cart items?
              </h2>

              <p className="text-gray-600 max-w-md mb-8">
                Log in to retrieve the products you added earlier and continue
                shopping seamlessly.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/login"
                  className="px-8 py-3 bg-emerald-600 text-white rounded font-semibold transition-colors shadow-sm"
                >
                  Login
                </Link>

                <Link
                  href="/"
                  className="px-8 py-3 border border-gray-900 text-gray-900 rounded font-semibold hover:bg-indigo-50 transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
  );
};

export default CartEmpty;
