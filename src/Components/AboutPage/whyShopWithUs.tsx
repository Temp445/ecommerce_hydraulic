import { ShieldCheck, Truck, IndianRupee, PackageCheck, Award, Users } from 'lucide-react';

export default function WhyShopWithUs() {
  const features = [
    {
      icon: ShieldCheck,
      title: "Quality Guaranteed",
      desc: "ISO certified products with rigorous quality checks.",
    },
    {
      icon: Truck,
      title: "Fast Delivery",
      desc: "5-7 business days standard. Express shipping available.",
    },
    {
      icon: IndianRupee,
      title: "Best Prices",
      desc: "Competitive pricing with bulk discounts included.",
    },
    {
      icon: PackageCheck,
      title: "Secure Checkout",
      desc: "Safe and encrypted payment methods for all transactions.",
    },
    {
      icon: Award,
      title: "Warranty",
      desc: "Official manufacturer warranty on all products.",
    },
    {
      icon: Users,
      title: "Expert Support",
      desc: "Available via phone, email, and WhatsApp.",
    },
  ];

  return (
    <section className="w-full bg-white py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-0">
        <div className="mb-20">
          <h2 className="text-2xl md:text-5xl  text-gray-900 mb-2">
            Why Shop With Us?
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div key={i} className="flex gap-6">
                <div className="flex-shrink-0">
                  <Icon className="w-6 h-6 text-gray-900 mt-1" />
                </div>

                <div className="flex-1">
                  <h3 className="text-xl text-gray-900 mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {feature.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}