
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import AddToCartButton from "../Button/AddToCartButton";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || ''


const PopularProducts = async ( {content}:{content: any}) => {

   const res = await fetch(`${BASE_URL}/api/product`, {cache: "no-store"})
  const result = await res.json()
  const products = result?.data || []

  if (products.length === 0) {
    return (
      <p className="text-center text-gray-500">No popular products found.</p>
    );
  }

  return (
    <div className="bg-white px-4 md:px-8 lg:px-6 py-10 container mx-auto">
      <div className="pb-8 flex justify-between">
        <h2 className="text-xl md:text-3xl xl:text-4xl max-w-52 md:max-w-max font-medium text-gray-900">
         {content?.sectionHeadings?.popularProducts}
        </h2>

        <Link
          href="/products"
          className="bg-gray-900 text-white h-8 md:h-11 pl-3 pr-1 flex  items-center rounded text-xs md:text-sm"
        >
          View All <ChevronRight className="w-5 h-5" />{" "}
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.slice(0, 8).map((product: any) => (
          <div
            key={product._id}
            className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl border transition-all duration-300 bg-white"
          >
            <Link
              href={`/products/${product.pathUrl}`}
              className="relative w-full overflow-hidden"
            >
              <img
                src={
                  product.thumbnail || product.images?.[0] || "/placeholder.jpg"
                }
                alt={product.name}
                className="h-40 md:h-52 w-full object-contain group-hover:scale-110 transition-transform duration-300"
              />
            </Link>

            {product.stock === 0 && (
              <span className="text-xs md:text-base absolute top-3 right-2 pr-2 text-red-500 z-10">
                Out of stock
              </span>
            )}

            <div className="p-4">
              <h3 className="font-medium text-sm md:text-lg text-gray-800 mb-1 line-clamp-2">
                {product.name}
              </h3>
              <p className="text-gray-600 text-xs md:text-sm mb-2 line-clamp-2">
                {product.description}
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-sans text-base font-semibold">
                    ₹
                    {product.discountPrice > 0
                      ? product.discountPrice?.toLocaleString()
                      : product.price.toLocaleString()}
                  </div>
                  {product.discountPrice > 0 && (
                    <div className="text-xs line-through font-sans text-gray-500">
                      ₹{product.price?.toLocaleString()}
                    </div>
                  )}
                </div>

                <div className="text-sm">
                  <AddToCartButton
                    product={product}
                    disabled={product.stock <= 0}
                    className="text-white text-xs md:text-sm bg-gray-900 hover:bg-gray-950 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopularProducts;
