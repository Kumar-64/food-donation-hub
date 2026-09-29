const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");
const Donation = require('../models/Donation')
const FoodRequest = require('../models/FoodRequest')
const Delivery = require('../models/Delivery')
const { sendSuccess } = require('../utils/apiResponse')

async function overview(req, res) {
  const [donations, requests, deliveries] = await Promise.all([
    Donation.find(),
    FoodRequest.find(),
    Delivery.find()
  ])

  const availableFood = donations.filter((item) => item.status === 'AVAILABLE').length
  const foodDelivered = deliveries.filter((item) => item.status === 'DELIVERED').length
  const pendingRequests = requests.filter((item) => item.status === 'OPEN').length
  const totalServings = donations.reduce((sum, item) => sum + Number(item.servings || 0), 0)
  const peopleServed = foodDelivered * 10

  return sendSuccess(res, 'Analytics fetched', {
    totalFoodDonations: donations.length,
    availableFood,
    foodDelivered,
    totalRequests: requests.length,
    pendingRequests,
    completedDeliveries: foodDelivered,
    totalServings,
    peopleServed
  })
}

module.exports = { overview }

const overview = asyncHandler(async (req, res) => {
  const overviewData = await getOverviewMetrics();
  return sendSuccess(res, "Overview metrics fetched", overviewData);
});

const donations = asyncHandler(async (req, res) => {
  const data = await getDonationAnalytics();
  return sendSuccess(res, "Donation analytics fetched", data);
});

const requests = asyncHandler(async (req, res) => {
  const data = await getRequestAnalytics();
  return sendSuccess(res, "Request analytics fetched", data);
});

const impact = asyncHandler(async (req, res) => {
  const data = await getImpactAnalytics();
  return sendSuccess(res, "Impact analytics fetched", data);
});

module.exports = {
  overview,
  donations,
  requests,
  impact
};
