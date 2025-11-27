"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Package,
  Folder,
  Menu,
  X,
  ListTodo,
  UserStar,
  NotepadText,
  ChevronDown,
  Layers  
} from "lucide-react";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [pagesOpen, setPagesOpen] = useState(false); 
  const pathname = usePathname();

  const menuItems = [
    { name: "Products", href: "/admin/product", icon: Package },
    { name: "Categories", href: "/admin/category", icon: Folder },
    { name: "Orders", href: "/admin/orders", icon: ListTodo },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Applications", href: "/admin/application", icon: LayoutDashboard },
    { name: "Testimonials", href: "/admin/testimonial", icon: UserStar },
    { name: "Blog", href: "/admin/blog", icon: NotepadText },
    {
      name: "Pages",
      icon: Layers,
      subItems: [
        { name: "Landing Page", href: "/admin/pages/landingpage" },
        { name: "About Page", href: "/admin/pages/aboutpage" },
        { name: "Policy", href: "/admin/pages/policy" },
        
      ],
    },
  ];

  return (
    <>
      <div className="md:hidden h-fit left-0 w-full bg-gray-900 text-white flex items-center justify-between p-4 z-50">
        <h1 className="text-lg font-medium">Admin Panel</h1>
        <button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <aside
        className={`absolute md:sticky md:top-0 left-0 h-full md:h-[100vh] w-48 lg:w-64 bg-gray-900 text-gray-100 z-40 transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <div className="hidden md:flex items-center justify-between px-6 py-4 border-b border-gray-800 md:py-6">
          <h2 className="text-lg 2xl:text-xl font-medium">Admin Panel</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden text-gray-400 hover:text-white"
          >
            <X size={22} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto mt-4">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;

              if (item.subItems) {
                return (
                  <li key={item.name}>
                    <button
                      onClick={() => setPagesOpen(!pagesOpen)}
                      className={`flex items-center justify-between w-full gap-3 px-6 py-3 text-sm font-medium transition-all duration-150 text-gray-400 hover:bg-gray-800 hover:text-white`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon size={18} />
                        {item.name}
                      </div>
                      <span>{pagesOpen ? <ChevronDown className="rotate-180" /> : <ChevronDown />}</span>
                    </button>
                    {pagesOpen && (
                      <ul className="pl-12 mt-1 space-y-1">
                        {item.subItems.map((sub) => {
                          const subActive = pathname === sub.href;
                          return (
                            <li key={sub.name}>
                              <Link
                                href={sub.href}
                                className={`block px-4 py-2 text-sm rounded transition-all duration-150
                                ${
                                  subActive
                                    ? "bg-gray-800 text-white"
                                    : "text-gray-400 hover:bg-gray-700 hover:text-white"
                                }`}
                                onClick={() => setIsOpen(false)}
                              >
                                {sub.name}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </li>
                );
              }

              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-6 py-3 text-sm font-medium transition-all duration-150
                      ${active ? "bg-gray-800 text-white" : "text-gray-400 hover:bg-gray-800 hover:text-white"}`}
                    onClick={() => setIsOpen(false)}
                  >
                    <Icon size={18} />
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      <div className="md:hidden md:h-16" />
    </>
  );
};

export default Sidebar;
