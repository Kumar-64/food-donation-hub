const { body } = require("express-validator");
const asyncHandler = require("../utils/asyncHandler");
const validateRequest = require("../middleware/validateRequest");
const { sendSuccess } = require("../utils/apiResponse");
const { createRating, getRatingsForUser } = require("../services/ratingService");

const createRatingValidation = [
  body("toUserId").notEmpty().withMessage("Recipient user is required"),
  body("rating").isInt({ min: 1, max: 5 }).withMessage("Rating must be between 1 and 5")
];

const create = [
  ...createRatingValidation,
  validateRequest,
  asyncHandler(async (req, res) => {
    const rating = await createRating(req.user._id, req.body);
    return sendSuccess(res, "Rating submitted successfully", { rating }, 201);
  })
];

const getByUser = asyncHandler(async (req, res) => {
  const data = await getRatingsForUser(req.params.userId);
  return sendSuccess(res, "Ratings fetched", data);
});

module.exports = {
  create,
  getByUser
};
