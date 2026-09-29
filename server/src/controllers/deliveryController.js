const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");
const Delivery = require('../models/Delivery')
const Donation = require('../models/Donation')
const FoodRequest = require('../models/FoodRequest')
const { sendSuccess, sendError } = require('../utils/apiResponse')
const { haversineDistanceKm } = require('../utils/distance')

async function createDelivery(req, res) {
  const { donationId, requestId, volunteerName, volunteerPhone } = req.body
  if (!donationId || !requestId || !volunteerName || !volunteerPhone) {
    return sendError(res, 'Missing delivery fields', [], 400)
  }

  const donation = await Donation.findById(donationId)
  const request = await FoodRequest.findById(requestId)
  if (!donation || !request) return sendError(res, 'Donation or request not found', [], 404)

  const distance = haversineDistanceKm(
    { latitude: donation.latitude, longitude: donation.longitude },
    { latitude: request.latitude, longitude: request.longitude }
  ) || 0

  const delivery = await Delivery.create({
    donationId,
    requestId,
    volunteerName,
    volunteerPhone,
    status: 'ASSIGNED',
    pickupLocation: donation.pickupAddress,
    deliveryLocation: request.address,
    distance
  })

  donation.status = 'ASSIGNED'
  request.status = 'MATCHED'
  await donation.save()
  await request.save()

  return sendSuccess(res, 'Delivery assigned successfully', { delivery }, 201)
}

async function getAll(req, res) {
  const deliveries = await Delivery.find().sort({ createdAt: -1 })
  return sendSuccess(res, 'Deliveries fetched', { deliveries })
}

async function updateStatus(req, res) {
  const delivery = await Delivery.findById(req.params.id)
  if (!delivery) return sendError(res, 'Delivery not found', [], 404)

  delivery.status = req.body.status
  if (req.body.status === 'DELIVERED') delivery.deliveredAt = new Date()
  await delivery.save()

  return sendSuccess(res, 'Delivery status updated', { delivery })
}

module.exports = { createDelivery, getAll, updateStatus }
const { createNotification } = require("../services/notificationService");

const createDeliveryHandler = asyncHandler(async (req, res) => {
  const delivery = await createDelivery(req.body);
  return sendSuccess(res, "Delivery assigned successfully", { delivery }, 201);
});

const listDeliveries = asyncHandler(async (req, res) => {
  const query = {};
  if (req.user.role === "VOLUNTEER") query.volunteerId = req.user._id;
  if (req.query.status) query.status = req.query.status;
  const deliveries = await Delivery.find(query).populate("donationId requestId volunteerId");
  return sendSuccess(res, "Deliveries fetched", { deliveries });
});

const changeStatus = asyncHandler(async (req, res) => {
  const delivery = await updateDeliveryStatus(req.params.id, req.body.status, req.user._id);
  return sendSuccess(res, "Delivery status updated", { delivery });
});

const verify = asyncHandler(async (req, res) => {
  const delivery = await verifyDelivery(req.params.id, req.body.verificationCode);
  await createNotification({
    userId: req.user._id,
    title: "Delivery verified",
    message: `Delivery ${delivery._id} was verified successfully.`,
    type: "DELIVERY_VERIFIED",
    relatedId: String(delivery._id)
  });
  return sendSuccess(res, "Delivery verified successfully", { delivery });
});

module.exports = {
  createDeliveryHandler,
  listDeliveries,
  changeStatus,
  verify
};
