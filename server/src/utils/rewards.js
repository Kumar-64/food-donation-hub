function getRewardPoints({ type, isEmergency = false }) {
  if (type === "delivery") {
    return isEmergency ? 20 : 15;
  }

  if (type === "donation") {
    return isEmergency ? 15 : 10;
  }

  if (type === "request") {
    return 5;
  }

  return 0;
}

function getRewardLevel(points = 0) {
  if (points >= 250) {
    return "FoodBridge Hero";
  }

  if (points >= 120) {
    return "Community Champion";
  }

  if (points >= 50) {
    return "Food Saver";
  }

  return "New Helper";
}

module.exports = {
  getRewardPoints,
  getRewardLevel
};
