// Contact Page
import type { Metadata } from "next";
import { Mail, Phone, MapPin } from "lucide-react";
import ContactForm from "@/Components/ContactPage/ContactForm";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "";

// Meta tags
export async function generateMetadata(): Promise<Metadata> {

    const res = await fetch(`${BASE_URL}/api/pages/seo/contact`, { cache: "no-store"});
    const json = await res.json();
    const seo = json?.data;

   const res1 = await fetch(`${BASE_URL}/api/pages/contactpage`, { cache: "no-store" });
   const data = await res1.json();
   const contact = data?.data;

   const logo = contact?.logo || `${BASE_URL}/og-images/AceLogo.png`;
   const alts = `Contact Us | ${contact?.websiteTitle}` || "Contact Us"
   const name = contact?.websiteTitle || "ACE";
   

    if (!seo) {
      return {
        title: `Contact Us | ${contact?.websiteTitle}`,
        description: "Reach out to us for inquiries about hydraulic components, machinery parts, orders, or support. Our team is here to assist you with reliable guidance and quick responses.",
      };
    }

    return {
      title: seo.title || `Contact Us | ${contact?.websiteTitle}`,
      description: seo.description || "Reach out to us for inquiries about hydraulic components, machinery parts, orders, or support. Our team is here to assist you with reliable guidance and quick responses.",
      keywords: seo.keywords || "contact hydraulic supplier, hydraulic parts support, hydraulic components help, industrial solutions inquiries",

      alternates: {
        canonical: `${BASE_URL}/contact`,
      },

      openGraph: {
        title: seo.ogTitle || seo.title || `Contact Us | ${contact?.websiteTitle}`,
        description: seo.ogDescription || seo.description || "Contact our team for sales inquiries, product guidance, and reliable support for hydraulic and industrial components",
        url: `${BASE_URL}/contact`,
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
        title: seo.twitterTitle || seo.title || `Contact Us | ${contact?.websiteTitle}`,
        description: seo.twitterDescription || seo.description || "Contact our team for sales inquiries, product guidance, and reliable support for hydraulic and industrial components",
        images: [logo],
      },
    };
}

const ContactPage = async () => {
  const res = await fetch(`${BASE_URL}/api/pages/contactpage`, {
    cache: "no-store",
  });
  const data = await res.json();
  const content = data?.data || [];
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-xl md:text-3xl font-medium text-gray-900 mb-4">
            Get in Touch
          </h1>
          <p className="text-sm md:text-lg text-gray-600 max-w-2xl mx-auto">
            Have questions about your order or need assistance? We're here to
            help!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h2 className="text-lg md:text-2xl font-medium text-gray-900 mb-6">
                Contact Information
              </h2>

              <div className="space-y-6">
                <div className="flex items-start">
                  <Mail className="w-6 h-6 text-gray-900 mt-1 mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                    {content?.emails?.map((email: any, idx: number) => (
                      <p key={idx} className="text-gray-600 text-sm">
                        {email}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="flex items-start">
                  <Phone className="w-6 h-6 text-gray-900 mt-1 mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Phone</h3>
                    {content?.numbers?.map((num: any, idx: number) => (
                      <p key={idx} className="text-gray-600 text-sm">
                        {num}
                      </p>
                    ))}
                    <p className="text-sm text-gray-500 mt-1">
                      {content?.timing}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <MapPin className="w-6 h-6 text-gray-900 mt-1 mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Address
                    </h3>
                    <p className="text-gray-600 text-sm">{content?.address}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
