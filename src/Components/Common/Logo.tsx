import React from 'react'

import Image from "next/image";
import acelogo from "@/assets/AceLogo.png";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || ''

const Logo = async() => {
    const res = await fetch(`${BASE_URL}/api/pages/contactpage`,{cache:'no-store'})
  const data = await res.json();
  const contact = data?.data || []
  return (
    <div className='flex items-center flex-shrink-0'>
    <img
    src={contact?.logo || acelogo}
    alt="logo"
    width={40}
    height={40}
    className="w-8 h-8 md:w-10 md:h-10 object-contain"
  />

  <span className="font-semibold text-base sm:text-lg md:text-xl lg:text-2xl text-gray-900 whitespace-nowrap">
    {contact?.websiteTitle}
  </span>
    </div>
  )
}

export default Logo