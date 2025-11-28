import type { Metadata } from "next";
import {Rubik,Poppins} from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthProvider";
import Header from "@/Components/Common/Header";
import Navbar from "@/Components/Common/Navbar";
import Toast from "@/Components/Common/Toast";
import { CartProvider } from "@/context/CartProvider";
import Footer from "@/Components/Common/Footer";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "";

const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400","500", "700" ]
})



export const metadata: Metadata = {
  
  title: 'ACE HYDRAULIC',
  description: "ACE HYDRAULIC",
   keywords: "ACE",
   openGraph: { 
    title: 'ACE HYDRAULIC',
    description: 'ACE HYDRAULIC',
    url: `${BASE_URL}`,
    siteName: 'ACE',
    images: [
      {
        url: `${BASE_URL}/og-images/AceLogo.png`,
        width: 1200,
        height: 630,
        alt: 'ACE',
      },
    ],
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${rubik.variable} ${poppins.variable} antialiased`}
      >
         <AuthProvider>
          <CartProvider>
         <Header/>
        <Navbar/>
        <div className="min-h-screen">
        {children}
        </div>
        <Toast/>
        <Footer/>
        </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
