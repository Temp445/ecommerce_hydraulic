//  Home Page

import About from '@/Components/LandingPage/About'
import BlogSection from '@/Components/LandingPage/BlogSection'
import CategorySection from '@/Components/LandingPage/CategorySection'
import HeroSection from '@/Components/LandingPage/HeroSection'
import IndustryUsage from '@/Components/LandingPage/IndustryUsage'
import NewProduct from '@/Components/LandingPage/NewProduct'
import Offer from '@/Components/LandingPage/Offer'
import PopularProducts from '@/Components/LandingPage/PopularProducts'
import Testimonials from '@/Components/LandingPage/Testimonials'
import WhyChooseUs from '@/Components/LandingPage/WhyChooseUs'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || ''

const page = async () => {

// landing page api
    const res = await fetch(`${BASE_URL}/api/pages/landingpage`, { cache: "no-store" }
  );
  const result = await res.json();
  const content = result?.data || null
  
  return (
    <div>
      <HeroSection content={content} />
      <WhyChooseUs/>
      <CategorySection content={content}/>
      <NewProduct content={content}/>
      <Offer content={content}/>
      <PopularProducts content={content}/>
      <About content={content}/>
      <IndustryUsage content={content}/>
      <Testimonials/>
      <BlogSection content={content}/>
    </div>
  )
}

export default page