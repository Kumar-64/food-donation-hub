const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");
const Donation = require('../models/Donation')
const FoodRequest = require('../models/FoodRequest')
const { sendSuccess } = require('../utils/apiResponse')
const { haversineDistanceKm } = require('../utils/distance')
const { getMatchScore, fallbackMatchScore } = require('../services/aiService')

function scoreDonationAndRequest(donation, request) {
  const distance = haversineDistanceKm({ latitude: donation.latitude, longitude: donation.longitude }, { latitude: request.latitude, longitude: request.longitude }) || 0
  const freshnessHours = Math.max(0, (new Date(request.createdAt || Date.now()).getTime() - new Date(donation.preparationTime).getTime()) / 36e5)
  const quantityAvailable = Number(donation.servings || 0)
  const quantityRequired = Number(request.servingsRequired || 0)
  const foodTypeMatch = donation.category.toLowerCase().includes(request.foodRequired.toLowerCase().split(' ')[0].toLowerCase()) || donation.foodName.toLowerCase().includes(request.foodRequired.toLowerCase()) ? 1 : 0
  return { distance, freshnessHours, quantityAvailable, quantityRequired, foodTypeMatch }
}

async function getAll(req, res) {
  const donations = await Donation.find({ status: { $ne: 'EXPIRED' } })
  const requests = await FoodRequest.find({ status: { $in: ['OPEN', 'MATCHED'] } })
  const matches = []

  for (const donation of donations) {
    for (const request of requests) {
      const payload = scoreDonationAndRequest(donation, request)
      const ai = await getMatchScore({
        foodType: donation.category,
        requestedFoodType: request.foodRequired,
        availableQuantity: payload.quantityAvailable,
        requestedQuantity: payload.quantityRequired,
        distance: payload.distance,
        urgency: request.urgency,
        freshness: payload.freshnessHours
      }).catch(() => fallbackMatchScore({
        distance_km: payload.distance,
        freshness_hours: payload.freshnessHours,
        quantity_available: payload.quantityAvailable,
        quantity_required: payload.quantityRequired,
        urgency: request.urgency.toUpperCase(),
        food_type_match: payload.foodTypeMatch,
        time_difference_hours: 1
      }))

      matches.push({
        donation,
        request,
        matchScore: ai.matchingScore || ai.score || 0,
        explanation: ai.explanation || ai.explanationText || ''
      })
    }
  }

  matches.sort((a, b) => b.matchScore - a.matchScore)
  return sendSuccess(res, 'Matches fetched', { matches: matches.slice(0, 20) })
}

async function create(req, res) {
  return getAll(req, res)
}

module.exports = { getAll, create }

const listMatches = asyncHandler(async (req, res) => {
  const query = {};
  if (req.query.donationId) query.donationId = req.query.donationId;
  if (req.query.requestId) query.requestId = req.query.requestId;
  const matches = await Match.find(query).sort({ matchingScore: -1 }).populate("donationId requestId donorId requesterId");
  return sendSuccess(res, "Matches fetched", { matches });
});

const generateMatches = asyncHandler(async (req, res) => {
  if (req.body.donationId && req.body.requestId) {
    const match = await createMatch(req.body);
    return sendSuccess(res, "Match generated successfully", { match }, 201);
  }
  const matches = await generateBestMatches({
    donationId: req.body.donationId || null,
    requestId: req.body.requestId || null,
    limit: req.body.limit || 5
  });
  return sendSuccess(res, "AI matching completed", { matches });
});

module.exports = {
  listMatches,
  generateMatches
};
