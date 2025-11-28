import mongoose from "mongoose";

const SeoSchema = new mongoose.Schema(
  {
    path: {
      type: String,
      required: true,
      unique: true,
    },

    title: { type: String, required: true },
    description: { type: String, required: true },
    keywords: { type: [String], default: [] },

    ogTitle: { type: String },
    ogDescription: { type: String },

    twitterTitle: { type: String },
    twitterDescription: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Seo || mongoose.model("Seo", SeoSchema);
