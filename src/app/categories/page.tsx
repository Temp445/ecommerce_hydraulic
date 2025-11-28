import Link from "next/link";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || ''

const CategoriesPage = async () => {

  const res = await fetch(`${BASE_URL}/api/category`, {cache: "no-store"})
  const list = await res.json()
  const categories = list?.data || []

  return (
    <section className="bg-white py-10 md:py-20 md:pb-32">
      <div className="container mx-auto px-4 2xl:px-8">
        <div className="mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-4">
            Categories
          </h2>
          <div className="w-16 h-1 bg-black"></div>
        </div>

        {categories.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
            {categories.map((cat: any) => (
              <Link
                key={cat._id}
                href={`/products?category=${cat._id}`}
                className="group"
              >
                <div className="aspect-square bg-white rounded-lg border-4  border-gray-200 overflow-hidden mb-4 flex items-center justify-center hover:border-gray-600 transition-colors duration-200 relative">
                  <img
                    src={cat.CatImage}
                    alt={cat.Name}
                    className="h-40 md:h-48 object-contain group-hover:scale-95 transition-transform duration-300"
                  />
                </div>
                <div>
                  <h3 className="text-base md:text-lg font-light text-gray-900 mb-2">
                    {cat.Name}
                  </h3>
                  <div className="w-0 h-0.5 bg-black group-hover:w-12 transition-all duration-300"></div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {categories.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-600 text-base font-light">No categories available</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default CategoriesPage;