const mongoose = require('mongoose')

const deliverySchema = new mongoose.Schema(
  {
    donationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Donation', required: true },
    requestId: { type: mongoose.Schema.Types.ObjectId, ref: 'FoodRequest', required: true },
    volunteerName: { type: String, required: true, trim: true },
    volunteerPhone: { type: String, required: true, trim: true },
    status: { type: String, enum: ['ASSIGNED', 'PICKED_UP', 'DELIVERED'], default: 'ASSIGNED' },
    pickupLocation: { type: String, default: '' },
    deliveryLocation: { type: String, default: '' },
    distance: { type: Number, default: 0 },
    deliveredAt: { type: Date, default: null }
  },
  { timestamps: true }
)

module.exports = mongoose.model('Delivery', deliverySchema)
