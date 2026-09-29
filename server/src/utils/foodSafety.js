function calculateFoodSafety({ preparationTime, expiryTime, now = new Date() }) {
  if (!preparationTime || !expiryTime) {
    return {
      status: "CAUTION",
      freshnessHours: null,
      remainingShelfLifeHours: null,
      safetyNotes: "Provide preparation and expiry time for a clearer safety check."
    };
  }

  const preparedAt = new Date(preparationTime);
  const expiresAt = new Date(expiryTime);
  const currentTime = new Date(now);

  const freshnessHours = Math.max(0, (currentTime.getTime() - preparedAt.getTime()) / 36e5);
  const remainingShelfLifeHours = (expiresAt.getTime() - currentTime.getTime()) / 36e5;

  let status = "SAFE";
  let safetyNotes = "Food appears suitable for redistribution based on project-level rules.";

  if (remainingShelfLifeHours <= 0) {
    status = "EXPIRED";
    safetyNotes = "Food is past expiry and should not be redistributed.";
  } else if (remainingShelfLifeHours <= 3 || freshnessHours >= 24) {
    status = "CAUTION";
    safetyNotes = "Food should be prioritized quickly and checked carefully before dispatch.";
  }

  return {
    status,
    freshnessHours: Number(freshnessHours.toFixed(1)),
    remainingShelfLifeHours: Number(remainingShelfLifeHours.toFixed(1)),
    safetyNotes
  };
}

module.exports = {
  calculateFoodSafety
};
