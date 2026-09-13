/**
 * wasteCalculator.js
 *
 * All NUMBER CRUNCHING for FoodWise AI lives here, using plain JavaScript
 * logic (no AI/LLM involved). This keeps calculations fast, deterministic,
 * and easy to explain in a demo/PPT.
 */

/**
 * Calculates historical waste percentage from past records for the
 * same menu item (falls back to overall average if the menu has no history).
 */
function getHistoricalWastePercent(menu, history) {
  const menuRecords = history.filter(
    (r) => r.menu.toLowerCase() === menu.toLowerCase()
  );

  const records = menuRecords.length > 0 ? menuRecords : history;

  const totalPrepared = records.reduce((sum, r) => sum + r.foodPreparedKg, 0);
  const totalWasted = records.reduce((sum, r) => sum + r.foodWastedKg, 0);

  if (totalPrepared === 0) return 0;
  return (totalWasted / totalPrepared) * 100;
}

/**
 * Core calculation: given the meal plan input + historical waste %,
 * estimate waste, decide a risk level, and recommend how much to prepare.
 */
function calculateWasteMetrics(input, history) {
  const {
    menu,
    expectedStudents,
    foodPreparedKg,
    historicalAvgWasteKg,
    dayOfWeek,
    eventInfo,
  } = input;

  const historicalWastePercent = getHistoricalWastePercent(menu, history);

  // Base estimated waste: blend of historical % pattern and the
  // explicit historicalAvgWasteKg the user entered, weighted 60/40.
  const percentBasedEstimate = (historicalWastePercent / 100) * foodPreparedKg;
  const estimatedWasteKg =
    percentBasedEstimate * 0.6 + (historicalAvgWasteKg || 0) * 0.4;

  const wastePercentOfPrepared =
    foodPreparedKg > 0 ? (estimatedWasteKg / foodPreparedKg) * 100 : 0;

  // Food prepared per student, useful signal for over-preparation
  const kgPerStudent =
    expectedStudents > 0 ? foodPreparedKg / expectedStudents : 0;

  // Risk scoring: simple weighted rule-based score (0-100)
  let riskScore = 0;

  if (wastePercentOfPrepared >= 18) riskScore += 45;
  else if (wastePercentOfPrepared >= 10) riskScore += 25;
  else riskScore += 10;

  if (["Friday", "Saturday"].includes(dayOfWeek)) riskScore += 15;
  if (eventInfo && eventInfo.trim().length > 0) riskScore += 20;
  if (kgPerStudent > 0.28) riskScore += 15; // prepared noticeably more per head than typical
  if (kgPerStudent < 0.18) riskScore -= 10; // prepared conservatively

  riskScore = Math.max(0, Math.min(100, riskScore));

  let riskLevel = "Low";
  if (riskScore >= 60) riskLevel = "High";
  else if (riskScore >= 30) riskLevel = "Medium";

  // Recommended preparation: pull back preparation roughly in proportion
  // to how much waste is predicted, capped at a sensible range.
  let reductionFactor = 0;
  if (riskLevel === "High") reductionFactor = 0.15;
  else if (riskLevel === "Medium") reductionFactor = 0.08;
  else reductionFactor = 0.02;

  const recommendedPreparationKg = Math.max(
    foodPreparedKg * (1 - reductionFactor),
    expectedStudents * 0.15 // never recommend below a sensible minimum per student
  );

  const potentialWasteReductionKg = Math.max(
    0,
    estimatedWasteKg - recommendedPreparationKg * (wastePercentOfPrepared / 100)
  );

  return {
    historicalWastePercent: round1(historicalWastePercent),
    estimatedWasteKg: round1(estimatedWasteKg),
    wastePercentOfPrepared: round1(wastePercentOfPrepared),
    kgPerStudent: round2(kgPerStudent),
    riskScore,
    riskLevel,
    recommendedPreparationKg: round1(recommendedPreparationKg),
    potentialWasteReductionKg: round1(potentialWasteReductionKg),
  };
}

function round1(n) {
  return Math.round(n * 10) / 10;
}
function round2(n) {
  return Math.round(n * 100) / 100;
}

export { calculateWasteMetrics, getHistoricalWastePercent };
