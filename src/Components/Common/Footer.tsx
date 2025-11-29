import React from "react";
import { Instagram, Linkedin, Youtube, ChevronRight } from "lucide-react";
import { FaXTwitter } from "react-icons/fa6";
import Link from "next/link";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "";

const Footer = async () => {
  const response = await fetch(`${BASE_URL}/api/category`, {
    cache: "no-store",
  });
  const result = await response.json();
  const category = result?.data || [];

  const res = await fetch(`${BASE_URL}/api/pages/contactpage`, {
    cache: "no-store",
  });
  const data = await res.json();
  const contact = data?.data || [];

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 text-gray-300">
      <div className="container mx-auto px-8 py-12 2xl:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          <div className="lg:col-span-3">
            <div className="flex items-center gap-3 mb-4">
              <div className=" w-10 h-10 2xl:w-12 2xl:h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                <img src={contact?.logo} alt="logo" className="w-6 h-8 2xl:w-8 2xl:h-10" />
              </div>
              <h2 className="text-xl font-bold text-white">
                {contact?.websiteTitle}
              </h2>
            </div>
            <p className="text-sm text-gray-400 mb-6 leading-relaxed">
              #306, 2nd Floor, NSIC-STP, B-24, Guindy Industrial Estate,
              Ekkatuthangal, Chennai-600032, India
            </p>
            <div className="flex gap-3">
              <Link
                href={contact?.instagram || ""}
                aria-label="Facebook"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center bg-gray-800 rounded-lg hover:bg-blue-600 transition-all duration-300 transform hover:scale-110 hover:shadow-lg"
              >
                <Instagram size={18} />
              </Link>
              <Link
                href={contact?.twitter || ""}
                aria-label="Twitter"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center bg-gray-800 rounded-lg hover:bg-black transition-all duration-300 transform hover:scale-110 hover:shadow-lg"
              >
                <FaXTwitter size={18} />
              </Link>
              <Link
                href={contact?.linkedin || ""}
                aria-label="LinkedIn"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center bg-gray-800 rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-110 hover:shadow-lg"
              >
                <Linkedin size={18} />
              </Link>
              <Link
                href={contact?.youtube || ""}
                aria-label="YouTube"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center bg-gray-800 rounded-lg hover:bg-red-700 transition-all duration-300 transform hover:scale-110 hover:shadow-lg"
              >
                <Youtube size={18} />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-white font-medium mb-5 text-base uppercase tracking-wider">
              Navigation
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className="text-xs 2xl:text-sm text-gray-400 hover:text-white transition-all duration-300 inline-flex items-center group"
                >
                  <ChevronRight
                    size={14}
                    className="mr-1 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300"
                  />
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-xs 2xl:text-sm text-gray-400 hover:text-white transition-all duration-300 inline-flex items-center group"
                >
                  <ChevronRight
                    size={14}
                    className="mr-1 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300"
                  />
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="text-sm text-gray-400 hover:text-white transition-all duration-300 inline-flex items-center group"
                >
                  <ChevronRight
                    size={14}
                    className="mr-1 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300"
                  />
                  Products
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-xs 2xl:text-sm text-gray-400 hover:text-white transition-all duration-300 inline-flex items-center group"
                >
                  <ChevronRight
                    size={14}
                    className="mr-1 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300"
                  />
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-xs 2xl:text-sm text-gray-400 hover:text-white transition-all duration-300 inline-flex items-center group"
                >
                  <ChevronRight
                    size={14}
                    className="mr-1 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300"
                  />
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className="text-white font-medium mb-5 text-base uppercase tracking-wider">
              Categories
            </h3>
            <ul className="space-y-3">
              {category.slice(0, 5).map((cat: any) => (
                <li key={cat._id}>
                  <Link
                    href={`/products?category=${cat._id}`}
                    className="text-sm text-gray-400 hover:text-white transition-all duration-300 inline-flex items-center group"
                  >
                    <ChevronRight
                      size={14}
                      className="mr-1 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300"
                    />
                    <span className="text-xs 2xl:text-sm">{cat.Name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-white font-medium mb-5 text-base uppercase tracking-wider">
              Information
            </h3>

            <ul className="space-y-3">
              <li>
                <Link
                  href="/policy/terms"
                  className="text-xs 2xl:text-sm text-gray-400 hover:text-white transition-all duration-300 inline-flex items-center group"
                >
                  <ChevronRight
                    size={14}
                    className="mr-1 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300"
                  />
                  Terms & Conditions
                </Link>
              </li>

              <li>
                <Link
                  href="/policy/privacy"
                  className="text-xs 2xl:text-sm text-gray-400 hover:text-white transition-all duration-300 inline-flex items-center group"
                >
                  <ChevronRight
                    size={14}
                    className="mr-1 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300"
                  />
                  Privacy Policy
                </Link>
              </li>

              <li>
                <Link
                  href="/policy/cancellation"
                  className="text-xs 2xl:text-sm text-gray-400 hover:text-white transition-all duration-300 inline-flex items-center group"
                >
                  <ChevronRight
                    size={14}
                    className="mr-1 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300"
                  />
                  Cancellation & Refund
                </Link>
              </li>

              <li>
                <Link
                  href="/policy/shipping"
                  className="text-xs 2xl:text-sm text-gray-400 hover:text-white transition-all duration-300 inline-flex items-center group"
                >
                  <ChevronRight
                    size={14}
                    className="mr-1 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300"
                  />
                  Shipping Policy
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-white font-medium mb-5 text-base uppercase tracking-wider">
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li className="flex flex-col border-l-2 pl-2 gap-3 group">
                {contact?.numbers?.map((num: any, idx: number) => (
                  <p
                    key={idx}
                    className="text-sm text-gray-400  hover:text-white transition-colors"
                  >
                    <span className="text-xs 2xl:text-sm">{num}</span>
                  </p>
                ))}
              </li>
              <li className="flex flex-col border-l-2 pl-2 gap-3 group">
                {contact?.emails?.map((email: any, idx: number) => (
                  <p
                    key={idx}
                    className="text-xs 2xl:text-sm text-gray-400 hover:text-white transition-colors break-all"
                  >
                    {email}
                  </p>
                ))}
              </li>
            </ul>
            <div className="mt-6 pt-6 border-t border-gray-800"></div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-center items-center">
            <p className=" text-xs 2xl:text-sm text-gray-500 text-center">
              © 2025 {contact?.websiteTitle}. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
