const axios = require("axios");

function fallbackMatchScore(payload) {
  const distanceScore = Math.max(0, 30 - Math.min(Number(payload.distance_km || 0) * 3, 30));
  const freshnessScore = Math.max(0, 20 - Math.min(Number(payload.freshness_hours || 0) * 1.5, 20));
  const quantityDiff = Math.abs(Number(payload.quantity_available || 0) - Number(payload.quantity_required || 0));
  const quantityScore = Math.max(0, 20 - Math.min(quantityDiff / 10, 20));
  const urgencyScore = payload.urgency === "EMERGENCY" ? 15 : payload.urgency === "URGENT" ? 12 : 8;
  const foodTypeScore = Number(payload.food_type_match) ? 10 : 0;
  const timeScore = Math.max(0, 5 - Math.min(Number(payload.time_difference_hours || 0), 5));
  const score = Math.min(100, Math.round(distanceScore + freshnessScore + quantityScore + urgencyScore + foodTypeScore + timeScore));

  const explanation = [];
  if (distanceScore >= 20) explanation.push("Donation is nearby");
  if (freshnessScore >= 10) explanation.push("Food is fresh");
  if (quantityScore >= 10) explanation.push("Quantity is suitable");
  if (urgencyScore >= 12) explanation.push("Request has high urgency");
  if (foodTypeScore) explanation.push("Food type matches the request");
  if (timeScore >= 3) explanation.push("Pickup timing looks suitable");

  return {
    score,
    explanation,
    breakdown: {
      distanceScore,
      freshnessScore,
      quantityScore,
      urgencyScore,
      foodTypeScore,
      timeScore
    },
    source: "fallback"
  };
}

async function getMatchScore(payload) {
  const aiServiceUrl = process.env.AI_SERVICE_URL;
  if (!aiServiceUrl) {
    return fallbackMatchScore(payload);
  }

  try {
    const response = await axios.post(`${aiServiceUrl.replace(/\/$/, "")}/match-score`, payload, {
      timeout: 3000
    });
    return { ...response.data, source: "ai-service" };
  } catch (error) {
    return fallbackMatchScore(payload);
  }
}

module.exports = {
  getMatchScore,
  fallbackMatchScore
};
