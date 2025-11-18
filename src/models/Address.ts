import mongoose, { model, models } from "mongoose"

const addressSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    Name: {type: String, required: true, trim: true},
    MobileNumber: {type: String, required: true},
    PinCode: {type: Number, required: true},
    Address: {type: String, required: true},
    City: {type: String, required: true},
    LandMark: {type: String},
    State: {type: String},
    Country: {type: String},
},
{ timestamps: true }
)
 
const Address = models.Address || model("Address", addressSchema);

export default Address