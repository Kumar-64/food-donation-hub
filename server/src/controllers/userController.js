const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");
const { getPublicProfile, updateProfile } = require("../services/userService");
const { storeImage } = require("../services/uploadService");

const getProfile = asyncHandler(async (req, res) => {
  const user = await getPublicProfile(req.user._id);
  return sendSuccess(res, "Profile fetched", { user });
});

const updateUserProfile = asyncHandler(async (req, res) => {
  const payload = { ...req.body };
  if (req.file) {
    payload.profileImage = await storeImage(req.file);
  }
  const user = await updateProfile(req.user._id, payload);
  return sendSuccess(res, "Profile updated successfully", { user });
});

module.exports = {
  getProfile,
  updateUserProfile
};
