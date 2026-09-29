const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");
const { getAdminDashboard, listUsers, setUserStatus, toggleDisasterMode, getReports } = require("../services/adminService");

const dashboard = asyncHandler(async (req, res) => {
  const data = await getAdminDashboard();
  return sendSuccess(res, "Admin dashboard fetched", data);
});

const users = asyncHandler(async (req, res) => {
  const data = await listUsers();
  return sendSuccess(res, "Users fetched", { users: data });
});

const changeStatus = asyncHandler(async (req, res) => {
  const user = await setUserStatus(req.params.id, Boolean(req.body.isActive));
  return sendSuccess(res, "User status updated", { user });
});

const updateDisasterMode = asyncHandler(async (req, res) => {
  const setting = await toggleDisasterMode(Boolean(req.body.enabled), req.user._id);
  return sendSuccess(res, "Disaster relief mode updated", { setting });
});

const reports = asyncHandler(async (req, res) => {
  const data = await getReports();
  return sendSuccess(res, "Reports fetched", data);
});

module.exports = {
  dashboard,
  users,
  changeStatus,
  updateDisasterMode,
  reports
};
