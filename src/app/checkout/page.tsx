// Product Checkout Page
import { Metadata } from 'next'
import Checkout from '@/Components/CheckoutPage/Checkout'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || ''

// Meta tags
export async function generateMetadata(): Promise<Metadata> {

    const res = await fetch(`${BASE_URL}/api/pages/seo/checkout`, { cache: "no-store"});
    const json = await res.json();
    const seo = json?.data;

    const res1 = await fetch(`${BASE_URL}/api/pages/contactpage`, { cache: "no-store" });
   const data = await res1.json();
   const contact = data?.data;

   const logo = contact?.logo || `${BASE_URL}/og-images/AceLogo.png`;
   const alts = contact?.websiteTitle || "Checkout"
   const name = contact?.websiteTitle || "ACE";
   

    if (!seo) {
      return {
        title: `Checkout | ${contact?.websiteTitle} `,
        description: "Finish your order through a smooth and secure checkout process. Enter your details, review your items, and confirm your purchase.",
      };
    }

    return {
      title: seo.title || `Checkout | ${contact?.websiteTitle }`,
      description: seo.description || "Finish your order through a smooth and secure checkout process. Enter your details, review your items, and confirm your purchase.",
      keywords: seo.keywords || "secure checkout, online checkout, complete order, confirm purchase, checkout page",

      alternates: {
        canonical: `${BASE_URL}/checkout`,
      },

      openGraph: {
        title: seo.ogTitle || seo.title || `Checkout | ${contact?.websiteTitle }`,
        description: seo.ogDescription || seo.description || "Proceed with a fast and secure checkout experience. Review your items and finalize your order with confidence.",
        url: `${BASE_URL}/checkout`,
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
        title: seo.twitterTitle || seo.title ||  `Checkout | ${contact?.websiteTitle}`,
        description: seo.twitterDescription || seo.description || "Confirm your order details and complete your purchase through a safe and seamless checkout process.",
        images: [logo],
      },
    };
}

const CheckoutPage = () => {
  return (
    <div>
        <Checkout/>
    </div>
  )
}

export default CheckoutPage