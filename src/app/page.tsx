import About from '@/Components/LandingPage/About'
import BlogSection from '@/Components/LandingPage/BlogSection'
import CategorySection from '@/Components/LandingPage/CategorySection'
import HeroSection from '@/Components/LandingPage/HeroSection'
import IndustryUsage from '@/Components/LandingPage/IndustryUsage'
import NewProduct from '@/Components/LandingPage/NewProduct'
import Offer from '@/Components/LandingPage/Offer'
import PopularProducts from '@/Components/LandingPage/PopularProducts'
import Testimonials from '@/Components/LandingPage/Testimonials'
import FeatureList from '@/Components/LandingPage/WhyChooseUs'
import React from 'react'

const page = () => {
  return (
    <div>
      
      <HeroSection/>
      <FeatureList/>
      <CategorySection/>
      <NewProduct/>
      <Offer/>
      <PopularProducts/>
      <About/>
      <IndustryUsage/>
      <Testimonials/>
      <BlogSection/>
    </div>
  )
}

export default page