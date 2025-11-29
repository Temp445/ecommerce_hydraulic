import type { Metadata } from 'next';
import OrdersClient from './OrdersClient'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || ''

export async function generateMetadata(): Promise<Metadata> {

   const res = await fetch(`${BASE_URL}/api/pages/contactpage`, { cache: "no-store" });
   const data = await res.json();
   const contact = data?.data;

   const logo = contact?.logo || `${BASE_URL}/og-images/AceLogo.png`;
   const alts = contact?.websiteTitle || "My Orders"
   const name = contact?.websiteTitle || "ACE";

    return {
  
      title: "My Orders | Track All Purchases Online",
      description:"Easily view and manage all your past and current orders in one place. Track statuses, review purchase details, and stay updated on your shopping activity with a seamless order management experience.",

      alternates: {
        canonical: `${BASE_URL}/myorders`,
      },

      openGraph: {
        title: "My Orders - Manage & Track Your Purchases",
        description:"Access a complete list of your orders, check statuses, and view purchase history with ease.",
        url: `${BASE_URL}/myorders`,
        siteName: name,
        images: [
          {
            url: logo,
            width: 1200,
            height: 630,
            alt: alts,
          },
        ],
        type: "website",
      },

      twitter: {
        card: "summary_large_image",
        title: "My Orders - Track All Purchases",
        description:"View and manage all your orders in a simple, organized dashboard.",
        images: [logo],
      },
}
}

const OrdersPage = () => {
  return (
    <div>
      <OrdersClient/>
    </div>
  )
}

export default OrdersPage