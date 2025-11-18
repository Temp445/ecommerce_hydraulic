"use client";

import { useState } from "react";
import { CircleUserRound, LogOut, LogIn, UserPlus, MapPin, Package, User , ChevronUp } from "lucide-react";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthProvider";

const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const isLoggedIn = !!user;

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 justify-center text-gray-800 rounded py-3 md:px-4 transition group"
      >
        {isLoggedIn ? (
          <div className="flex gap-2 items-center">
            <CircleUserRound className=" w-5 h-5 2xl:w-6 2xl:h-6" />
            <span className="text-sm 2xl:text-base">{user?.firstName || "User"}</span>
            <ChevronUp
              className={`w-4 h-5 transition-transform duration-300 ${
                isOpen ? "rotate-180" : "group-hover:rotate-180"
              }`}
            />
          </div>
        ) : (
          <Link href="/login" className="flex gap-2 items-center">
            <CircleUserRound className="w-5 h-5 2xl:w-6 2xl:h-6" /> <span className="text-sm 2xl:text-base">Login</span>
            <ChevronUp className="w-4 h-5 group-hover:rotate-180 transition-transform duration-300" />
          </Link>
        )}
      </button>

        {isOpen && (
        <div className="absolute -right-16  w-56 bg-white border border-gray-200 rounded shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          {isLoggedIn ? (
            <>
              <div className="px-4 py-3 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-white font-bold shadow-md">
                    {user?.firstName?.charAt(0) || "U"}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{user?.firstName || "User"}</p>
                    <p className="text-xs text-gray-500">Manage your account</p>
                  </div>
                </div>
              </div>

              <div className="py-1">
                <Link
                  href="/user-profile"
                  className="flex items-center px-4 py-2.5 text-gray-700 text-sm hover:text-black hover:bg-gray-300 transition-all duration-200 group"
                >
                  <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center mr-3 group-hover:bg-gray-300 transition-colors">
                    <User className="w-4 h-4 text-gray-900" />
                  </div>
                  <span className="font-medium">My Profile</span>
                </Link>

                <Link
                  href="/addresses"
                  className="flex items-center px-4 py-2.5 text-gray-700 hover:text-black text-sm hover:bg-gray-300 transition-all duration-200 group"
                >
                  <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center mr-3 group-hover:bg-gray-300 transition-colors">
                    <MapPin className="w-4 h-4 text-gray-900" />
                  </div>
                  <span className="font-medium">Addresses</span>
                </Link>

                <Link
                  href="/myorders"
                  className="flex items-center px-4 py-2.5 text-gray-700 text-sm hover:text-black hover:bg-gray-300 transition-all duration-200 group"
                >
                  <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center mr-3 group-hover:bg-gray-300 transition-colors">
                    <Package className="w-4 h-4 text-gray-900" />
                  </div>
                  <span className="font-medium">My Orders</span>
                </Link>
              </div>

              <div className="border-t border-gray-100 my-1" />

              <button
                onClick={handleLogout}
                className="w-full text-left flex items-center px-4 py-2.5 hover:text-red-600 text-sm hover:bg-red-50 transition-all duration-200 group"
              >
                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center mr-3 group-hover:bg-red-200 transition-colors">
                  <LogOut className="w-4 h-4 group-hover:text-red-600" />
                </div>
                <span className="font-medium">Logout</span>
              </button>
            </>
          ) : (
            <div className="py-1">
              <Link
                href="/register"
                className="flex items-center px-4 py-2.5 text-gray-700 text-sm hover:bg-gray-200 transition-all duration-200 group"
              >
                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center mr-3 group-hover:bg-gray-200 transition-colors">
                  <UserPlus className="w-4 h-4 text-ext" />
                </div>
                <span className="font-medium">Sign Up</span>
              </Link>

              <Link
                href="/login"
                className="flex items-center px-4 py-2.5 text-gray-700 text-sm hover:bg-gray-200 transition-all duration-200 group"
              >
                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center mr-3 group-hover:bg-gray-200 transition-colors">
                  <LogIn className="w-4 h-4 text-gray-900" />
                </div>
                <span className="font-medium">Login</span>
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserMenu;