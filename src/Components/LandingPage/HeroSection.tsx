import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import product from "@/assets/product.png";

const HeroSection = () => {
  return (
    <div className="overflow-hidden">
      <div className="container mx-auto h-fit">
        <div className="relative  flex flex-col md:flex-row items-center justify-between  lg:gap-12 px-4 md:px-8 lg:px-2 xl:px-12">
          <div className="w-full md:w-1/2 flex flex-col justify-center py-1 md:pt-10 xl:py-14 order-2 md:order-1 z-10">
            <div className="mb-6 xl:mb-10">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-1 bg-gradient-to-r from-gray-900 to-gray-600"></div>
                <span className="text-xs font-semibold text-gray-600 tracking-widest uppercase">
                  Premium Solutions
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-6xl xl:text-7xl 2xl:font-medium text-gray-900 leading-tight md:mb-4 tracking-tight">
                High-Pressure
              </h1>
              <h2 className="text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-medium text-gray-500 leading-tight mb-8">
                Hydraulic Solutions
              </h2>

              <p className="text-base lg:text-lg text-gray-600 leading-relaxed font-light max-w-lg">
                Built for strength and durability, our cylinders deliver
                reliable performance across industrial and heavy-duty
                applications with precision engineering.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-5 2xl:mt-14">
              <Link href="/products">
                <button className="group relative px-8 py-4 bg-gray-900 text-white text-sm font-semibold tracking-wide uppercase overflow-hidden transition-all duration-300 hover:shadow-lg">
                  <span className="relative z-10 flex items-center gap-2">
                    Explore Products
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-950 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left z-0"></div>
                </button>
              </Link>
            </div>
          </div>

          <div className="order-1 md:w-1/2 relative">
            <div className="flex h-full w-full my-5">
              <div className="w-full h-full flex-shrink-0 relative flex items-center justify-center">
                <Image
                  src={product}
                  alt="Hydraulic Cylinder"
                  width={300}
                  height={300}
                  className="w-full  object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
