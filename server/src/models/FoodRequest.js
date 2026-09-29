const mongoose = require('mongoose')

const requestSchema = new mongoose.Schema(
  {
    requesterName: { type: String, required: true, trim: true },
    organizationName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    foodRequired: { type: String, required: true, trim: true },
    quantityRequired: { type: Number, required: true, min: 1 },
    servingsRequired: { type: Number, required: true, min: 1 },
    address: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    urgency: { type: String, enum: ['Normal', 'Urgent', 'Emergency'], default: 'Normal' },
    description: { type: String, default: '' },
    status: { type: String, enum: ['OPEN', 'MATCHED', 'FULFILLED'], default: 'OPEN' }
  },
  { timestamps: true }
)

module.exports = mongoose.model('FoodRequest', requestSchema)
