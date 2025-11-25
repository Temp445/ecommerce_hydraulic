import mongoose, { model, models } from "mongoose";

const heroSchema = new mongoose.Schema({
    title: { type: String , required: true},
    subTitle: { type: String, required: true},
    description: {type: String, required: true},
    note: {type: String},
    heroImage: {type: String}
})

const Hero = models.Hero || model('Hero', heroSchema)

export default Hero