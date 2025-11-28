import React from "react";

const ManufacturingProcessSection = ({ content }: { content: any }) => {
  

  return (
    <section className="py-10 md:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="mb-5 md:mb-16">
          <h2 className="text-xl md:text-5xl font-thin text-gray-900 tracking-tight">
            {content?.process?.Heading}
          </h2>
          <div className="mt-1 md:mt-6 w-20 h-0.5 bg-gray-900"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {content?.process?.features.map((item: any, idx: number) => (
            <div key={idx} className="relative">
                 <div className="hidden lg:block absolute top-6  w-full h-px bg-gray-300 z-0"></div>
              <div className="relative z-10">
                <div className="w-6 h-6 md:w-12 md:h-12 rounded-full bg-gray-900 text-white flex items-center justify-center text-sm font-light mb-4">
                  {idx + 1}
                </div>
                <h3 className=" text-sm md:text-lg font-medium text-gray-900 mb-3">
                  {item?.title}
                </h3>
                <p className="text-xs md:text-sm text-gray-500 leading-relaxed">
                  {item.subTitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ManufacturingProcessSection;
