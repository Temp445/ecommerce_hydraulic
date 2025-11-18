import mongoose, { model, models } from "mongoose"

const applicationSchema = new mongoose.Schema({

    title: {type: String, required: true},
    description: {type: String, required: true},
    image: {type: String, required: true}

})

const Application = models.Application || model("Application", applicationSchema)

export default Application