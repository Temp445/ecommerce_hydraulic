// About Page
// Components Used:
// - @/Components/AboutPage/HeroSection
// - @/Components/AboutPage/WhyChooseUsSection
// - @/Components/AboutPage/VisionMissionSection
// - @/Components/AboutPage/ManufacturingProcessSection
// - @/Components/AboutPage/whyShopWithUs
// - @/Components/LandingPage/Testimonials

import React from "react";
import VisionMissionSection from "@/Components/AboutPage/VisionMissionSection";
import HeroSection from "@/Components/AboutPage/HeroSection";
import ManufacturingProcessSection from "@/Components/AboutPage/ManufacturingProcessSection";
import WhyChooseUsSection from "@/Components/AboutPage/WhyChooseUsSection";
import WhyShopWithUs from "@/Components/AboutPage/whyShopWithUs";
import Testimonials from "@/Components/LandingPage/Testimonials";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || ''

const AboutPage = async () => {
  
  const res = await fetch(`${BASE_URL}/api/pages/aboutpage`,{cache:'no-store'})
  const data = await res.json();
  const content = data?.data || []

  return (
    <div className="bg-white text-gray-900">
      <HeroSection content = {content} />
      <WhyChooseUsSection content = {content} />

      <VisionMissionSection content = {content} />

      <ManufacturingProcessSection content = {content} />

      <WhyShopWithUs content = {content}/>

      <Testimonials />
    </div>
  );
};

export default AboutPage;
