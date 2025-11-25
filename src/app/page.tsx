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
import FeatureList from '@/Components/LandingPage/WhyChooseUs'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || ''

const page = async () => {
  
  
  const res = await fetch(`${BASE_URL}/api/product`, {cache: "no-store"})
  const result = await res.json()
  const products = result?.data || []
   
  //Hero Section Api
  const res1 = await fetch(`${BASE_URL}/api/landingpage/herosection`, {cache: "no-store"}) 
  const result1 = await res1.json()
  const hero = result1?.data ?? null

// Offer Section Api
    const res2 = await fetch(`${BASE_URL}/api/landingpage/offersection`, { cache: "no-store" }
  );
  const result2 = await res2.json();
  const offer = result2?.data || null
  


  return (
    <div>
      <HeroSection initialContent={hero}/>
      <FeatureList/>
      <CategorySection/>
      <NewProduct products={products}/>
      <Offer initialContent={offer} />
      <PopularProducts products={products}/>
      <About/>
      <IndustryUsage/>
      <Testimonials/>
      <BlogSection/>
    </div>
  )
}

export default page