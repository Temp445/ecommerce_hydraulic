import { Metadata } from 'next'
import CartItem from '@/Components/CartPage/CartItem'


const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || ''

// Meta tags
export async function generateMetadata(): Promise<Metadata> {

    const res = await fetch(`${BASE_URL}/api/pages/seo/cart`, { cache: "no-store"});

    const json = await res.json();
    const seo = json?.data;

    const res1 = await fetch(`${BASE_URL}/api/pages/contactpage`, { cache: "no-store" });
   const data = await res1.json();
   const contact = data?.data;

   const logo = contact?.logo || `${BASE_URL}/og-images/AceLogo.png`;
   const alts = contact?.websiteTitle || "Shopping Cart"
   const name = contact?.websiteTitle || "ACE";
   

    if (!seo) {
      return {
        title: `Shopping Cart | ${contact?.websiteTitle } `,
        description: "Review the items you’ve added to your cart, update quantities, and proceed to a secure and smooth checkout experience.",
      };
    }

    return {
      title: seo.title || `Shopping Cart | ${contact?.websiteTitle }`,
      description: seo.description || "Review the items you’ve added to your cart, update quantities, and proceed to a secure and smooth checkout experience.",
      keywords: seo.keywords || "shopping cart, review items, online cart, secure checkout, cart page",

      alternates: {
        canonical: `${BASE_URL}/cart`,
      },

      openGraph: {
        title: seo.ogTitle || seo.title || `Shopping Cart | ${contact?.websiteTitle }`,
        description: seo.ogDescription || seo.description || "Check your selected items and manage your cart before moving ahead to secure checkout.",
        url: `${BASE_URL}/cart`,
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
        title: seo.twitterTitle || seo.title ||  `Shopping Cart | ${contact?.websiteTitle}`,
        description: seo.twitterDescription || seo.description || "View and update your cart items before completing your purchase safely and quickly.",
        images: [logo],
      },
    };
}


const CartPage = () => {
  return (
    <>
      <CartItem/>
    </>
  )
}

export default CartPage