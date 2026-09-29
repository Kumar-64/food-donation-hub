require('dotenv').config()
const mongoose = require('mongoose')
const connectDB = require('../src/config/db')
const Donation = require('../src/models/Donation')
const FoodRequest = require('../src/models/FoodRequest')
const Delivery = require('../src/models/Delivery')

const donations = [
  ['Green Leaf Cafe', '9876500001', 'Veg Rice Meal', 'Cooked Food', 30, 30, 'FC Road, Pune', 'Pune', 18.5196, 73.8553],
  ['Hotel Sunrise', '9876500002', 'Paneer Curry Pack', 'Cooked Food', 24, 24, 'Baner, Pune', 'Pune', 18.559, 73.7868],
  ['Sweet Bowl Bakery', '9876500003', 'Bread and Rolls', 'Bakery', 80, 120, 'Kothrud, Pune', 'Pune', 18.5074, 73.8077],
  ['Fruit Basket Store', '9876500004', 'Mixed Fruits', 'Fruits', 40, 60, 'Shivajinagar, Pune', 'Pune', 18.5308, 73.8476],
  ['Spice Junction', '9876500005', 'Veg Biryani', 'Cooked Food', 35, 50, 'Wakad, Pune', 'Pune', 18.599, 73.7647],
  ['Community Kitchen', '9876500006', 'Khichdi Pack', 'Cooked Food', 50, 50, 'Hadapsar, Pune', 'Pune', 18.5089, 73.9275],
  ['Fresh Farm Mart', '9876500007', 'Seasonal Vegetables', 'Vegetables', 60, 90, 'Aundh, Pune', 'Pune', 18.5635, 73.8070],
  ['Curry Point', '9876500008', 'Dal Rice', 'Cooked Food', 28, 35, 'Camp, Pune', 'Pune', 18.5195, 73.8789],
  ['Healthy Bites', '9876500009', 'Fruit Salad Cups', 'Fruits', 22, 22, 'Viman Nagar, Pune', 'Pune', 18.5679, 73.9143],
  ['Packaged Foods Hub', '9876500010', 'Biscuits and Snacks', 'Packaged Food', 100, 140, 'Magarpatta, Pune', 'Pune', 18.5150, 73.9340]
].map(([donorName, phone, foodName, category, quantity, servings, pickupAddress, city, latitude, longitude], index) => ({
  donorName,
  phone,
  foodName,
  category,
  quantity,
  servings,
  preparationTime: new Date(Date.now() - (index + 1) * 45 * 60 * 1000),
  expiryTime: new Date(Date.now() + (index + 4) * 60 * 60 * 1000),
  pickupAddress,
  city,
  latitude,
  longitude,
  image: '',
  description: 'Demo donation for FoodBridge',
  status: index < 7 ? 'AVAILABLE' : 'MATCHED'
}))

const requests = [
  ['Asha Trust', 'Helping Hands NGO', '9876600001', 'Cooked Food', 30, 30, 'Shivajinagar Shelter, Pune', 'Pune', 18.5308, 73.8476, 'Urgent'],
  ['Rising Hope', 'Rising Hope Home', '9876600002', 'Fruits', 20, 20, 'Kothrud Home, Pune', 'Pune', 18.5074, 73.8077, 'Normal'],
  ['Balaji Seva', 'Balaji Seva Sanstha', '9876600003', 'Vegetables', 40, 60, 'Hadapsar Center, Pune', 'Pune', 18.5089, 73.9275, 'Urgent'],
  ['Little Stars', 'Little Stars Orphanage', '9876600004', 'Packaged Food', 50, 70, 'Wakad Home, Pune', 'Pune', 18.5990, 73.7647, 'Normal'],
  ['Sai Welfare', 'Sai Welfare Club', '9876600005', 'Cooked Food', 25, 25, 'Camp Outreach, Pune', 'Pune', 18.5195, 73.8789, 'Emergency']
].map(([requesterName, organizationName, phone, foodRequired, quantityRequired, servingsRequired, address, city, latitude, longitude, urgency]) => ({
  requesterName,
  organizationName,
  phone,
  foodRequired,
  quantityRequired,
  servingsRequired,
  address,
  city,
  latitude,
  longitude,
  urgency,
  description: 'Demo request for FoodBridge',
  status: 'OPEN'
}))

async function seed() {
  await connectDB()
  await Promise.all([
    Donation.deleteMany({}),
    FoodRequest.deleteMany({}),
    Delivery.deleteMany({})
  ])

  const createdDonations = await Donation.insertMany(donations)
  const createdRequests = await FoodRequest.insertMany(requests)

  const deliveries = []
  for (let index = 0; index < 5; index += 1) {
    deliveries.push({
      donationId: createdDonations[index]._id,
      requestId: createdRequests[index]._id,
      volunteerName: `Volunteer ${index + 1}`,
      volunteerPhone: `98767000${String(index + 1).padStart(2, '0')}`,
      status: index < 3 ? 'DELIVERED' : 'ASSIGNED',
      pickupLocation: createdDonations[index].pickupAddress,
      deliveryLocation: createdRequests[index].address,
      distance: Number((1.5 + index * 0.8).toFixed(2)),
      deliveredAt: index < 3 ? new Date(Date.now() - (index + 1) * 2 * 60 * 60 * 1000) : null
    })
  }

  await Delivery.insertMany(deliveries)

  createdDonations.slice(0, 3).forEach((donation, index) => {
    donation.status = index < 2 ? 'MATCHED' : 'ASSIGNED'
  })
  createdRequests.slice(0, 3).forEach((request) => {
    request.status = 'MATCHED'
  })
  await Promise.all([...createdDonations.slice(0, 3), ...createdRequests.slice(0, 3)].map((item) => item.save()))

  console.log('Seed data created successfully.')
  console.log('Created 10 donations, 5 requests, and 5 deliveries.')
  await mongoose.disconnect()
}

seed().catch(async (error) => {
  console.error('Seed failed:', error)
  await mongoose.disconnect()
  process.exit(1)
})
