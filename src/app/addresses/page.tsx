import type { Metadata } from 'next';
import Addresses from '@/Components/AddressPage/Addresses'
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || ''

export async function generateMetadata(): Promise<Metadata> {

   const res = await fetch(`${BASE_URL}/api/pages/contactpage`, { cache: "no-store" });
   const data = await res.json();
   const contact = data?.data;

   const logo = contact?.logo || `${BASE_URL}/og-images/AceLogo.png`;
   const alts = contact?.websiteTitle || "Your Addresses"
   const name = contact?.websiteTitle || "ACE";

    return {
  
      title:"Manage Addresses",
      description:"Manage your saved delivery addresses, update details, and ensure your orders are shipped to the correct location with ease.",

      alternates: {
        canonical: `${BASE_URL}/addresses`,
      },

      openGraph: {
        title: "Manage Addresses",
        description:"View and update your saved delivery locations for a faster and smoother checkout experience.",
        url: `${BASE_URL}/addresses`,
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
        title: "Manage Addresses",
        description:"Add, edit, or remove your saved delivery addresses to ensure accurate and seamless future orders",
        images: [logo],
      },
}
}

const AddressPage = () => {
  return (
    <div>
      <Addresses/>
    </div>
  )
}

export default AddressPage