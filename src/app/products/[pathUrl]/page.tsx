// Product Detail Page
// Component used:
// - @/Components/ProductPage/RelatedProducts
// - @/Components/ProductDetailPage/ProductReviews
// - @/Components/ProductDetailPage/ProductQuatity
// - @/Components/ProductDetailPage/ProductGallery

import {
  Package,
  Truck,
  Shield,
  Award,
  History,
  MoveRight,
} from "lucide-react";
import RelatedProducts from "@/Components/ProductDetailPage/RelatedProducts";
import ProductReviews from "@/Components/ProductDetailPage/ProductReviews";
import ProductGallery from "@/Components/ProductDetailPage/ProductGallery";
import ProductQuantity from "@/Components/ProductDetailPage/ProductQuantity";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "";

const ProductDetailPage = async ({
  params,
}: {
  params: Promise<{ pathUrl: string }>;
}) => {
  const { pathUrl } = await params;

  const res = await fetch(`${BASE_URL}/api/product/${pathUrl}`, {
    cache: "no-store",
  });
  const data = await res.json();
  const product = data?.data || [];

  const allImages = product
    ? [product.thumbnail, ...(product.images || [])]
    : [];

  if (!product) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <Package className="text-slate-300 mb-3" size={60} />
        <p className="text-slate-600 text-lg">Product not found</p>
      </div>
    );
  }

  const discountPercentage = product.discountPrice
    ? Math.round(
        ((product.price - product.discountPrice) / product.price) * 100
      )
    : 0;

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-6 lg:px-12 py-12">
        <div className="grid lg:grid-cols-12 gap-16">
          <div className="lg:col-span-7">
            {/* Product Gallery */}
            <ProductGallery
              images={allImages}
              discountPercentage={discountPercentage}
              productName={product.name}
            />
          </div>

          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-8">
              <div className="flex items-center gap-3 mb-4 text-xs tracking-widest uppercase text-neutral-500">
                {product.brand && <span>{product.brand}</span>}
                {product.brand && product.category && <span>•</span>}
                {product.category && (
                  <span>{product.category?.Name || product.category}</span>
                )}
              </div>

              <h1 className="text-xl 2xl:text-4xl font-light text-neutral-900 mb-6 leading-tight tracking-tight">
                {product.name}
              </h1>

              {product.model && (
                <p className="text-sm text-neutral-600 mb-8">
                  Model: {product.model}
                </p>
              )}

              <div className="mb-8 pb-8 border-b border-neutral-200">
                <div className="flex items-baseline gap-4 mb-2">
                  <span className="text-xl 2xl:text-3xl font-light text-neutral-900 font-sans">
                    ₹
                    {(product.discountPrice || product.price)?.toLocaleString()}
                  </span>
                  {product.discountPrice > 0 && (
                    <span className=" md:text-lg text-neutral-400 line-through font-sans">
                      ₹{product.price?.toLocaleString()}
                    </span>
                  )}
                </div>
                {product.discountPrice > 0 && (
                  <p className="text-xs text-neutral-800 uppercase tracking-wide font-sans">
                    You save ₹{" "}
                    <span> {product.price - product.discountPrice} </span>
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="border border-neutral-200 p-4">
                  <div className="text-xs uppercase tracking-widest text-neutral-500 mb-2">
                    Availability
                  </div>
                  <div
                    className={`text-xs md:text-sm font-medium ${
                      product.stock > 10 ? "text-neutral-900" : "text-red-600"
                    }`}
                  >
                    {product.stock > 10
                      ? "In Stock"
                      : product.stock > 0
                      ? `Only ${product.stock} left`
                      : "Out of Stock"}
                  </div>
                </div>

                <div className="border border-neutral-200 rounded p-4">
                  <div className="text-xs uppercase tracking-widest text-neutral-500 mb-2">
                    Delivery
                  </div>
                  <div className="text-xs md:text-sm font-medium text-neutral-900">
                    {(() => {
                      const date = new Date();
                      date.setDate(date.getDate() + 7);
                      return `Expected by ${date.toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}`;
                    })()}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-5">
                {product.deliveryCharge !== undefined && (
                  <div className="mb-8 text-sm text-neutral-800 flex items-center gap-2 font-sans">
                    <Truck size={16} />
                    <span>
                      {product.deliveryCharge === 0
                        ? "Free Shipping"
                        : `Shipping: ₹${product.deliveryCharge}`}
                    </span>
                  </div>
                )}

                {product.returnPolicy && (
                  <div className="mb-8 text-sm text-neutral-800 flex items-center gap-2 font-sans">
                    <History size={16} />
                    <span>
                      {product.returnPolicy
                        ? "7 Days Return Policy"
                        : "No Return Policy"}
                    </span>
                  </div>
                )}
              </div>
              {/* Product Quatity */}
              <ProductQuantity stock={product.stock} product={product} />
            </div>
          </div>
        </div>

        <div className=" mt-10 md:mt-24 grid lg:grid-cols-12 gap-10 md:gap-16">
          <div className="lg:col-span-7">
            <h2 className="text-xl md:text-2xl font-light text-neutral-900 mb-6 tracking-tight">
              Product Details
            </h2>
            <div className="prose prose-neutral max-w-none">
              <p className="text-neutral-700 text-sm md:text-base leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>

            {product.benefits && product.benefits.length > 0 && (
              <div className="mt-10 md:mt-12">
                <h3 className="text-xl md:text-2xl font-light text-neutral-900 mb-6 tracking-tight">
                  Key Features
                </h3>
                <div className="space-y-6">
                  {product.benefits.map((benefit: any, idx: number) => (
                    <div key={idx} className="flex gap-4 items-start">
                      <MoveRight
                        className="text-neutral-400 flex-shrink-0 mt-1"
                        size={20}
                      />
                      <div>
                        <h4 className="font-medium text-neutral-900 mb-1">
                          {benefit.title}
                        </h4>
                        <p className="text-sm text-neutral-600 leading-relaxed">
                          {benefit.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-5">
            <h2 className="text-xl md:text-2xl font-light text-neutral-900 mb-6 tracking-tight">
              Specifications
            </h2>

            <div className="space-y-4">
              {product.technicalDetails?.map((item: any, idx: number) => (
                <div
                  key={idx}
                  className="flex justify-between py-3 border-b border-neutral-200"
                >
                  <span className="text-xs uppercase tracking-widest text-neutral-700">
                    {item.title}
                  </span>
                  <span className="text-sm font-medium text-neutral-900 text-right max-w-[200px]">
                    {item.value}
                  </span>
                </div>
              ))}

              {(!product.technicalDetails ||
                Object.keys(product.technicalDetails).filter(
                  (k) => product.technicalDetails[k] && k !== "_id"
                ).length === 0) &&
                !product.category && (
                  <p className="text-sm text-neutral-500 italic">
                    No specifications available
                  </p>
                )}
              {product.warranty && (
                <div className=" text-sm text-neutral-800 flex flex-col leading-none  gap-2 font-sans">
                  <span className="text-base">Warranty Details</span> <br />
                  <span>{product.warranty}</span>
                </div>
              )}
            </div>

            <div className="mt-12 md:pt-8 md:border-t border-gray-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-gray-700">
                <div className="flex items-start gap-3">
                  <Shield size={22} className="text-gray-800 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-800">
                      100% Secure Payments
                    </p>
                    <p className="text-gray-500 text-xs">
                      Your transactions are encrypted and protected.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Truck size={22} className="text-gray-800 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-800">
                      Fast & Reliable Delivery
                    </p>
                    <p className="text-gray-500 text-xs">
                      Quick shipping right to your doorstep
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Award size={22} className="text-gray-800 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-800">
                      Premium Quality
                    </p>
                    <p className="text-gray-500 text-xs">
                      All products are checked before dispatch.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Product Review */}
        <ProductReviews productId={product._id} />
        
         {/* Related Products */}
        {product?.category?._id && (
          <RelatedProducts
            categoryId={product.category._id}
            currentProductId={product._id}
          />
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
