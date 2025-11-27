
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || ''


const PolicyPage = async ({params}: {params: Promise<{category: string}>}) => {
  const { category } = await params;
  
  const res = await fetch(`${BASE_URL}/api/pages/policy/${category}`,{cache:'no-store'})
  const data = await res.json();
  const policy = data?.data || []


  if (!policy) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-600 text-lg">
          No policy found.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className=" text-2xl md:text-3xl font-bold text-gray-900 mb-3">
        {policy.title}
      </h1>

      <p className="text-gray-600 mt-1 mb-4">{policy.shortDescription}</p>

      {policy.effectiveDate && (
        <p className="text-sm text-gray-500 mb-8">
          <span className="font-medium">Effective Date:</span>{" "}
          {new Date(policy.effectiveDate).toLocaleDateString()}
        </p>
      )}

      <article className="prose prose-lg max-w-none">
        <div
          className="text-gray-700 leading-relaxed space-y-6

    [&>h2]:text-xl md:[&>h2]:text-2xl
    [&>h2]:font-semibold [&>h2]:mt-8 [&>h2]:mb-4

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
  );
}

export default PolicyPage