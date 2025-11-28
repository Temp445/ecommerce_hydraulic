    
    const VisionMissionSection = ({ content }: { content: any }) => {
    return (
        <section className=" py-5 md:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
            <div className="lg:col-span-4">
                <h2 className=" text-xl md:text-3xl font-light text-gray-900 mb-6">
                {content?.vision?.Heading}
                </h2>
                <p className="text-sm text-gray-500">
                {content?.vision?.description}
                </p>
            </div>

            <div className="lg:col-span-8 space-y-5 md:space-y-16">
                <div className="bg-white border border-gray-200 p-8 md:p-12">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-px bg-gray-300"></div>
                    <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">{content?.vision?.visionTitle}</span>
                </div>
                <p className="text-sm md:text-xl text-gray-900 leading-relaxed">
                    {content?.vision?.visionDesc}
                </p>
                </div>

                <div className="bg-gray-900 text-white p-8 md:p-12">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-px bg-gray-600"></div>
                    <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">{content?.vision?.missionTitle}</span>
                </div>
                <p className="text-sm md:text-xl leading-relaxed">
                    {content?.vision?.missionDesc}
                 </p>
                </div>
            </div>
            </div>
        </div>
        </section>
    );
    };

    export default VisionMissionSection;
