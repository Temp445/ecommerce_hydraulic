"use client";

import { motion } from "framer-motion";

const Offer = () => {
  return (
    <div className="bg-white">
        <section className="relative bg-gray-950 text-white py-20 text-center px-6 rounded-3xl mx-4 overflow-hidden">
      <motion.div
        className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_#fff_1px,_transparent_1px)] bg-[size:20px_20px]"
        animate={{ backgroundPosition: ["0px 0px", "20px 20px"] }}
        transition={{ repeat: Infinity, duration: 5, ease: "linear" }}
      />

      <div className="relative z-10 max-w-3xl mx-auto">
        <h2 className=" text-lg md:text-3xl xl:text-4xl  mb-4 leading-tight">
          Save <span className="text-yellow-300">15%</span> on Bulk Orders
        </h2>
        <p className="text-sm md:text-lg text-blue-100 mb-8">
         Experience top-performance hydraulic systems built for reliability, precision, and efficiency. Don’t miss this exclusive offer!
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className=" px-4 py-2 md:px-8 md:py-3 bg-white text-black font-medium rounded-full shadow-md"
          onClick={() => alert("Offer claimed! Our team will contact you soon.")}
        >
          Contact Us
        </motion.button>

        <p className="mt-4 text-sm text-blue-200">
          *Free consultation available for industrial clients only.
        </p>
      </div>
    </section>
    </div>
  
  );
}

export default Offer