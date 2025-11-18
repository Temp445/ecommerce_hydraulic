"use client";

import React, { useState } from "react";
import { User, CheckCircle, Mail, UserCircle } from "lucide-react";
import CheckoutLogin from "./CheckoutLogin";
import CheckoutRegister from "./CheckoutRegister";

const CheckoutAuth = ({ user }: { user: any }) => {
  const [showRegister, setShowRegister] = useState(false);

  return (
    <section className="w-full p-4">
      {user ? (
        <div className=" rounded-2xl md:p-6 text-gray-900">
          <div className="flex items-start gap-4">
            <div className="bg-emerald-500 text-white  p-3 rounded-xl">
              <CheckCircle className=" w-5 h-5 md:w-6 md:h-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg md:text-xl font-medium mb-1">Login Detail</h3>
              <p className=" text-sm mb-4">You're all set to continue</p>
              
              <div className="shadow rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <UserCircle className="w-5 h-5" />
                  <div>
                    <p className="text-xs">Full Name</p>
                    <p className="font-medium">
                      {user?.firstName}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5" />
                  <div>
                    <p className="text-xs">Email Address</p>
                    <p className="font-medium">{user.email}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setShowRegister(false)}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                !showRegister
                  ? "bg-gray-900 text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setShowRegister(true)}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                showRegister
                  ? "bg-gray-900 text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Register
            </button>
          </div>

          <div className="bg-white rounded-xl">
            {showRegister ? (
              <CheckoutRegister setShowRegister={setShowRegister} />
            ) : (
              <CheckoutLogin setShowRegister={setShowRegister} />
            )}
          </div>

        </div>
      )}
    </section>
  );
}
export default CheckoutAuth;