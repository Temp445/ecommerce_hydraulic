
const WhyChooseUsSection = ({ content }: { content: any }) => {
  
  return (
    <div>
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
           <div className="relative">
             <div className="sticky top-20">
              <h2 className="text-4xl md:text-5xl font-light text-gray-900 leading-tight mb-8">
                {content?.WhyChooseUs?.title}
              </h2>
              <p className="text-lg text-gray-500 mb-12">
                {content?.WhyChooseUs?.subTitle}
              </p>

              <div className="flex gap-10">
                <div>
                  <p className="text-3xl font-light text-gray-900">
                    {content?.WhyChooseUs?.stats?.clients?.value}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {content?.WhyChooseUs?.stats?.clients?.label}
                  </p>
                </div>
                <div>
                  <p className="text-3xl font-light text-gray-900">
                    {content?.WhyChooseUs?.stats?.satisfaction?.value}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {content?.WhyChooseUs?.stats?.satisfaction?.label}
                  </p>
                </div>
              </div>
            </div>
            </div>
            <div className="space-y-12">
              {content?.WhyChooseUs?.features.map(
                (item: any, idx: number | null | undefined) => (
                  <div key={idx}>
                    <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3">
                      {item?.title}
                    </h3>
                    <h4 className="text-xl text-gray-900 mb-2">
                      {item?.subTitle}
                    </h4>
                    <p className="text-gray-500">{item?.description}</p>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      <section className=" py-10 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {content?.WhyChooseUs?.values.map((item: any, idx: number | null | undefined) => (
              <div
                key={idx}
                className="group relative h-40 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:scale-105"
              >
                <div className="absolute inset-0 bg-white group-hover:bg-opacity-10 transition-all duration-500 flex flex-col justify-center items-center p-8">
                  <div className="relative z-10 text-center">
                    <h3 className="text-3xl  text-gray-900 tracking-tighter mb-2">
                      {item.value}
                    </h3>

                    <div className="h-1 w-12 mx-auto bg-gray-300 rounded-full  mb-4"></div>

                    <p className="text-lg text-gray-900  mb-2">{item.label}</p>

                    <p className="text-xs font-medium text-gray-500">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default WhyChooseUsSection;
