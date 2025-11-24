import mongoose, { model, models } from "mongoose";

const BenefitSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const TechnicalDetailsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    value: { type: String, required: true, trim: true}
  },
  { _id: false }
);

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    pathUrl: { type: String, required: true, unique: true, trim: true },
    description: { type: String, required: true, trim: true },

    thumbnail: { type: String },
    images: [{ type: String }],

    price: { type: Number, required: true },
    discountPrice: { type: Number, default: 0 },

    stock: { type: Number},

    model: { type: String, trim: true },
    brand: { type: String, trim: true },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    technicalDetails: [TechnicalDetailsSchema],
    benefits: [BenefitSchema],

    deliveryCharge: { type: Number },
    warranty: { type: String },
    returnPolicy: { type: Boolean, default: false},
    isNewArrival: { type: Boolean, default: false },
    isActive: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Product = models.Product || model("Product", ProductSchema);

export default Product;
