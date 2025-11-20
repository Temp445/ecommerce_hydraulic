"use client";

import axios from "axios";
import toast from "react-hot-toast";

interface RazorpayPaymentProps {
  user: any;
  cartItems: any[];
  totalAmount: number;
  buildOrderPayload: (status: "Paid", data?: any) => any;
  onSuccess: () => void;
}

const RazorpayPayment = ({
  user,
  cartItems,
  totalAmount,
  buildOrderPayload,
  onSuccess,
}: RazorpayPaymentProps) => {
  const loadRazorpay = () =>
    new Promise<boolean>((resolve) => {
      if (typeof window === "undefined") return resolve(false);
      if ((window as any).Razorpay) return resolve(true);

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const startPayment = async () => {
    const ok = await loadRazorpay();
    if (!ok) return toast.error("Failed to load Razorpay SDK");

    const orderCreate = await axios.post("/api/razorpay/order", {
      amount: totalAmount,
    });

    if (!orderCreate.data?.order)
      return toast.error("Unable to create payment");

    const rzpOrder = orderCreate.data.order;

    const options: any = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: rzpOrder.amount,
      currency: rzpOrder.currency,
      name: "ACE Hydraulic",
      description: "Order Payment",
      order_id: rzpOrder.id,
      handler: async function (res: any) {
        const payload = buildOrderPayload("Paid", {
          orderId: rzpOrder.id,
          paymentId: res.razorpay_payment_id,
          signature: res.razorpay_signature,
        });

        const orderRes = await axios.post("/api/orders", payload);

        if (orderRes.data.success) {
          toast.success("Payment successful!");
          onSuccess();
        } else {
          toast.error("Order failed after payment");
        }
      },
      prefill: {
        name: user?.name || "",
        email: user?.email || "",
        contact: user?.mobile || "",
      },
      theme: { color: "#10b981" },
    };

    const paymentObject = new (window as any).Razorpay(options);
    paymentObject.open();

    paymentObject.on("payment.failed", () => {
      toast.error("Payment failed. Try again.");
    });
  };

  return { startPayment };
};

export default RazorpayPayment;
