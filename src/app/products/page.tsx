import { Suspense } from "react";
import ProductsClient from './ProductsClient'
export const dynamic = "force-dynamic";
import type { Metadata } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || ''

export const metadata: Metadata = {
  
  title: 'ACE HYDRAULIC',
  description: "ACE HYDRAULIC",
   keywords: "ACE",
   openGraph: { 
    title: 'ACE HYDRAULIC',
    description: 'ACE HYDRAULIC',
    url: `${BASE_URL}/product`,
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

const ProductPage = () => {
  return (
    <Suspense fallback={<div className="p-8 text-center"></div>}>
        <ProductsClient />
    </Suspense>
  )
}

export default ProductPage