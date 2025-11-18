"use client";

import React from "react";
import {
  Wrench,
  ShieldCheck,
  Truck,
  Award,
  Factory,
  CheckCircle,
  Users,
  Target,
  Eye,
  PackageCheck,
  IndianRupee,
} from "lucide-react";
import VisionMissionSection from "@/Components/AboutPage/VisionMissionSection";
import HeroSection from "@/Components/AboutPage/HeroSection";
import ManufacturingProcessSection from "@/Components/AboutPage/ManufacturingProcessSection";
import WhyChooseUsSection from "@/Components/AboutPage/WhyChooseUsSection";
import WhyShopWithUs from "@/Components/AboutPage/whyShopWithUs";
import Testimonials from "@/Components/LandingPage/Testimonials";

const AboutPage = () => {
  return (
    <div className="bg-white text-gray-900">
      <HeroSection />
      <WhyChooseUsSection />

      <section className="border-b border-gray-200 py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 px-6 text-center">
          {[
            {
              icon: <PackageCheck className="w-8 h-8 mx-auto mb-2" />,
              text: "10,000+ Products Sold",
            },
            {
              icon: <Users className="w-8 h-8 mx-auto mb-2" />,
              text: "500+ Happy Customers",
            },
            {
              icon: <Award className="w-8 h-8 mx-auto mb-2" />,
              text: "ISO Certified",
            },
            {
              icon: <Truck className="w-8 h-8 mx-auto mb-2" />,
              text: "Pan-India Delivery",
            },
          ].map((item, i) => (
            <div key={i}>
              {item.icon}
              <p className="text-sm font-medium text-gray-700">{item.text}</p>
            </div>
          ))}
        </div>
      </section>
      <VisionMissionSection />

      <ManufacturingProcessSection />

      <WhyShopWithUs />

      {/* CTA Section */}
      <section className="bg-gray-900 text-white py-16 text-center px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Ready to Order?</h2>
          <p className="text-lg text-gray-300 mb-8">
            Browse our complete catalog and get the best hydraulic cylinders
            delivered to your doorstep
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/products"
              className="bg-white text-gray-900 px-8 py-4 font-bold hover:bg-gray-100 transition-colors"
            >
              Shop Now
            </a>
            <a
              href="/contact"
              className="border-2 border-white text-white px-8 py-4 font-bold hover:bg-white hover:text-gray-900 transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>

      <Testimonials/>

      
    </div>
  );
};

export default AboutPage;
