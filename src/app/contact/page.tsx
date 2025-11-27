// Contact Page

import { Mail, Phone, MapPin } from "lucide-react";
import ContactForm from "@/Components/ContactPage/ContactForm";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "";

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
          <h1 className="text-2xl md:text-3xl font-medium text-gray-900 mb-4">
            Get in Touch
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Have questions about your order or need assistance? We're here to
            help!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h2 className="text-xl md:text-2xl font-medium text-gray-900 mb-6">
                Contact Information
              </h2>

              <div className="space-y-6">
                <div className="flex items-start">
                  <Mail className="w-6 h-6 text-gray-900 mt-1 mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                    {content?.emails?.map((email: any, idx: number) => (
                      <p key={idx} className="text-gray-600">
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
                      <p key={idx} className="text-gray-600">
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
                    <p className="text-gray-600">{content?.address}</p>
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
