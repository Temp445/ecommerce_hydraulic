import mongoose, { model, models } from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    Name: { type: String, required: true, unique: true, trim: true },
    CatImage: { type: String, required: true },
  },
  { timestamps: true }
);

const Category = models.Category || model("Category", CategorySchema);

export default Category;
