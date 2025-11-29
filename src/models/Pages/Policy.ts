import mongoose, { model, models } from "mongoose";

const PolicySchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    unique: true,
  },
  
  title: { type: String, required: true },
  shortDescription: {type: String,required: true},
  effectiveDate: {type: String},
  content: { type: String, required: true },
  updatedAt: { type: Date, default: Date.now },
});

const Policy = models.Policy || model("Policy", PolicySchema);

export default Policy