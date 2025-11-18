"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Search } from "lucide-react";
import Image from "next/image";
import Logo from "@/assets/AceLogo.png";
import UserMenu from "../Button/UserMenu";
import { useAuth } from "@/context/AuthProvider";
import SearchBar from "../Button/SearchBar";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartProvider";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { user } = useAuth();
  const { cartCount } = useCart();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && isOpen) {
        setIsOpen(false);
      }
      if (window.innerWidth >= 768 && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen, isSearchOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Products" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
    { href: "/blog", label: "Blog" },
  ];

  const allLinks =
    user?.role === "admin"
      ? [...navLinks, { href: "/admin/product", label: "Dashboard" }]
      : navLinks;

  return (
    <nav className="bg-white sticky inset-0.5 top-0 z-50 border-b border-gray-100">
      <div className="container mx-auto px-2 sm:px-4 lg:px-2 xl:px-6 ">
        <div className="flex justify-between items-center h-16 ">
          <Link
            href="/"
            className="flex flex-col items-start sm:items-center flex-shrink-0 min-w-0"
          >
            <div className="flex items-end">
              <Image
                src={Logo}
                alt="ACE Hydraulic logo"
                width={32}
                height={32}
                className="w-8 h-9 flex-shrink-0"
              />
              <span className="font-medium text-xl 2xl:text-2xl font-sans text-gray-900">
                ACE
              </span>
            </div>
            <div className=" -mt-1 sm:-mt-1.5 font-medium uppercase text-xs 2xl:text-sm text-gray-600 whitespace-nowrap">
              Hydraulic
            </div>
          </Link>

          <div className="hidden lg:flex items-center space-x-4 xl:space-x-10">
            {allLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-900  font-medium text-xs 2xl:text-sm  relative group"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gray-900 rounded-full group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}
          </div>

          <div className=" flex items-center gap-2 sm:gap-0">
            <SearchBar />
            <div>
              <UserMenu />
            </div>

            <div className="flex items-center justify-center  py-4">
              <Link href="/cart" className="relative flex items-center gap-1">
                <ShoppingCart className="w-5 2xl:w-6 2xl:h-6 text-gray-900" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 md:-top-2 left-3 bg-red-600 text-white text-[10px]  md:text-xs rounded-full w-4 h-4 md:w-5 md:h-5 flex items-center justify-center">
                    {" "}
                    {cartCount}
                  </span>
                )}
                <div className="text-sm 2xl:text-base">Cart</div>
              </Link>
            </div>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden md:p-2 text-gray-700 hover:bg-blue-50 hover:text-blue-500 rounded-full transition-colors flex-shrink-0"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {isSearchOpen && (
          <div className="md:hidden pb-4 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center bg-gray-50 rounded-full px-4 py-2.5 border border-gray-200 focus-within:border-blue-500 transition-colors">
              <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search products..."
                className="bg-transparent ml-2 text-gray-700 placeholder-gray-400 focus:outline-none text-sm flex-1 min-w-0"
                autoFocus
              />
            </div>
          </div>
        )}

        {isOpen && (
          <div className="lg:hidden pb-4 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="space-y-1">
              {allLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors font-medium text-sm"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;