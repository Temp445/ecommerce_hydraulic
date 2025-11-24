import mongoose, { model, models } from 'mongoose'

const offerSchema = new mongoose.Schema ({
    title: {type: String},
    subTitle: {type: String},
    btn: {type: String},
    active: {type: Boolean , default: false}
})

const Offer = models.Offer || model('Offer', offerSchema)

export default Offer