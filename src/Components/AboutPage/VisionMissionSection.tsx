    "use client";

    import React from "react";

    const VisionMissionSection = () => {
    return (
        <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-4">
                <h2 className="text-3xl font-light text-gray-900 mb-6">
                Vision &<br />Mission
                </h2>
                <p className="text-sm text-gray-500">
                The principles that drive every decision we make and every cylinder we deliver.
                </p>
            </div>

            <div className="lg:col-span-8 space-y-16">
                <div className="bg-white border border-gray-200 p-8 md:p-12">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-px bg-gray-300"></div>
                    <span className="text-xs font-medium text-gray-400 uppercase tracking-wider"> Our Vision</span>
                </div>
                <p className="text-xl md:text-xl text-gray-900 leading-relaxed">
                    To empower every business with instant access to quality hydraulic cylinders, transforming how industries source critical components through technology and service excellence.
                </p>
                </div>

                <div className="bg-gray-900 text-white p-8 md:p-12">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-px bg-gray-600"></div>
                    <span className="text-xs font-medium text-gray-400 uppercase tracking-wider"> Our Mission</span>
                </div>
                <p className="text-xl md:text-xl leading-relaxed">
                    Connect businesses with the hydraulic cylinders they need through an intuitive platform, comprehensive inventory, transparent pricing, and expert support—delivering reliability in every transaction.
                </p>
                </div>
            </div>
            </div>
        </div>
        </section>
    );
    };

    export default VisionMissionSection;
