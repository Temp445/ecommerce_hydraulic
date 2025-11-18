"use client";

import React, { useState } from "react";
import { Mail, Lock } from "lucide-react";

const CheckoutLogin = ({setShowRegister}: {
  setShowRegister: (v: boolean) => void;
}) => {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/user-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(
          data.error === "Invalid email or password"
            ? "Incorrect email or password. Please try again."
            : data.error || "Login failed. Please try again."
        );
        setLoading(false);
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.user._id);
      localStorage.setItem("role", data.user.role);
      localStorage.setItem("user", JSON.stringify(data.user));

      const guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
      if (guestCart.length > 0) {
        try {
          await fetch("/api/cart", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${data.token}`,
            },
            body: JSON.stringify({
              items: guestCart.map((i: any) => ({
                productId: i.product._id,
                quantity: i.quantity,
              })),
            }),
          });
          localStorage.removeItem("guestCart");
        } catch (err) {
          console.error("Cart merge error:", err);
        }
      }

      window.dispatchEvent(new Event("cartUpdated"));
      window.dispatchEvent(new Event("userLogin"));
      window.location.reload();
    } catch (err) {
      console.error("Login error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <p className="text-sm text-gray-600 mb-4">
        Sign in to continue with your order and access saved addresses.
      </p>

      {error && <p className="text-red-600 text-sm font-medium">{error}</p>}

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="email"
              value={loginData.email}
              onChange={(e) =>
                setLoginData({ ...loginData, email: e.target.value })
              }
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg"
              placeholder="you@example.com"
              required
            />
          </div>
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="password"
              value={loginData.password}
              onChange={(e) =>
                setLoginData({ ...loginData, password: e.target.value })
              }
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg"
              placeholder="Enter your password"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 px-4 rounded-lg font-medium text-white ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gray-900 hover:bg-emerald-700"
          }`}
        >
          {loading ? "Logging in..." : "Sign In"}
        </button>
      </form>
    </>
  );
}

export default CheckoutLogin;