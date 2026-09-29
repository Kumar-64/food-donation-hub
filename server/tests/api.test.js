jest.mock('../src/models/User', () => ({
  findOne: jest.fn(),
  create: jest.fn(),
  findById: jest.fn(),
  find: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  countDocuments: jest.fn()
}))

jest.mock('../src/models/Donation', () => ({
  create: jest.fn(),
  find: jest.fn(),
  findById: jest.fn(),
  countDocuments: jest.fn()
}))

jest.mock('../src/models/FoodRequest', () => ({
  create: jest.fn(),
  find: jest.fn(),
  findById: jest.fn(),
  countDocuments: jest.fn()
}))

jest.mock('../src/models/Delivery', () => ({
  create: jest.fn(),
  find: jest.fn(),
  findById: jest.fn(),
  countDocuments: jest.fn()
}))

jest.mock('../src/models/Match', () => ({
  create: jest.fn(),
  find: jest.fn(),
  countDocuments: jest.fn()
}))

jest.mock('../src/services/notificationService', () => ({
  createNotification: jest.fn(),
  createBulkNotifications: jest.fn()
}))

jest.mock('../src/services/uploadService', () => ({
  storeImage: jest.fn().mockResolvedValue('/uploads/demo.jpg')
}))

jest.mock('../src/services/aiService', () => ({
  getMatchScore: jest.fn().mockResolvedValue({
    score: 91,
    explanation: ['Donation is nearby', 'Food is fresh', 'Quantity is suitable', 'Request has high urgency'],
    source: 'fallback'
  })
}))

jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('hashed-password'),
  compare: jest.fn().mockResolvedValue(true)
}))

jest.mock('../src/utils/token', () => ({
  signToken: jest.fn().mockReturnValue('signed-token')
}))

jest.mock('jsonwebtoken', () => ({
  verify: jest.fn().mockReturnValue({ userId: 'user-1', role: 'DONOR' })
}))

const User = require('../src/models/User')
const Donation = require('../src/models/Donation')
const FoodRequest = require('../src/models/FoodRequest')
const Delivery = require('../src/models/Delivery')
const Match = require('../src/models/Match')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { signToken } = require('../src/utils/token')
const authService = require('../src/services/authService')
const donationService = require('../src/services/donationService')
const requestService = require('../src/services/requestService')
const matchingService = require('../src/services/matchingService')
const deliveryService = require('../src/services/deliveryService')
const { requireAuth } = require('../src/middleware/authMiddleware')

function createResponse() {
  return {
    statusCode: 200,
    json: jest.fn(),
    status(code) {
      this.statusCode = code
      return this
    }
  }
}

beforeEach(() => {
  jest.clearAllMocks()
  process.env.JWT_SECRET = 'test-secret'
  process.env.JWT_EXPIRES_IN = '7d'
  process.env.AI_SERVICE_URL = ''
})

test('registers and logs in a user', async () => {
  User.findOne.mockResolvedValue(null)
  User.create.mockResolvedValue({ _id: 'user-1', role: 'DONOR', toObject: () => ({ _id: 'user-1', role: 'DONOR' }) })

  const registered = await authService.registerUser({
    name: 'Demo Donor',
    email: 'donor@test.com',
    password: 'Demo12345',
    confirmPassword: 'Demo12345',
    phone: '9999999999',
    role: 'DONOR'
  })

  expect(bcrypt.hash).toHaveBeenCalled()
  expect(signToken).toHaveBeenCalled()
  expect(registered.token).toBe('signed-token')

  User.findOne.mockReturnValue({ select: jest.fn().mockResolvedValue({ _id: 'user-1', password: 'hashed-password', isActive: true, toObject: () => ({ _id: 'user-1', role: 'DONOR' }) }) })

  const loggedIn = await authService.loginUser({ email: 'donor@test.com', password: 'Demo12345' })
  expect(bcrypt.compare).toHaveBeenCalled()
  expect(loggedIn.token).toBe('signed-token')
})

test('protects a route with auth middleware', async () => {
  User.findById.mockReturnValue({ select: jest.fn().mockResolvedValue({ _id: 'user-1', isActive: true }) })
  const req = { headers: { authorization: 'Bearer token' } }
  const res = createResponse()
  const next = jest.fn()

  await requireAuth(req, res, next)
  expect(jwt.verify).toHaveBeenCalled()
  expect(next).toHaveBeenCalled()
})

