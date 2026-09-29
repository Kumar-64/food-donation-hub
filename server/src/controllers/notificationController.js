const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");
const { listNotifications, markNotificationRead, markAllNotificationsRead } = require("../services/notificationQueryService");

const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await listNotifications(req.user._id);
  return sendSuccess(res, "Notifications fetched", { notifications });
});

const markRead = asyncHandler(async (req, res) => {
  const notification = await markNotificationRead(req.params.id, req.user._id);
  return sendSuccess(res, "Notification marked as read", { notification });
});

const markAllRead = asyncHandler(async (req, res) => {
  await markAllNotificationsRead(req.user._id);
  return sendSuccess(res, "All notifications marked as read");
});

module.exports = {
  getNotifications,
  markRead,
  markAllRead
};
