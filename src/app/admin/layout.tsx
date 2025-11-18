import React from "react";
import ProductedRoute from "@/Components/Common/ProductedRoute";
import Sidebar from "@/Components/Common/Sidebar";

const Admin = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="flex flex-col md:flex-row min-h-screen container mx-auto">
      <Sidebar />

      <div className="flex-1">
        <ProductedRoute>{children}</ProductedRoute>
      </div>
    </div>
  );
};

export default Admin;
