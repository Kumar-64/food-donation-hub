const { body } = require("express-validator");
const asyncHandler = require("../utils/asyncHandler");
const validateRequest = require("../middleware/validateRequest");
const FoodRequest = require('../models/FoodRequest')
const { sendSuccess, sendError } = require('../utils/apiResponse')

function validateRequest(body) {
  const required = ['requesterName', 'organizationName', 'phone', 'foodRequired', 'quantityRequired', 'servingsRequired', 'address', 'city', 'latitude', 'longitude', 'urgency']
  const missing = required.filter((field) => body[field] === undefined || body[field] === '')
  if (missing.length) return `Missing fields: ${missing.join(', ')}`
  if (Number(body.quantityRequired) <= 0 || Number(body.servingsRequired) <= 0) return 'Quantity and servings must be greater than 0'
  return ''
}

async function create(req, res) {
  const error = validateRequest(req.body)
  if (error) return sendError(res, error, [], 400)

  const request = await FoodRequest.create({
    requesterName: req.body.requesterName,
    organizationName: req.body.organizationName,
    phone: req.body.phone,
    foodRequired: req.body.foodRequired,
    quantityRequired: Number(req.body.quantityRequired),
    servingsRequired: Number(req.body.servingsRequired),
    address: req.body.address,
    city: req.body.city,
    latitude: Number(req.body.latitude),
    longitude: Number(req.body.longitude),
    urgency: req.body.urgency,
    description: req.body.description || '',
    status: 'OPEN'
  })

  return sendSuccess(res, 'Food request submitted successfully.', { request }, 201)
}

async function getAll(req, res) {
  const filter = {}
  if (req.query.city) filter.city = req.query.city
  if (req.query.urgency) filter.urgency = req.query.urgency
  if (req.query.status) filter.status = req.query.status
  const requests = await FoodRequest.find(filter).sort({ createdAt: -1 })
  return sendSuccess(res, 'Requests fetched', { requests })
}

async function getOne(req, res) {
  const request = await FoodRequest.findById(req.params.id)
  return sendSuccess(res, 'Request fetched', { request })
}

async function update(req, res) {
  const request = await FoodRequest.findByIdAndUpdate(req.params.id, req.body, { new: true })
  return sendSuccess(res, 'Request updated', { request })
}

module.exports = { create, getAll, getOne, update }
const { parseMaybeJson } = require("../utils/parse");

const requestValidation = [
  body("foodType").notEmpty().withMessage("Food type is required"),
  body("requiredQuantity").isFloat({ gt: 0 }).withMessage("Required quantity must be greater than 0"),
  body("requiredServings").isInt({ gt: 0 }).withMessage("Required servings must be greater than 0"),
  body("urgency").isIn(["NORMAL", "URGENT", "EMERGENCY"]).withMessage("Invalid urgency"),
  body("requiredBy").notEmpty().withMessage("Required by date is required"),
  body("description").notEmpty().withMessage("Description is required"),
  body("address").notEmpty().withMessage("Address is required")
];

const create = [
  ...requestValidation,
  validateRequest,
  asyncHandler(async (req, res) => {
    const payload = {
      ...req.body,
      requiredQuantity: Number(req.body.requiredQuantity),
      requiredServings: Number(req.body.requiredServings),
      location: parseMaybeJson(req.body.location, { latitude: null, longitude: null })
    };
    const request = await createRequest(req.user, payload);
    return sendSuccess(res, "Food request created successfully", { request }, 201);
  })
];

const getAll = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  if (req.query.urgency) filter.urgency = req.query.urgency;
  const requests = await listRequests(filter);
  return sendSuccess(res, "Requests fetched", { requests });
});

const getOne = asyncHandler(async (req, res) => {
  const requests = await listRequests({ _id: req.params.id });
  return sendSuccess(res, "Request fetched", { request: requests[0] || null });
});

const update = asyncHandler(async (req, res) => {
  const request = await updateRequest(req.user, req.params.id, req.body);
  return sendSuccess(res, "Request updated", { request });
});

module.exports = {
  create,
  getAll,
  getOne,
  update
};
