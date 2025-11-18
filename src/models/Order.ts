import mongoose, {Schema, model, models } from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    productName: { type: String, required: true },
    productImage: { type: String },
    quantity: { type: Number, required: true, min: 1 },
    priceAtPurchase: { type: Number, required: true },
    discountPriceAtPurchase: { type: Number, default: 0 },
    deliveryCharge: { type: Number, default: 0 },

    orderStatus: {
      type: String,
      enum: ["Processing","Packed", "Shipped", "Out for Delivery", "Delivered", "Cancelled", "Refunded"],
      default: "Processing",
    },
      itemPaymentStatus: {
      type: String,
      enum: ["Paid", "Pending", "Refunded", "Cancelled"],
      default: "Pending",
    },
    razorpayPaymentId: { type: String, default: null },
    razorpayRefundId: { type: String, default: null },
    itemRefundAmount: { type: Number, default: 0 },
    refundedAt: { type: Date },

    trackingId: { type: String, default: null },
    courierPartner: { type: String, default: null },
    expectedDelivery: { type: Date },
    deliveredAt: { type: Date },
    cancelledAt: { type: Date },
    cancelReason: { type: String },
  }
);

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

     items: [orderItemSchema],

      shippingAddress: {
      Name: { type: String, required: true },
      MobileNumber: { type: String, required: true },
      PinCode: { type: Number, required: true },
      Address: { type: String, required: true },
      City: { type: String, required: true },
      LandMark: { type: String },
      State: { type: String },
      Country: { type: String },
    },
    totalAmount: { type: Number, required: true },

    paymentMethod: {
      type: String,
      enum: ["COD", "Online"],
      default: "COD",
    },
    paymentStatus: {
      type: String,
      enum: ["Paid", "Pending", "Failed"],
      default: "Pending",
    },
    razorpayOrderId: { type: String, default: null },
    razorpayPaymentId: { type: String, default: null },  
    razorpaySignature: { type: String, default: null },
    orderDate: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

const Order = models.Order || model("Order", orderSchema);
export default Order;
