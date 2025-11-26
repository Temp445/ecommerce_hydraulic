import { ArrowRight } from "lucide-react";
import Link from "next/link";

const HeroSection = ({content}: {content: any}) => {

  return (
    <div className="overflow-hidden relative w-full h-fit mt-10 flex items-center">
      
      <div className="relative container mx-auto px-4 md:px-8 lg:px-12 z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          <div className="flex flex-col justify-center">
            <div className="inline-flex items-center gap-3 mb-8 w-fit">
              <div className="w-10 h-0.5 bg-gradient-to-r from-gray-900 to-gray-400"></div>
              <span className="text-xs font-semibold text-gray-600 tracking-widest uppercase">
                {content?.hero?.note}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-semibold text-gray-900 leading-tight tracking-tight ">
              {content?.hero?.title}
            </h1>

            <p className="text-xl md:text-2xl lg:text-5xl text-gray-500 font-light leading-relaxed mb-6">
              {content?.hero?.subTitle}
            </p>

            <p className="text-base md:text-lg text-gray-600 leading-relaxed font-light max-w-xl mb-10">
              {content?.hero?.description}
            </p>

            <div className="flex items-center gap-4 ">
              <Link href='/products' className="group relative px-8 py-4 bg-gray-900 text-white text-sm font-semibold tracking-wide uppercase overflow-hidden hover:bg-gray-800 transition-all duration-300 hover:shadow-xl hover:shadow-gray-900/20">
                <span className="relative z-10 flex items-center gap-2">
                  Explore Products
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </Link>
            </div>
          </div>

          <div className="relative h-96 md:h-full min-h-96 flex items-center justify-center">
            <img
              src={content?.hero?.heroImage}
              alt="Hero Image"
              className="relative w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;