import mongoose, { model, models } from "mongoose";

const landingPageSchema = new mongoose.Schema({
  // Hero Section
  hero: {
    title: { type: String, required: true },
    subTitle: { type: String, required: true },
    description: { type: String, required: true },
    note: { type: String },
    heroImage: { type: String, required: true },
  },

  // Offer Section
  offer: {
    title: { type: String },
    description: { type: String },
    note: { type: String },
    active: { type: Boolean, default: false },
  },

// about Section
  about: {
    title: { type: String, required: true },
    subTitle: { type: String, required: true },
    description: { type: String, required: true },
    bgImage: { type: String },
  },

  // Section Headings
  sectionHeadings: {
    categories: { type: String, default: "Shop by Category" },
    newArrivals: { type: String, default: "New Arrivals" },
    newArrivalsTag:{type: String, default: "New"},
    popularProducts: { type: String, default: "Popular Products" },
    testimonials: { type: String, default: "Testimonials" },
    testimonialsSubtitle: { type: String, default: "What Our Clients Say" },
    testimonialsDesc: { type: String, default: "Trusted by industry leaders for precision hydraulic solutions" },
    Applications: { type: String, default: "Applications" },
    blog: { type: String, default: "Blog" },
    blogSubtitle: {type: String}
  } 

}, { timestamps: true });

const LandingPage = models.LandingPage || model("LandingPage", landingPageSchema);

export default LandingPage;
