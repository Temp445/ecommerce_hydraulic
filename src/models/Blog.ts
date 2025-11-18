import mongoose, { model, models } from "mongoose";

const BlogSchema = new mongoose.Schema({
  title: {type: String, required: true},
  slug: { type: String, unique: true },
  shortDescription: {type: String,required: true},
  imageUrl: {type: String, required: true},
  content: String,
  createdAt: { type: Date, default: Date.now },
});

const Blog =  models.Blog || model("Blog", BlogSchema);

export default Blog;
