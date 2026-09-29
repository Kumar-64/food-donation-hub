const { body } = require("express-validator");
const asyncHandler = require("../utils/asyncHandler");
const validateRequest = require("../middleware/validateRequest");
const Donation = require('../models/Donation')
const { sendSuccess, sendError } = require('../utils/apiResponse')

function validateDonation(body) {
  const required = ['donorName', 'phone', 'foodName', 'category', 'quantity', 'servings', 'preparationTime', 'expiryTime', 'pickupAddress', 'city', 'latitude', 'longitude']
  const missing = required.filter((field) => body[field] === undefined || body[field] === '')
  if (missing.length) return `Missing fields: ${missing.join(', ')}`
  if (Number(body.quantity) <= 0 || Number(body.servings) <= 0) return 'Quantity and servings must be greater than 0'
  if (new Date(body.expiryTime) <= new Date(body.preparationTime)) return 'Expiry time must be after preparation time'
  if (new Date(body.expiryTime) <= new Date()) return 'Expired food cannot be donated'
  return ''
}

async function create(req, res) {
  const error = validateDonation(req.body)
  if (error) return sendError(res, error, [], 400)

  const donation = await Donation.create({
    donorName: req.body.donorName,
    phone: req.body.phone,
    foodName: req.body.foodName,
    category: req.body.category,
    quantity: Number(req.body.quantity),
    servings: Number(req.body.servings),
    preparationTime: req.body.preparationTime,
    expiryTime: req.body.expiryTime,
    pickupAddress: req.body.pickupAddress,
    city: req.body.city,
    latitude: Number(req.body.latitude),
    longitude: Number(req.body.longitude),
    image: req.body.image || '',
    description: req.body.description || '',
    status: 'AVAILABLE'
  })

  return sendSuccess(res, 'Food donation successfully added!', { donation }, 201)
}

async function getAll(req, res) {
  const filter = {}
  if (req.query.category) filter.category = req.query.category
  if (req.query.city) filter.city = req.query.city
  if (req.query.availableOnly === 'true') filter.status = 'AVAILABLE'
  const donations = await Donation.find(filter).sort({ createdAt: -1 })
  return sendSuccess(res, 'Donations fetched', { donations })
}

async function getOne(req, res) {
  const donation = await Donation.findById(req.params.id)
  return sendSuccess(res, 'Donation fetched', { donation })
}

async function update(req, res) {
  const donation = await Donation.findByIdAndUpdate(req.params.id, req.body, { new: true })
  return sendSuccess(res, 'Donation updated', { donation })
}

async function remove(req, res) {
  await Donation.findByIdAndDelete(req.params.id)
  return sendSuccess(res, 'Donation deleted')
}

module.exports = { create, getAll, getOne, update, remove }
const { parseMaybeJson } = require("../utils/parse");

const donationValidation = [
  body("foodName").notEmpty().withMessage("Food name is required"),
  body("foodType").notEmpty().withMessage("Food category is required"),
  body("description").notEmpty().withMessage("Description is required"),
  body("quantity").isFloat({ gt: 0 }).withMessage("Quantity must be greater than 0"),
  body("quantityUnit").notEmpty().withMessage("Quantity unit is required"),
  body("servings").isInt({ gt: 0 }).withMessage("Servings must be greater than 0"),
  body("preparationTime").notEmpty().withMessage("Preparation time is required"),
  body("expiryTime").notEmpty().withMessage("Expiry time is required"),
  body("pickupTime").notEmpty().withMessage("Pickup time is required"),
  body("pickupAddress").notEmpty().withMessage("Pickup address is required")
];

const create = [
  ...donationValidation,
  validateRequest,
  asyncHandler(async (req, res) => {
    const payload = {
      ...req.body,
      quantity: Number(req.body.quantity),
      servings: Number(req.body.servings),
      pickupLocation: parseMaybeJson(req.body.pickupLocation, { latitude: null, longitude: null })
    };
    const donation = await createDonation(req.user, payload, req.file);
    return sendSuccess(res, "Donation created successfully", { donation }, 201);
  })
];

const getAll = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  if (req.query.donorId) filter.donorId = req.query.donorId;
  const donations = await listDonations(filter, { sort: { createdAt: -1 } });
  return sendSuccess(res, "Donations fetched", { donations });
});

const getOne = asyncHandler(async (req, res) => {
  const donations = await listDonations({ _id: req.params.id });
  return sendSuccess(res, "Donation fetched", { donation: donations[0] || null });
});

const update = asyncHandler(async (req, res) => {
  const donation = await updateDonation(req.user, req.params.id, req.body);
  return sendSuccess(res, "Donation updated", { donation });
});

const remove = asyncHandler(async (req, res) => {
  await removeDonation(req.user, req.params.id);
  return sendSuccess(res, "Donation deleted successfully");
});

module.exports = {
  create,
  getAll,
  getOne,
  update,
  remove
};