jest.mock('../src/models/Donation', () => ({
  create: jest.fn(),
  find: jest.fn(),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn()
}))

jest.mock('../src/models/FoodRequest', () => ({
  create: jest.fn(),
  find: jest.fn(),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn()
}))

jest.mock('../src/models/Delivery', () => ({
  create: jest.fn(),
  find: jest.fn(),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn()
}))

jest.mock('../src/services/aiService', () => ({
  getMatchScore: jest.fn().mockResolvedValue({ matchingScore: 91, explanation: 'Good local match' }),
  fallbackMatchScore: jest.fn().mockReturnValue({ score: 88, explanationText: 'Fallback score' })
}))

const request = require('supertest')
const app = require('../src/app')
const Donation = require('../src/models/Donation')
const FoodRequest = require('../src/models/FoodRequest')
const Delivery = require('../src/models/Delivery')

beforeEach(() => {
  jest.clearAllMocks()
})

test('creates a public donation and returns it', async () => {
  Donation.create.mockResolvedValue({
    _id: 'donation-1',
    donorName: 'Green Leaf Cafe',
    foodName: 'Veg Rice Meal',
    city: 'Pune'
  })

  const response = await request(app).post('/api/donations').send({
    donorName: 'Green Leaf Cafe',
    phone: '9876500001',
    foodName: 'Veg Rice Meal',
    category: 'Cooked Food',
    quantity: 20,
    servings: 30,
    preparationTime: new Date(Date.now() - 3600000).toISOString(),
    expiryTime: new Date(Date.now() + 3600000).toISOString(),
    pickupAddress: 'FC Road, Pune',
    city: 'Pune',
    latitude: 18.5196,
    longitude: 73.8553,
    image: '',
    description: 'Demo donation'
  })

  expect(response.status).toBe(201)
  expect(response.body.success).toBe(true)
  expect(response.body.data.donation._id).toBe('donation-1')
})

test('creates a public request and returns it', async () => {
  FoodRequest.create.mockResolvedValue({
    _id: 'request-1',
    organizationName: 'Helping Hands NGO',
    city: 'Pune'
  })

  const response = await request(app).post('/api/requests').send({
    requesterName: 'Asha Trust',
    organizationName: 'Helping Hands NGO',
    phone: '9876600001',
    foodRequired: 'Cooked Food',
    quantityRequired: 25,
    servingsRequired: 30,
    address: 'Shivajinagar Shelter, Pune',
    city: 'Pune',
    latitude: 18.5308,
    longitude: 73.8476,
    urgency: 'Urgent',
    description: 'Need food for evening distribution'
  })

  expect(response.status).toBe(201)
  expect(response.body.success).toBe(true)
  expect(response.body.data.request._id).toBe('request-1')
})

