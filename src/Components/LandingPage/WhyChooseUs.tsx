import React from 'react';

import { PiPackageFill } from "react-icons/pi";
import { CiLock } from "react-icons/ci";
import { GoCheckCircleFill } from "react-icons/go";
import { TbTruckDelivery } from "react-icons/tb";

export default function FeaturesSection() {
  const features = [
    {
      icon: TbTruckDelivery,
      title: 'Fast Delivery',
      description: 'We ensure fast, safe, and reliable shipping for every order.'
    },
    {
      icon: GoCheckCircleFill,
      title: 'Quality Assurance',
      description: 'Premium materials and rigorous testing for reliable performance.'
    },
    {
      icon: PiPackageFill,
      title: 'Secure Packaging',
      description: "Robust packaging to protect products during transit."
    },
    {
      icon: CiLock,
      title: 'Secure Payment',
      description: 'Shop with confidence knowing that our secure payment'
    }
  ];

  return (
    <div className="w-full py-5 md:py-8 ">
      <div className="container mx-auto">
        <div className="bg-white rounded-lg py-10 px-4">
          <div className="grid grid-cols-4 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">

            {features.map((feature, index) => (
              <div 
                key={index} 
                className="flex flex-col items-center text-center gap-3 sm:gap-4"
              >
                <div className="bg-gray-100 p-3 rounded-full flex items-center justify-center">
                  <feature.icon className="w-8 h-8 sm:w-10 sm:h-10 md:w-14 md:h-14 text-gray-800" />
                </div>

                <h3 className="text-xs sm:text-base md:text-lg  font-medium md:font-semibold text-gray-900">
                  {feature.title}
                </h3>

                <p className="text-xs sm:text-sm hidden md:block text-gray-500 max-w-[160px] sm:max-w-[180px] md:max-w-[200px]">
                  {feature.description}
                </p>
              </div>
            ))}

          </div>
        </div>
      </div>
    </div>
  );
}
