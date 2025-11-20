
const PolicyPage = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold mb-6">Our Policy</h1>

      <section>
        <h2 className="text-xl font-semibold mb-2">1. Shipping Policy</h2>
        <p className="text-gray-700">
          We ship all Hydraulic Cylinders within <strong>2–5 business days</strong> after order confirmation.
          Heavy-weight items may require special logistics, and our team will contact you if needed.
          Delivery timeline is usually <strong>5–10 business days</strong>.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">2. Return & Refund Policy</h2>
        <p className="text-gray-700">
          Returns are accepted only for damaged, defective, or wrongly delivered products.
          Customers must report issues within <strong>48 hours</strong> of delivery with photo or video proof.
          Used, installed, or physically damaged products are not eligible for return.
          Refunds are processed within <strong>5–7 business days</strong> after verification.
        </p>
      </section>

      {/* Cancellation Policy */}
      <section>
        <h2 className="text-xl font-semibold mb-2">3. Cancellation Policy</h2>
        <p className="text-gray-700">
          Orders can be cancelled <strong>before dispatch</strong>. Once shipped, cancellation is not possible due
          to heavy logistics. COD customers with repeated cancellations may face restrictions.
        </p>
      </section>

      {/* Warranty Policy */}
      <section>
        <h2 className="text-xl font-semibold mb-2">4. Warranty Policy</h2>
        <p className="text-gray-700">
          All Hydraulic Cylinders come with a manufacturer warranty (if mentioned on the product page).
          Warranty covers <strong>manufacturing defects only</strong>. Improper installation, misuse, or overload
          is not covered.
        </p>
      </section>

      {/* Product Guarantee */}
      <section>
        <h2 className="text-xl font-semibold mb-2">5. Product Guarantee</h2>
        <p className="text-gray-700">
          All products are genuine and industry-grade. Specifications such as tonnage, stroke length, bore
          size, and pressure rating are clearly mentioned. Customers must check compatibility before purchasing.
        </p>
      </section>

      {/* Privacy Policy */}
      <section>
        <h2 className="text-xl font-semibold mb-2">6. Privacy Policy</h2>
        <p className="text-gray-700">
          We value your privacy and do not share personal information with third parties except for delivery
          and verification. Payment details are encrypted and handled by secure payment gateways.
        </p>
      </section>

      {/* Payment Policy */}
      <section>
        <h2 className="text-xl font-semibold mb-2">7. Payment Policy</h2>
        <p className="text-gray-700">
          We accept Online Payments and Cash on Delivery (COD in selected locations). Online payments are
          securely processed through certified payment providers. COD may include extra handling charges.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">8. Safety & Installation Disclaimer</h2>
        <p className="text-gray-700">
          Hydraulic Cylinders must be installed by trained professionals. Incorrect installation may cause
          equipment failure or injury. The company is not responsible for damages caused by improper handling.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">9. Contact Us</h2>
        <p className="text-gray-700">Email: support@hydraulic.com</p>
        <p className="text-gray-700">Phone: +91 7339139431</p>
        <p className="text-gray-700">Address: Your Company Address Here</p>
      </section>
    </div>
  );
}

export default PolicyPage