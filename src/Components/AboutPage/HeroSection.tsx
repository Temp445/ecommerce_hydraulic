"use client";

import Link from "next/link";
import React from "react";

const HeroSection = () => {
  return (
    <section className="relative  flex items-center">
        <div className="absolute inset-0 opacity-5 z-0 ">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(90deg, #000 0, #000 1px, transparent 1px, transparent 80px),
                           repeating-linear-gradient(0deg, #000 0, #000 1px, transparent 1px, transparent 80px)`
        }}></div>
      </div>
      <div className="max-w-7xl relative mx-auto px-6 md:px-12 py-24 w-full">
        <div className="max-w-4xl">
          <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">
            About Us
          </span>
          <h1 className="mt-6 text-5xl md:text-7xl font-thin text-gray-900 leading-tight">
            India's Leading Hydraulic  <br />
            <span className="text-gray-400">Cylinder Store</span>
          </h1>
          <p className="mt-8 text-xl text-gray-600 max-w-2xl leading-relaxed">
            We are pioneers in hydraulic cylinder manufacturing, delivering precision-engineered solutions that power industries worldwide.
          </p>
          
         
        </div>
         <Link href="/contact" className="mt-12 flex items-center  z-20 hover:cursor-pointer  text-sm  font-medium uppercase text-gray-900">
            Contact Us
          </Link>
      </div>
    
    </section>
  );
};

export default HeroSection;
