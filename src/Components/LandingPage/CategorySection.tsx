import Link from "next/link";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || ''

const CategorySection = async ({content}:{content: any}) => {

  const res = await fetch(`${BASE_URL}/api/category`, {cache: "no-store"})
  const list = await res.json()
  const categories = list?.data || []

  return (
    <section className=" py-5 md:py-20 bg-gray-900">
      <div className="container mx-auto px-4 2xl:px-8">
       <div className="flex justify-between">
         <div className=" mb-5 md:mb-16">
          <h2 className="text-xl sm:text-2xl md:text-3xl xl:text-4xl font-light text-white mb-2">
            {content?.sectionHeadings?.categories}
          </h2>
          <div className="w-12 h-1 bg-white md:mt-4"></div>
        </div>
          {categories.length > 5 && ( <Link href="/categories" className=" text-sm md:text-base text-white border p-2 h-fit rounded">View All</Link> ) }

       </div>
        {categories.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-4 md:gap-6 justify-center">
            {categories.slice(0, 6).map((cat: any) => (
              <Link
                key={cat._id}
                href={`/products?category=${cat._id}`}
                className="group flex flex-col items-center text-center transition-all duration-300"
              >
                <div className="w-full aspect-square bg-white rounded flex items-center justify-center mb-2 md:mb-4  transition-colors duration-300 border border-gray-200">
                  <img
                    src={cat.CatImage}
                    alt={cat.Name}
                    className="h-20 sm:h-24 md:h-40 object-contain group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <h3 className="text-xs sm:text-sm  font-medium text-white line-clamp-2">
                  {cat.Name}
                </h3>
              </Link>
            ))}
          </div>
        )}

        {categories.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-600 text-base">No categories found</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default CategorySection;
