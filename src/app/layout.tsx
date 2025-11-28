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


export async function generateMetadata(): Promise<Metadata> {

    const res = await fetch(`${BASE_URL}/api/pages/seo/home`, { cache: "no-store"});

    const json = await res.json();
    const seo = json?.data;

    const res1 = await fetch(`${BASE_URL}/api/pages/contactpage`, { cache: "no-store" });
   const data = await res1.json();
   const contact = data?.data;

   const logo = contact?.logo || `${BASE_URL}/og-images/AceLogo.png`;
   const name = contact?.websiteTitle || "ACE";
   

    if (!seo) {
      return {
        title: "ACE",
        description: "Delivering top-tier hydraulic components, precision industrial equipment, and specialized hydraulic solutions for diverse commercial and manufacturing operations.",
      };
    }

    return {
      title: seo.title || contact?.websiteTitle || "ACE",
      description: seo.description || "Delivering top-tier hydraulic components, precision industrial equipment, and specialized hydraulic solutions for diverse commercial and manufacturing operations.",
      keywords: seo.keywords || "hydraulic products, hydraulic equipment, hydraulic components, hydraulic systems, industrial hydraulics, hydraulic spare parts, hydraulic pumps, hydraulic valves, hydraulic cylinders, hydraulic hoses, hydraulic fittings, hydraulic power pack, hydraulic motors, hydraulic seals, hydraulic filters, hydraulic pipes, hydraulic tubes, hydraulic connectors, hydraulic hose assemblies, gear pump, piston pump, directional control valves, pressure control valves, flow control valves, oil cooler hydraulics, hydraulic manifolds, industrial machinery parts, manufacturing equipment, heavy equipment hydraulics, construction hydraulics, material handling hydraulics, industrial automation components, mechanical industrial supplies, buy hydraulic parts online, industrial hydraulic components supplier, heavy-duty hydraulic equipment for factories, best hydraulic pumps for machinery, custom hydraulic solutions for industries, hydraulic system spare parts online, affordable hydraulic cylinders for machines, quality hydraulic products, reliable industrial hydraulics, trusted hydraulic supplier, premium hydraulic components, durable hydraulic equipment",

      alternates: {
        canonical: `${BASE_URL}/`,
      },

      openGraph: {
        title: seo.ogTitle || seo.title || contact?.websiteTitle || "Premium Hydraulic Products & Industrial Equipment Supplier",
        description: seo.ogDescription || seo.description || "Premium hydraulic products and industrial equipment designed for performance, durability, and commercial applications.",
        url: `${BASE_URL}/`,
        siteName: name,
        images: [
          {
            url: logo,
            width: 1200,
            height: 630,
          },
        ],
        type: "website",
      },

      twitter: {
        card: "summary_large_image",
        title: seo.twitterTitle || seo.title || contact?.websiteTitle || "",
        description: seo.twitterDescription || seo.description || "",
        images: [logo],
      },
    };
}



export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

   const res = await fetch(`${BASE_URL}/api/pages/contactpage`, {
    cache: "no-store",
  });
  const data = await res.json();
  const contact = data?.data || []
  return (
    <html lang="en">
      <link rel="icon" href={ contact?.logo || "/og-images/AceLogo.png"} sizes="any" />
      <body
        className={`${rubik.variable} ${poppins.variable} antialiased`}
      >
         <AuthProvider>
          <CartProvider>
         <Header/>
        <Navbar contact={contact}/>
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
