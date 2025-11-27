"use client";
import { useState } from "react";

type ProductGalleryProps = {
  images: string[];
  discountPercentage: number;
  productName: string;
};

export default function ProductGallery({
  images,
  discountPercentage,
  productName,
}: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <>
      <div className="relative mb-6 group">
        <div className="aspect-[4/3] bg-neutral-50 border border-gray-200 rounded overflow-hidden">
          {discountPercentage > 0 && (
            <span className="absolute md:top-6 md:right-5 text-xs font-medium tracking-widest text-white bg-emerald-600 rounded px-4 py-2 z-10">
              Upto {discountPercentage}% off
            </span>
          )}
          <img
            src={images[selectedImage]}
            alt={productName}
            className="w-full h-full object-contain bg-white"
          />
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2">
        {images.map((img: string, idx: number) => (
          <button
            key={idx}
            onClick={() => setSelectedImage(idx)}
            className={`flex-shrink-0 w-24 h-24 rounded-sm overflow-hidden border transition-all ${
              selectedImage === idx
                ? "border-black"
                : "border-neutral-200 hover:border-neutral-400"
            }`}
          >
            <img
              src={img}
              alt={`View ${idx + 1}`}
              className="w-full h-full object-contain"
            />
          </button>
        ))}
      </div>
    </>
  );
}
