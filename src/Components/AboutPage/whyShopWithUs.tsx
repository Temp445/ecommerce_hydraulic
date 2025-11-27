import { CircleCheckBig } from 'lucide-react';

const WhyShopWithUs = ({ content }: { content: any }) => {

  return (
    <div>
          <section className="w-full bg-white py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-0">
        <div className="mb-20">
          <h2 className="text-2xl md:text-5xl  text-gray-900 mb-2">
           {content?.shopUs?.Heading}
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
          {content?.shopUs?.features.map((feature: any, idx:number) => {
            return (
              <div key={idx} className="flex gap-6">
                <div className="flex-shrink-0">
                  <CircleCheckBig  className="w-6 h-6 text-gray-900 mt-1" />
                </div>

                <div className="flex-1">
                  <h3 className="text-xl text-gray-900 mb-1">
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
          <h2 className="text-3xl font-bold mb-4">{content?.shopUs?.bannerTitle}</h2>
          <p className="text-lg text-gray-300 mb-8">
          {content?.shopUs?.bannerDesc}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/products"
              className="bg-white text-gray-900 px-8 py-4 font-bold hover:bg-gray-100 transition-colors"
            >
              Shop Now
            </a>
            <a
              href="/contact"
              className="border-2 border-white text-white px-8 py-4 font-bold hover:bg-white hover:text-gray-900 transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default WhyShopWithUs