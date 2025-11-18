"use client";

import React from "react";

const WhyChooseUsSection = () => {
  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          <div>
            <h2 className="text-4xl md:text-5xl font-light text-gray-900 leading-tight mb-8">
              Why industry leaders choose us
            </h2>
            <p className="text-lg text-gray-500 mb-12">
              Three decades of engineering excellence, delivered with precision and trust.
            </p>
            
            <div className="flex gap-10">
              
              <div>
                <p className="text-3xl font-light text-gray-900">500+</p>
                <p className="text-sm text-gray-500 mt-1">Clients</p>
              </div>
              <div>
                <p className="text-3xl font-light text-gray-900">99%</p>
                <p className="text-sm text-gray-500 mt-1">Satisfaction</p>
              </div>
            </div>
          </div>

          <div className="space-y-12">
            <div>
              <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3">
                Expertise
              </h3>
              <h4 className="text-xl text-gray-900 mb-2">Industry Leadership</h4>
              <p className="text-gray-500">
                Pioneering hydraulic cylinder manufacturing with customized solutions for diverse industries.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3">
                Technology
              </h3>
              <h4 className="text-xl text-gray-900 mb-2">Advanced Manufacturing</h4>
              <p className="text-gray-500">
                State-of-the-art facilities with precision machinery meeting international standards.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3">
                Service
              </h3>
              <h4 className="text-xl text-gray-900 mb-2">Customer-Centric Approach</h4>
              <p className="text-gray-500">
                Comprehensive support from consultation to after-sales with dedicated technical assistance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUsSection;
