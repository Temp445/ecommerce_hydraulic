'use client'

import Link from 'next/link'
import Bg from '@/assets/Bg.png'

const About = () => {
  return (
    <section
      className="relative bg-fixed bg-center bg-cover py-20 text-white"
      style={{
        backgroundImage: `url(${Bg.src})`,
        backgroundAttachment: 'fixed',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
      }}
    >
      <div className="absolute inset-0 bg-black/75"></div>

      <div className="relative container mx-auto px-6 md:px-12 lg:px-20 flex flex-col md:items-start items-center text-left max-w-4xl">
        <div className="w-24 h-1 bg-yellow-500 mb-6 md:mb-8"></div>

        <h2 className="text-2xl md:text-5xl xl:text-6xl font-extrabold leading-tight mb-6 drop-shadow-lg">
          Driving Industry Forward with
          <br  className='hidden lg:block'/> <span className="text-yellow-500">Hydraulic Excellence</span>
        </h2>

        <p className="text-gray-300  md:text-xl leading-relaxed mb-10 max-w-2xl">
          At <span className="font-semibold text-yellow-500">ACE Hydraulics</span>, we
          engineer powerful and reliable hydraulic systems built for modern
          industries. With precision CNC technology and ISO-certified standards,
          our products deliver strength, accuracy, and long-lasting performance.
        </p>

        <Link
          href="/about"
          className="inline-block bg-white text-gray-950 font-medium px-4  py-2 md:px-10 md:py-3 rounded-full transition-transform duration-300 hover:scale-105 hover:bg-yellow-500 shadow-lg"
        >
          Learn More
        </Link>
      </div>
    </section>
  )
}

export default About
