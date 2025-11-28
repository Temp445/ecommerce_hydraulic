import Link from "next/link";

const Offer = ({ content }: { content: any }) => {
  if(content.offer?.active === false) return null
  return (
    <div className="bg-white">
      <section className="relative bg-gray-950 text-white py-10 md:py-20 text-center px-6 rounded-3xl mx-4 overflow-hidden">
        <div className="absolute inset-0 opacity-20 animated-grid" />

        <div className="relative  max-w-3xl mx-auto">
          <h2 className="text-lg md:text-3xl xl:text-4xl mb-4 leading-tight">
            {content?.offer?.title}
          </h2>

          <p className="text-xs md:text-lg text-blue-100 mb-8">
            {content?.offer?.description}
          </p>

          <Link
            href="/contact"
            className="px-4 py-2 md:px-8 md:py-3 bg-white text-sm md:text-base text-black font-medium rounded-full shadow-md"
          >
            Contact Us
          </Link>

          <p className="pt-10 text-xs  md:text-sm text-blue-200">{content?.offer?.note}</p>
        </div>
      </section>
    </div>
  );
}

export default Offer