test('returns matches and assigns a delivery from public records', async () => {
  const donation = {
    _id: 'donation-1',
    foodName: 'Veg Rice Meal',
    category: 'Cooked Food',
    servings: 30,
    quantity: 20,
    latitude: 18.5196,
    longitude: 73.8553,
    preparationTime: new Date(Date.now() - 3600000).toISOString(),
    status: 'AVAILABLE',
    pickupAddress: 'FC Road, Pune'
  }
  const requestItem = {
    _id: 'request-1',
    organizationName: 'Helping Hands NGO',
    foodRequired: 'Cooked Food',
    servingsRequired: 25,
    quantityRequired: 20,
    latitude: 18.5308,
    longitude: 73.8476,
    urgency: 'Urgent',
    status: 'OPEN',
    address: 'Shivajinagar Shelter, Pune',
    createdAt: new Date().toISOString()
  }

  Donation.find.mockResolvedValue([donation])
  FoodRequest.find.mockResolvedValue([requestItem])
  Delivery.create.mockResolvedValue({
    _id: 'delivery-1',
    status: 'ASSIGNED'
  })
  Donation.findById.mockResolvedValue({
    _id: 'donation-1',
    latitude: 18.5196,
    longitude: 73.8553,
    pickupAddress: 'FC Road, Pune',
    status: 'AVAILABLE',
    save: jest.fn()
  })
  FoodRequest.findById.mockResolvedValue({
    _id: 'request-1',
    latitude: 18.5308,
    longitude: 73.8476,
    address: 'Shivajinagar Shelter, Pune',
    status: 'OPEN',
    save: jest.fn()
  })

  const matchesResponse = await request(app).get('/api/matches')
  expect(matchesResponse.status).toBe(200)
  expect(matchesResponse.body.data.matches[0].matchScore).toBe(91)

  const deliveryResponse = await request(app).post('/api/deliveries').send({
    donationId: 'donation-1',
    requestId: 'request-1',
    volunteerName: 'Volunteer 1',
    volunteerPhone: '9876700001'
  })

  expect(deliveryResponse.status).toBe(201)
  expect(deliveryResponse.body.success).toBe(true)
  expect(deliveryResponse.body.data.delivery._id).toBe('delivery-1')
})
test('creates donation and request, then generates a match and verifies delivery', async () => {
  const donorUser = { _id: 'donor-1', role: 'DONOR' }
  const requesterUser = { _id: 'ngo-1', role: 'NGO', organizationName: 'Help NGO', name: 'Help NGO' }
  const volunteerUser = { _id: 'vol-1', role: 'VOLUNTEER' }

  User.find.mockReturnValue({
    select: jest.fn().mockResolvedValue([{ _id: 'admin-1' }])
  })
  Donation.create.mockResolvedValue({
    _id: 'donation-1',
    donorId: donorUser._id,
    foodName: 'Rice Meal',
    foodType: 'Cooked Meals',
    quantity: 20,
    servings: 50,
    preparationTime: new Date(Date.now() - 3600000),
    expiryTime: new Date(Date.now() + 3600000),
    pickupTime: new Date(Date.now() + 1800000),
    pickupLocation: { latitude: 18.52, longitude: 73.86 },
    status: 'AVAILABLE',
    save: jest.fn()
  })
  FoodRequest.create.mockResolvedValue({
    _id: 'request-1',
    requesterId: requesterUser._id,
    organizationName: 'Help NGO',
    foodType: 'Cooked Meals',
    requiredQuantity: 15,
    requiredServings: 40,
    urgency: 'URGENT',
    requiredBy: new Date(Date.now() + 7200000),
    location: { latitude: 18.53, longitude: 73.84 },
    status: 'OPEN',
    save: jest.fn()
  })

  const donation = await donationService.createDonation(donorUser, {
    foodName: 'Rice Meal',
    foodType: 'Cooked Meals',
    description: 'Fresh cooked meal',
    quantity: 20,
    quantityUnit: 'kg',
    servings: 50,
    preparationTime: new Date(Date.now() - 3600000).toISOString(),
    expiryTime: new Date(Date.now() + 3600000).toISOString(),
    pickupTime: new Date(Date.now() + 1800000).toISOString(),
    pickupAddress: 'Baner, Pune',
    pickupLocation: { latitude: 18.52, longitude: 73.86 }
  })
  expect(donation._id).toBe('donation-1')

  const request = await requestService.createRequest(requesterUser, {
    organizationName: 'Help NGO',
    foodType: 'Cooked Meals',
    requiredQuantity: 15,
    requiredServings: 40,
    urgency: 'URGENT',
    description: 'Need food urgently',
    requiredBy: new Date(Date.now() + 7200000).toISOString(),
    address: 'Shivajinagar, Pune',
    location: { latitude: 18.53, longitude: 73.84 }
  })
  expect(request._id).toBe('request-1')

  Donation.findById.mockResolvedValue(donation)
  FoodRequest.findById.mockResolvedValue(request)
  Match.create.mockResolvedValue({ _id: 'match-1', matchingScore: 91 })

  const matchResult = await matchingService.createMatch({ donationId: 'donation-1', requestId: 'request-1' })
  expect(matchResult.matchingScore).toBe(91)

  Delivery.findById.mockResolvedValue({
    _id: 'delivery-1',
    donationId: 'donation-1',
    requestId: 'request-1',
    volunteerId: volunteerUser._id,
    verificationCode: 'CODE1234',
    verificationUsed: false,
    status: 'ASSIGNED',
    save: jest.fn(async function save() { return this })
  })
  Donation.findById.mockResolvedValue({ save: jest.fn(), donorId: donorUser._id })
  FoodRequest.findById.mockResolvedValue({ save: jest.fn(), urgency: 'URGENT' })

  const verified = await deliveryService.verifyDelivery('delivery-1', 'CODE1234')
  expect(verified.status).toBe('DELIVERED')
})
