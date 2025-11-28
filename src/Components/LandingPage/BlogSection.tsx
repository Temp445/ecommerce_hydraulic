import { MoveRight } from "lucide-react";
import Link from "next/link";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "";

const BlogSection = async ({content}: {content: any}) => {
  const res = await fetch(`${BASE_URL}/api/blog`, { cache: "no-store" });
  const data = await res.json();
  const blogs = data?.data || [];

  return (
    <section className=" py-10 md:py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 md:gap-12 mb-16">
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="inline-block px-4 py-2 bg-gray-300 text-gray-900 text-xs font-bold uppercase tracking-wider mb-4">
                {content?.sectionHeadings?.blog}
              </div>
              <h2 className="text-xl md:text-2xl text-gray-900 mb-1 md:mb-4 leading-tight">
                {content?.sectionHeadings?.blogSubtitle}
              </h2>

              <div className="w-16 h-1 bg-gray-800"></div>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-4">
            {blogs.slice(0, 5).map((blog: any, idx: any) => (
              <Link
                href={`/blog/${blog.slug}`}
                key={idx}
                className="group flex flex-col md:flex-row bg-white hover:bg-gray-50 transition-all duration-300 border-l-4 border-gray-300 hover:border-gray-900 shadow-sm hover:shadow-lg"
              >
                <div className="w-[300px] flex items-center justify-center p-4 relative overflow-hidden">
                  <div className="relative w-full h-20 md:h-full transform group-hover:scale-105 transition-transform duration-500">
                    <img
                      src={blog.imageUrl}
                      alt={blog.title}
                      className="w-full h-32 md:h-52 object-contain"
                    />
                  </div>
                </div>

                <div className="flex-1 p-6 md:p-8 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-2xl flex items-end font-bold text-gray-400">
                            {String(idx + 1).padStart(2, "0")}
                          </span>
                        </div>
                        <h3 className="text-sm md:text-xl lg:text-2xl font-medium text-gray-900 mb-2 text-left transition-colors duration-300">
                          {blog.title}
                        </h3>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className=" text-xs md:text-sm text-gray-700 text-left">
                        {blog.shortDescription}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-end justify-end pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-800 group-hover:gap-3 transition-all duration-300">
                      <span>Explore</span>
                      <MoveRight />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
