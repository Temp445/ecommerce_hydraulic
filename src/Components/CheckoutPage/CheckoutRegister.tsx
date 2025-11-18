"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const CheckoutRegister = ({
  setShowRegister,
}: {
  setShowRegister: (v: boolean) => void;
}) => {
  const router = useRouter();
  const [registerData, setRegisterData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (registerData.password !== registerData.confirmPassword) {
      toast.error("Password and Confirm Password do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/user-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerData),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Something went wrong. Please try again.");
        return;
      }

      toast.success("Registration successful!");

      const loginRes = await fetch("/api/auth/user-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: registerData.email,
          password: registerData.password,
        }),
      });

      const loginData = await loginRes.json();

      if (!loginRes.ok) {
        toast.error("Auto-login failed. Please log in manually.");
        router.push("/login");
        return;
      }

      localStorage.setItem("token", loginData.token);
      localStorage.setItem("userId", loginData.user._id);
      localStorage.setItem("role", loginData.user.role);
      localStorage.setItem("user", JSON.stringify(loginData.user));

      // Merge guest cart if any
      const guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
      if (guestCart.length > 0) {
        try {
          await fetch("/api/cart", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${loginData.token}`,
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
      console.error("Registration error:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <p className="text-sm text-gray-600 mb-4">
        Create an account to save your information for faster checkout.
      </p>

      <form onSubmit={handleRegister} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="First Name"
            value={registerData.firstName}
            onChange={(e) =>
              setRegisterData({ ...registerData, firstName: e.target.value })
            }
            className="px-4 py-2.5 border border-gray-300 rounded-lg"
            required
          />
          <input
            type="text"
            placeholder="Last Name"
            value={registerData.lastName}
            onChange={(e) =>
              setRegisterData({ ...registerData, lastName: e.target.value })
            }
            className="px-4 py-2.5 border border-gray-300 rounded-lg"
            required
          />
        </div>

        <input
          type="email"
          placeholder="Email Address"
          value={registerData.email}
          onChange={(e) =>
            setRegisterData({ ...registerData, email: e.target.value })
          }
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={registerData.password}
          onChange={(e) =>
            setRegisterData({ ...registerData, password: e.target.value })
          }
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
          required
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={registerData.confirmPassword}
          onChange={(e) =>
            setRegisterData({
              ...registerData,
              confirmPassword: e.target.value,
            })
          }
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 px-4 rounded-lg font-medium text-white ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-emerald-600 hover:bg-emerald-700"
          }`}
        >
          {loading ? "Creating account..." : "Create Account"}
        </button>

        <div className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => setShowRegister(false)}
            className="text-emerald-600 font-medium hover:underline"
          >
            Sign in
          </button>
        </div>
      </form>
    </>
  );
};

export default CheckoutRegister;
