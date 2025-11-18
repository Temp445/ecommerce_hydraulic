
import  mongoose,{models, model} from "mongoose";

const TestimonialSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true, trim: true }, 
    userRole: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true }

  });

const Testimonial = models.Testimonial || model("Testimonial", TestimonialSchema);

export default Testimonial;