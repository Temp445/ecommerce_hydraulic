"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

const IndustryUsage = () => {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/application");
      setApplications(res.data.data || []);
    } catch (err: any) {
      console.error(
        err.response?.data?.message || "Failed to load applications"
      );
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchApplications();
  }, []);

  return (
    <section className=" py-5 md:py-20 bg-gray-100">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className=" text-2xl md:text-4xl font-medium text-gray-900 mb-6  tracking-tight">
          Hydraulic Cylinder
          <br />
          <span className="text-gray-400">Applications</span>
        </h2>

        {!loading && applications.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
            {applications.slice(0, 6).map((app) => (
              <div
                key={app._id}
                className="group relative bg-white rounded-xl overflow-hidden hover:border shadow-md hover:shadow-xl transition-all duration-500"
              >
                <div className="relative  w-full">
                  <img
                    src={app.image || "/placeholder.png"}
                    alt={app.title}
                    className="object-cover h-56 w-full group-hover:scale-110 transition-transform duration-700"
                  />
                </div>

                <div className="p-6 text-center">
                  <h3 className="2xl:text-xl font-semibold text-gray-900 mb-3 transition-colors">
                    {app.title}
                  </h3>
                  <p className="text-gray-600 text-xs 2xl:text-sm leading-relaxed">
                    {app.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
        {!loading && applications.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-600 text-base">No Applications found</p>
          </div>
        )}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 ">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="flex flex-col  bg-white rounded-xl overflow-hidden  shadow-md"
              >
                <div className="bg-gray-300 h-56 w-full animate-pulse"></div>
                <div className="p-6 text-center">
                  <div className="h-6 bg-gray-300 rounded w-3/4 mx-auto mb-3 animate-pulse"></div>
                  <div className="h-4 bg-gray-300 rounded w-full mx-auto animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default IndustryUsage;
