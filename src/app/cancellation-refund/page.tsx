const CancellationRefundPage = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Cancellation & Refund Policy</h1>

      <section className="space-y-4 text-gray-700">
        <p>
          This Cancellation & Refund Policy explains how order cancellations,
          returns, and refunds are handled for hydraulic cylinders and other
          industrial products purchased from our store.
        </p>

        <h2 className="text-xl font-semibold">1. Order Cancellation</h2>
        <p>
          Customers may cancel their order <strong>before the order is dispatched</strong>.
        </p>
        <p>
          Once the order is shipped, cancellation is no longer possible.
        </p>
        <p>
          For prepaid orders, refunds will be initiated after successful cancellation.
        </p>

        <h2 className="text-xl font-semibold">2. Return Eligibility</h2>
        <p>Returns are accepted only under the following conditions:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Product received is damaged</li>
          <li>Product received is defective or not functioning properly</li>
          <li>Incorrect item delivered</li>
        </ul>
        <p>
          All return requests must be reported within <strong>48 hours</strong> of delivery.
        </p>

        <h2 className="text-xl font-semibold">3. Non-Returnable Items</h2>
        <p>The following items cannot be returned or refunded:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Used, installed, or tampered products</li>
          <li>Custom-made or special-order hydraulic components</li>
          <li>Items damaged due to improper handling by the customer</li>
        </ul>

        <h2 className="text-xl font-semibold">4. Inspection & Verification</h2>
        <p>
          Returned products will undergo inspection to verify the reported issue.
          Refund approval will be provided only after successful verification.
        </p>

        <h2 className="text-xl font-semibold">5. Refund Processing</h2>
        <p>
          Approved refunds will be processed within
          <strong> 5–7 business days</strong>.
        </p>
        <p>
          Refunds for prepaid orders will be credited to the original mode of payment.
        </p>
        <p>
          Cash on Delivery (COD) refunds will be processed via bank transfer or UPI.
        </p>

        <h2 className="text-xl font-semibold">6. Replacement Policy</h2>
        <p>
          If eligible, customers may choose a replacement instead of a refund.
        </p>
        <p>
          Replacement shipping will be arranged once the returned item is received
          and inspected.
        </p>

        <h2 className="text-xl font-semibold">7. Wrong Address or Failed Delivery</h2>
        <p>
          If the order fails to deliver due to an incorrect address or unavailability
          of the customer, reshipping charges may apply.
        </p>

        <h2 className="text-xl font-semibold">8. Contact Us</h2>
        <p>
          For cancellations, refund status, or return assistance, contact us at:
        </p>
        <p className="font-medium">support@hydraulic.com</p>
      </section>
    </div>
  );
};

export default CancellationRefundPage;
