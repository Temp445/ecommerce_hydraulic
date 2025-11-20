const ShippingPolicyPage = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Shipping Policy</h1>

      <section className="space-y-4 text-gray-700">
        <p>
          Thank you for shopping with us. This Shipping Policy explains how we
          process, ship, and deliver orders for hydraulic cylinders and related
          industrial products.
        </p>

        <h2 className="text-xl font-semibold">1. Order Processing Time</h2>
        <p>
          All orders are processed within <strong>2–5 business days</strong>.  
          Orders placed on weekends or public holidays will be processed on the next business day.
        </p>

        <h2 className="text-xl font-semibold">2. Shipping Time</h2>
        <p>
          Once dispatched, deliveries usually reach customers within  
          <strong>5–10 business days</strong>, depending on your location,
          courier service availability, and transit conditions.
        </p>

        <h2 className="text-xl font-semibold">3. Shipping Charges</h2>
        <p>
          Shipping fees may vary based on product size, weight, and destination.  
          Final shipping charges will be shown at checkout.
        </p>

        <h2 className="text-xl font-semibold">4. Order Tracking</h2>
        <p>
          Tracking details will be shared via email or SMS once your order is dispatched.
          You can use the tracking link to view the live delivery status.
        </p>

        <h2 className="text-xl font-semibold">5. Delivery Delays</h2>
        <p>
          Delays may occur due to:
        </p>
        <ul className="list-disc list-inside space-y-1">
          <li>Unexpected courier network issues</li>
          <li>Weather or natural disruptions</li>
          <li>Remote delivery locations</li>
          <li>High order volumes</li>
        </ul>
        <p>
          We do not take responsibility for delays caused by courier partners,
          but we will assist you in tracking and resolving issues.
        </p>

        <h2 className="text-xl font-semibold">6. Incorrect Address</h2>
        <p>
          Customers must provide accurate delivery details.  
          Orders returned due to incorrect or incomplete addresses may incur additional reshipping charges.
        </p>

        <h2 className="text-xl font-semibold">7. Damaged or Lost Packages</h2>
        <p>
          If your package arrives damaged or does not arrive within the expected time,
          please contact us within <strong>48 hours</strong>.
        </p>
        <p>
          We will coordinate with the courier to investigate and provide a resolution.
        </p>

        <h2 className="text-xl font-semibold">8. International Shipping</h2>
        <p>
          At the moment, we only ship within India.  
          International delivery options will be added soon.
        </p>

        <h2 className="text-xl font-semibold">9. Contact Us</h2>
        <p>
          For any questions related to shipping, feel free to contact us at:
        </p>
        <p className="font-medium">support@yourdomain.com</p>
      </section>
    </div>
  );
};

export default ShippingPolicyPage;
