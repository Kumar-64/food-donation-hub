const mongoose = require('mongoose')

const donationSchema = new mongoose.Schema(
  {
    donorName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    foodName: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: ['Cooked Food', 'Rice', 'Vegetables', 'Fruits', 'Bakery', 'Packaged Food', 'Other']
    },
    quantity: { type: Number, required: true, min: 1 },
    servings: { type: Number, required: true, min: 1 },
    preparationTime: { type: Date, required: true },
    expiryTime: { type: Date, required: true },
    pickupAddress: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    image: { type: String, default: '' },
    description: { type: String, default: '' },
    status: {
      type: String,
      enum: ['AVAILABLE', 'MATCHED', 'ASSIGNED', 'PICKED_UP', 'DELIVERED', 'EXPIRED'],
      default: 'AVAILABLE'
    }
  },
  { timestamps: true }
)

module.exports = mongoose.model('Donation', donationSchema)
