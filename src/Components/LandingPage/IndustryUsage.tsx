const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || ''

const IndustryUsage = async () => {
  
  const res = await fetch(`${BASE_URL}/api/application`, {cache: "no-store"})
  const data = await res.json()
  const applications = data?.data || []

  return (
    <section className=" py-5 md:py-20 bg-gray-100">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className=" text-2xl md:text-4xl font-medium text-gray-900 mb-6  tracking-tight">
          Applications
        
        </h2>

        {applications.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
            {applications.slice(0, 6).map((app: any) => (
              <div
                key={app._id}
                className="group relative bg-white rounded-xl overflow-hidden hover:border shadow-md hover:shadow-xl transition-all duration-500"
              >
                <div className="relative  w-full">
                  <img
                    src={app.image || "/placeholder.png"}
                    alt={app.title}
                    className="object-cover h-56 w-full group-hover:scale-110 transition-transform duration-700"
                  />
                </div>

                <div className="p-6 text-center">
                  <h3 className="2xl:text-xl font-semibold text-gray-900 mb-3 transition-colors">
                    {app.title}
                  </h3>
                  <p className="text-gray-600 text-xs 2xl:text-sm leading-relaxed">
                    {app.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
        {applications.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-600 text-base">No Applications found</p>
          </div>
        )}
       
      </div>
    </section>
  );
};

export default IndustryUsage;
