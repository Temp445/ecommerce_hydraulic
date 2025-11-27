import mongoose, { model, models } from "mongoose";

const contactSchema = new mongoose.Schema({
    logo: {type: String, required: true},
    websiteTitle: {type: String, required: true},
    emails:[{type:String}],
    numbers:[{type: String}],
    address:{type: String},
    timing: {type: String},
    youtube: {type: String},
    twitter: {type: String},
    linkedin: {type: String},
    instagram: {type: String},
})

const Contact = models.Contact || model('Contact', contactSchema);

export default Contact