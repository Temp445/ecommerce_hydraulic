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
    <div className="w-full py-5 px-2 md:px-4">
      <div className="container mx-auto">
        <div className="bg-white rounded-lg  py-10 md:px-4 ">
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-10 ">
            {features.map((feature, index) => (
              <div key={index} className="flex flex-col items-center xl:ml-2 gap-2 md:gap-5">
                <div className="flex-shrink-0 bg-gray-100 p-2 rounded-full">
                  <div className="w-14 h-14 rounded-full flex items-center p-1 justify-center">
                    {feature.icon && <feature.icon className="w-10 h-10 text-gray-800" />}
                  </div>
                </div>
                <div className=" md:text-center">
                  <h3 className="text-sm md:text-lg font-medium text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed w-64 hidden md:block">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}