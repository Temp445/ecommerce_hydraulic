// ContactForm 

"use client";
import { useState, useEffect, useRef, FormEvent } from "react";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import emailjs from "@emailjs/browser";
import toast from "react-hot-toast";

const service_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "";
const template_ID = process.env.NEXT_PUBLIC_EMAILJS_ENQ_TEMPLATE_ID || "";
const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "";

const endpoint = "/api/proxy-validate-email";

const ContactForm = () => {
  const formRef = useRef<HTMLFormElement>(null);

  const [formType, setFormType] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phone, setPhone] = useState<string>();
  const [phoneError, setPhoneError] = useState("");
  const [orderId, setOrderId] = useState("");
  const [orderProducts, setOrderProducts] = useState<any[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [orderError, setOrderError] = useState("");
  const [sending, setSending] = useState(false);

  const validateEmail = async (email: string): Promise<string> => {
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.status !== 200) return "Invalid Email";

      const data = await res.json();
      return data.isValid ? "" : "Invalid Email Address";
    } catch {
      return "Validation unavailable";
    }
  };

  useEffect(() => {
    if (!orderId || orderId.trim().length < 5) {
      setOrderProducts([]);
      setOrderError("");
      return;
    }

    const delayFetch = setTimeout(async () => {
      try {
        setOrderError("");

        const response = await fetch(`/api/orders/${orderId}`);

        if (!response.ok) {
          setOrderProducts([]);
          setOrderError("Order not found");
          return;
        }

        const data = await response.json();
        setOrderProducts(data.items || []);
      } catch {
        setOrderError("Error fetching order");
      }
    }, 500);

    return () => clearTimeout(delayFetch);
  }, [orderId]);

  const toggleProductSelect = (productName: string) => {
    setSelectedProducts((prev) =>
      prev.includes(productName)
        ? prev.filter((p) => p !== productName)
        : [...prev, productName]
    );
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = formRef.current;
    if (!form) return;

    if (!phone || !isValidPhoneNumber(phone)) {
      setPhoneError("Enter a valid phone number");
      return;
    }
    setPhoneError("");

    const emailValidationMsg = await validateEmail(email);
    if (emailValidationMsg) {
      setEmailError(emailValidationMsg);
      return;
    }
    setEmailError("");

    setSending(true);

    const formData = {
      fullName: (form["fullName"] as HTMLInputElement).value,
      email,
      phone,
      formType,
      companyName: (form["companyName"] as HTMLInputElement)?.value || "",
      product: (form["product"] as HTMLInputElement)?.value || "",
      message: (form["message"] as HTMLTextAreaElement)?.value || "",
      orderId,
      selectedProducts: selectedProducts.join(", "),
      issueMessage: (form["issueMessage"] as HTMLTextAreaElement)?.value || "",
      Originate_From: "Hydraulic",
    };

    try {
      await emailjs.send(service_ID, template_ID, formData, publicKey);

      toast.success("Your enquiry has been sent successfully!");

      form.reset();
      setEmail("");
      setPhone("");
      setOrderId("");
      setOrderProducts([]);
      setSelectedProducts([]);
      setFormType("");
    } catch (error) {
      toast.error("Failed to send. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-lg border border-gray-200 p-6 md:p-8 rounded-xl">
      <h2 className="text-xl md:text-2xl font-medium mb-6">Contact / Support Form</h2>

      <form ref={formRef} onSubmit={handleSubmit} className="grid gap-5">
        <div>
          <label className="block mb-1 font-medium">Full Name *</label>
          <input
            required
            name="fullName"
            className="w-full p-3 border rounded-lg"
            placeholder="Enter your name"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Email *</label>
          <input
            required
            name="email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailError("");
            }}
            className="w-full p-3 border rounded-lg"
            placeholder="Enter your email"
          />
          {emailError && <p className="text-red-600 text-sm">{emailError}</p>}
        </div>

        <div>
          <label className="block mb-1 font-medium">Mobile Number *</label>
          <PhoneInput
            international
            defaultCountry="IN"
            value={phone}
            onChange={setPhone}
            className="rounded-lg border p-2  [&>input]:border-none [&>input]:outline-none [&>input]:bg-transparent"
          />
          {phoneError && <p className="text-red-600">{phoneError}</p>}
        </div>

        <div>
          <label className="block mb-1 font-medium">Select Option *</label>
          <select
            required
            value={formType}
            onChange={(e) => setFormType(e.target.value)}
            className="w-full p-3 border rounded-lg"
          >
            <option value="">-- Select Option --</option>
            <option value="Product Quote / Pricing">
              Product Quote / Pricing
            </option>
            <option value="Delivery Issue">Delivery Issue</option>
            <option value="Refund Issue">Refund Issue</option>
          </select>
        </div>

        {formType === "Product Quote / Pricing" && (
          <>
            <div>
              <label className="block mb-1 font-medium">Company Name</label>
              <input
                name="companyName"
                className="w-full p-3 border rounded-lg"
                placeholder="Your company"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">
                Product Interested *
              </label>
              <input
                required
                name="product"
                className="w-full p-3 border rounded-lg"
                placeholder="Hydraulic Cylinder"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Message</label>
              <textarea
                name="message"
                rows={3}
                className="w-full p-3 border rounded-lg"
                placeholder="Enter your message"
              ></textarea>
            </div>
          </>
        )}

        {(formType === "Delivery Issue" || formType === "Refund Issue") && (
          <>
            <div>
              <label className="block mb-1 font-medium">Order ID *</label>
              <input
                required
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="w-full p-3 border rounded-lg"
                placeholder="Enter your order ID"
              />
              {orderError && (
                <p className="text-red-600 text-sm">{orderError}</p>
              )}
              
            </div>

            {orderProducts.length > 0 && (
              <div className="border p-4 rounded-lg mt-2">
                <h3 className="font-medium mb-3">
                  Select product with issue *
                </h3>

                {orderProducts.map((item: any, index: number) => (
                  <label key={index} className="flex items-center gap-2 mb-2">
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(item.productName)}
                      onChange={() => toggleProductSelect(item.productName)}
                    />
                    <span>{item.productName}</span>
                  </label>
                ))}
              </div>
            )}

            <div>
              <label className="block mb-1 font-medium">
                Describe the Issue *
              </label>
              <textarea
                required
                name="issueMessage"
                rows={4}
                className="w-full p-3 border rounded-lg"
                placeholder="Explain your issue..."
              ></textarea>
            </div>
          </>
        )}

        <button
          disabled={sending}
          className="w-full bg-black text-white py-3 rounded-lg text-lg font-semibold disabled:opacity-60"
        >
          {sending ? "Sending..." : "Submit"}
        </button>
      </form>
    </div>
  );
}

export default ContactForm