const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");
const { getRewardsSummary } = require("../services/rewardService");

const getRewards = asyncHandler(async (req, res) => {
  const rewards = await getRewardsSummary(req.user._id);
  return sendSuccess(res, "Rewards fetched", rewards);
});

module.exports = {
  getRewards
};
