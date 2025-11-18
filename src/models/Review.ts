import mongoose, { Schema, model, models } from "mongoose";


const ReviewSchema = new mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    orderId: {
      type: Schema.Types.ObjectId,
      ref: "Order",
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    title: {
      type: String,
      trim: true,
      maxlength: 100,
    },

    comment: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },

    images: [
      {
        type: String,
      },
    ],

    isVerifiedPurchase: {
      type: Boolean,
      default: false,
    }

  },
  { timestamps: true}
);

ReviewSchema.index({ userId: 1, productId: 1 }, { unique: true });

const Review = models.Review || model("Review", ReviewSchema);

export default Review;
