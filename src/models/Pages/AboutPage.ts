import mongoose, { model, models } from "mongoose";

const aboutPageSchema = new mongoose.Schema({
  hero: {
    title: { type: String },
    subTitle: { type: String },
    description: { type: String },
    note: { type: String },
  },

  WhyChooseUs: {
    title: { type: String },
    subTitle: { type: String },

    stats: {
      clients: {
        label: { type: String },
        value: { type: String },
      },
      satisfaction: {
        label: { type: String },
        value: { type: String },
      },
    },

    features: [
      {
        title: { type: String },
        subTitle: { type: String },
        description: { type: String },
      },
    ],

    values: [
      {
        title: { type: String },
        value: { type: String },
        description: { type: String },
      },
    ],
  },

  vision: {
    Heading: { type: String },
    description: { type: String },
    visionTitle: { type: String },
    visionDesc: { type: String },
    missionTitle: { type: String },
    missionDesc: { type: String },
  },

  process: {
    Heading: { type: String },
    features: [
      {
        title: { type: String },
        subTitle: { type: String },
      },
    ],
  },

  shopUs: {
    Heading: { type: String },
    features: [
      {
        title: { type: String },
        subTitle: { type: String },
      },
    ],
    bannerTitle: { type: String },
    bannerDesc: { type: String },
  },
})

const AboutPage = models.AboutPage || model('AboutPage', aboutPageSchema)

export default AboutPage