"use client";

import { Toaster } from "react-hot-toast";
const Toast = () => {
  return (
    <Toaster
      position="top-center"
      reverseOrder={false}
      toastOptions={{
        duration: 3000,
        style: {
          background: "#000000",
          color: "#fff",
          borderRadius: "8px",
          fontSize: "15px",
        },
        success: {
          iconTheme: {
            primary: "#10B981",
            secondary: "#fff",
          },
          style: {
            background: "#fffff",
            color: "#00000",
            borderRadius: "8px",
            fontSize: "15px",
          },
        },
        error: {
          iconTheme: {
            primary: "#EF4444",
            secondary: "#fff",
          },
        },
      }}
    />
  );
};

export default Toast;
