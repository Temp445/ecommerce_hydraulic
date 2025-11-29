//  List out All blog page
import type { Metadata } from "next";
import { File , ChevronRight, Image  } from 'lucide-react';
import Link from "next/link";


const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || ''

// Meta tags
export async function generateMetadata(): Promise<Metadata> {

    const res = await fetch(`${BASE_URL}/api/pages/seo/blog`, { cache: "no-store"});

    const json = await res.json();
    const seo = json?.data;

    const res1 = await fetch(`${BASE_URL}/api/pages/contactpage`, { cache: "no-store" });
   const data = await res1.json();
   const contact = data?.data;

   const logo = contact?.logo || `${BASE_URL}/og-images/AceLogo.png`;
   const alts = contact?.websiteTitle || "Blogs"
   const name = contact?.websiteTitle || "ACE";
   

    if (!seo) {
      return {
        title: `Blogs | ${contact?.websiteTitle}`,
        description: "Explore expert articles, guides, and resources on hydraulic systems, machinery components, maintenance tips, and industrial solutions from industry professionals.",
      };
    }

    return {
      title: seo.title || `Blogs | ${contact?.websiteTitle}`,
      description: seo.description || "Explore expert articles, guides, and resources on hydraulic systems, machinery components, maintenance tips, and industrial solutions from industry professionals.",
      keywords: seo.keywords || "Read informative blogs and updates on hydraulic technology, industrial components, troubleshooting tips, and product knowledge.",

      alternates: {
        canonical: `${BASE_URL}/blog`,
      },

      openGraph: {
        title: seo.ogTitle || seo.title || `Blogs | ${contact?.websiteTitle}`,
        description: seo.ogDescription || seo.description || "Explore expert articles, guides, and resources on hydraulic systems, machinery components, maintenance tips, and industrial solutions from industry professionals.",
        url: `${BASE_URL}/blog`,
        siteName: name,
        images: [
          {
            url: logo,
            width: 1200,
            height: 630,
            alt: alts,
          },
        ],
        type: "website",
      },

      twitter: {
        card: "summary_large_image",
        title: seo.twitterTitle || seo.title || `Blogs | ${contact?.websiteTitle}`,
        description: seo.twitterDescription || seo.description || "Explore expert articles, guides, and resources on hydraulic systems, machinery components, maintenance tips, and industrial solutions from industry professionals.",
        images: [logo],
      },
    };
}


const BlogPage = async() => {

  const res = await fetch(`${BASE_URL}/api/blog`, {cache: 'no-store'})
  const data = await res.json()
  const blogs = data?.data || []


  return (
    <div className="min-h-screen mb-52 bg-white">
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-12 bg-white"></div>
            <div>
              
              <h1 className="text-2xl md:text-4xl  text-white">
                Blogs
              </h1>
            </div>
          </div>
          <p className="text-gray-300 text-lg ml-4 max-w-3xl">
            Expert insights, technical guides, and industry updates from our engineering team
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        { blogs.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-gray-300">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-100 mb-4">
              <File  className="w-8 h-8 text-gray-700"/>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No Articles Available
            </h3>
            <p className="text-gray-600">
              New technical content coming soon
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog:any) => (
              <Link
              href={`/blog/${blog.slug}`}
                key={blog._id}
                className="group bg-white border border-gray-200 hover:border-gray-900 transition-all duration-300 cursor-pointer overflow-hidden hover:shadow-lg"
              >
                <div className="relative h-52 w-full overflow-hidden bg-slate-100">
                  {blog.imageUrl ? (
                    <>
                      <img
                        src={blog.imageUrl}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </>
                  ) : (
                    <div className="h-full flex items-center justify-center">
                   <Image className='w-20 h-20 text-gray-300' />
                    </div>
                  )}
                  <div className="absolute top-0 left-0 w-full h-1 bg-gray-900 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3 text-xs">
                    <span className="text-slate-600 font-medium uppercase tracking-wide">
                      {new Date(blog.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    
                  </div>

                  <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 leading-tight">
                    {blog.title}
                  </h2>

                  <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed mb-4">
                    {blog.shortDescription}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-gray-900 font-semibold text-sm uppercase tracking-wide">
                      Read Article
                    </span>
                    <div className="w-8 h-8 bg-slate-900  flex items-center justify-center transition-colors">
                      <ChevronRight className='w-5 h-5 text-white group-hover:translate-x-1 transition-transform' />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default BlogPage;