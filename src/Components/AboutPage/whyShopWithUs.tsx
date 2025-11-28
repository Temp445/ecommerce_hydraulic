import { CircleCheckBig } from 'lucide-react';
import Link from 'next/link';

const WhyShopWithUs = ({ content }: { content: any }) => {

  return (
    <div>
          <section className="w-full bg-white py-10 md:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-0">
        <div className="mb-10 md:mb-20">
          <h2 className="text-xl md:text-2xl lg:text-5xl  text-gray-900 mb-2">
           {content?.shopUs?.Heading}
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
          {content?.shopUs?.features.map((feature: any, idx:number) => {
            return (
              <div key={idx} className="flex gap-6">
                <div className="flex-shrink-0">
                  <CircleCheckBig  className="h-5 w-5 md:w-6 md:h-6 text-gray-900 mt-1" />
                </div>

                <div className="flex-1">
                  <h3 className="text-base md:text-xl text-gray-900 mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {feature.subTitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>

    
      <section className="bg-gray-900 text-white py-16 text-center px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl md:text-3xl font-bold mb-4">{content?.shopUs?.bannerTitle}</h2>
          <p className=" text-sm md:text-lg text-gray-300 mb-8">
          {content?.shopUs?.bannerDesc}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/products"
              className="bg-white text-gray-900 text-xs md:text-base px-4 py-2 md:px-8 md:py-4 font-bold hover:bg-gray-100 transition-colors"
            >
              Shop Now
            </Link>
            <Link
              href="/contact"
              className="border-2 border-white text-white text-xs md:text-base px-4 py-2 md:px-8 md:py-4 font-bold hover:bg-white hover:text-gray-900 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default WhyShopWithUs