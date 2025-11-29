
import type { Metadata } from 'next';
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || ''

// meta data
export async function generateMetadata(
  { params }: { params: { category: string } }
): Promise<Metadata> {
  const { category } = await params;

  const res = await fetch(`${BASE_URL}/api/pages/policy/${category}`, {
    cache: "no-store",
  });

  const data1 = await res.json();
  const policy = data1?.data;

    const res2 = await fetch(`${BASE_URL}/api/pages/seo/about`, { cache: "no-store"});

    const json = await res2.json();
    const seo = json?.data;

   const res3 = await fetch(`${BASE_URL}/api/pages/contactpage`, { cache: "no-store" });
   const data2 = await res3.json();
   const contact = data2?.data;

   const logo = contact?.logo || `${BASE_URL}/og-images/AceLogo.png`;
   const alts = contact?.websiteTitle || "Policy"
   const name = contact?.websiteTitle || "ACE";
  

    if (!seo) {
      return {
        title: `Information & Guidelines | Customer Support & Store Details`,
        description: "Find important information regarding how our store operates, supports customers, and ensures a reliable and transparent experience from browsing to delivery.",
      };
    }
  

  return {
    title: `${policy?.title} | ${contact?.websiteTitle}` || seo.title  || "Information & Guidelines | Customer Support & Store Details",
    description: seo.description || "Find important information regarding how our store operates, supports customers, and ensures a reliable and transparent experience from browsing to delivery.",
    keywords: seo.keywords || "store information, customer guidance, support details, service information, ecommerce guidelines",

      alternates: {
        canonical: `${BASE_URL}/${category}`,
      },

      openGraph: {
        title: seo.ogTitle || seo.title || `${policy?.title} | ${contact?.websiteTitle}`,
        description: seo.ogDescription || seo.description || "Discover important details about how our store operates and supports customers through clear and reliable service practices.",
        url: `${BASE_URL}/${category}`,
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
        title: seo.twitterTitle || seo.title || `${category} | ${contact?.websiteTitle}`,
        description: seo.twitterDescription || seo.description || "Access important information on store operations, customer guidance, and support procedures.",
        images: [logo],
      },
  };
}

const PolicyPage = async ({ params }: { params: Promise<{ category: string }> }) => {
  const { category } = await params;

  const res = await fetch(`${BASE_URL}/api/pages/policy/${category}`, {
    cache: "no-store",
  });
  const data = await res.json();
  const policy = data?.data;

  if (!policy || !policy.title) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-white">
        <div className="text-center">
          <h2 className="text-2xl font-light text-gray-900 mb-2">Policy Not Found</h2>
          <p className="text-gray-500">
            The policy you're looking for could not be found.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-16 px-4">
      <div className="max-w-4xl mx-auto border border-gray-300 rounded-lg p-4">
        <div className="mb-8">
          
          <h1 className="text-5xl md:text-3xl bg-gray-900 text-white p-2 rounded font-light  mb-6 leading-tight">
            {policy.title}
          </h1>
          {policy.shortDescription && (
            <p className="text-lg text-gray-600 leading-relaxed">
              {policy.shortDescription}
            </p>
          )}
        </div>

        {(policy.effectiveDate || policy.lastUpdated) && (
          <div className="flex gap-8 mb-12 pb-8 border-b border-gray-200 text-sm text-gray-500">
            {policy.effectiveDate && (
              <div>
                <p className="font-medium text-gray-900">Effective Date</p>
                <p>{new Date(policy.effectiveDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
              </div>
            )}
            {policy.lastUpdated && (
              <div>
                <p className="font-medium text-gray-900">Last Updated</p>
                <p>{new Date(policy.lastUpdated).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
              </div>
            )}
          </div>
        )}

          <article className="prose prose-lg max-w-none">
        <div
          className="text-gray-700 leading-relaxed space-y-6

    [&>h2]:text-xl md:[&>h2]:text-2xl
    [&>h2]:font-medium [&>h2]:mt-8 [&>h2]:mb-4

    [&>h3]:text-lg md:[&>h3]:text-xl
    [&>h3]:font-medium [&>h3]:mt-6 [&>h3]:mb-3

    [&>p]:mb-3

    [&>ul]:ml-6 [&>ul]:list-disc [&>ul>li]:mb-2
    [&>ol]:ml-6 [&>ol]:list-decimal [&>ol>li]:mb-2

    [&>blockquote]:border-l-4 [&>blockquote]:border-blue-600 
    [&>blockquote]:pl-5 [&>blockquote]:italic 
    [&>blockquote]:text-gray-600 [&>blockquote]:my-6"
    dangerouslySetInnerHTML={{ __html: policy.content || '<p class="text-center justify-center text-2xl text-gray-600"> No policy found.</p>' }}
        />
      </article>
      </div>
    </div>
  );
};

export default PolicyPage;