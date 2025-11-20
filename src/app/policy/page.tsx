const PrivacyPolicyPage = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Privacy Policy</h1>

      <section className="space-y-4 text-gray-700">
        <p>
          This Privacy Policy explains how we collect, use, and protect your
          personal information when you visit our website or purchase hydraulic
          cylinders and related products from our store.
        </p>

        <h2 className="text-xl font-semibold">1. Information We Collect</h2>
        <p>We collect the following types of information:</p>
        <ul className="list-disc list-inside space-y-1">
          <li><strong>Personal Details:</strong> Name, email, phone number, billing & shipping address.</li>
          <li><strong>Order Information:</strong> Product details, payment status, purchase history.</li>
          <li><strong>Technical Data:</strong> IP address, browser type, device information.</li>
          <li><strong>Payment Information:</strong> Collected securely via payment gateways. We do not store card/UPI details.</li>
        </ul>

        <h2 className="text-xl font-semibold">2. How We Use Your Information</h2>
        <p>We use your data for the following purposes:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>To process and deliver your orders</li>
          <li>To provide order updates and shipping notifications</li>
          <li>To improve our website performance and user experience</li>
          <li>To communicate regarding support, service updates, or offers</li>
          <li>To prevent fraud or unauthorized transactions</li>
        </ul>

        <h2 className="text-xl font-semibold">3. Sharing Your Information</h2>
        <p>
          We do not sell or trade your personal information.  
          However, we may share it with:
        </p>
        <ul className="list-disc list-inside space-y-1">
          <li><strong>Courier partners</strong> for delivery</li>
          <li><strong>Payment gateways</strong> for secure transaction processing</li>
          <li><strong>Technical service providers</strong> for website hosting or analytics</li>
        </ul>
        <p>
          All third-party partners follow strict data protection standards.
        </p>

        <h2 className="text-xl font-semibold">4. Cookies & Tracking</h2>
        <p>
          Our website uses cookies to enhance your browsing experience by
          remembering preferences, improving performance, and analyzing site traffic.
        </p>
        <p>
          You may disable cookies through your browser settings, but it may affect
          website functionality.
        </p>

        <h2 className="text-xl font-semibold">5. Data Security</h2>
        <p>
          We implement industry-standard security measures to protect your personal
          information from unauthorized access, misuse, or disclosure.
        </p>
        <p>
          While we strive for maximum security, no online platform can guarantee
          100% protection.
        </p>

        <h2 className="text-xl font-semibold">6. Your Rights</h2>
        <p>You have the right to:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Access your personal data</li>
          <li>Request corrections or updates</li>
          <li>Request data deletion (where applicable)</li>
          <li>Withdraw consent for marketing communication</li>
        </ul>

        <h2 className="text-xl font-semibold">7. Third-Party Links</h2>
        <p>
          Our website may contain links to external sites.  
          We are not responsible for their content, privacy practices, or policies.
        </p>

        <h2 className="text-xl font-semibold">8. Updates to This Policy</h2>
        <p>
          We may update this Privacy Policy periodically.  
          Changes will be posted on this page with a revised effective date.
        </p>

        <h2 className="text-xl font-semibold">9. Contact Us</h2>
        <p>
          For questions, concerns, or data-related requests, contact us at:
        </p>
        <p className="font-medium">support@yourdomain.com</p>
      </section>
    </div>
  );
};

export default PrivacyPolicyPage;
