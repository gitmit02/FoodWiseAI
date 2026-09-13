/**
 * aiService.js
 *
 * The AI component of FoodWise AI. Numeric work is already done by
 * wasteCalculator.js — this file only asks an LLM (or a rule-based
 * fallback, if no API key is configured) to explain WHY waste might
 * happen and WHAT the canteen should do about it.
 *
 * This keeps the AI's job narrow and appropriate: qualitative reasoning
 * and language generation, not arithmetic.
 */

const AI_API_KEY = process.env.AI_API_KEY;
const AI_API_URL =
  process.env.AI_API_URL || "https://api.groq.com/openai/v1/chat/completions";
const AI_MODEL = process.env.AI_MODEL || "llama-3.1-8b-instant";

/**
 * Main entry point. Tries the LLM first (if configured), and always
 * falls back to rule-based logic on any failure so the demo never breaks.
 */
async function getAiAnalysis(input, metrics) {
  if (AI_API_KEY) {
    try {
      return await getLlmAnalysis(input, metrics);
    } catch (err) {
      console.error("AI API call failed, using rule-based fallback:", err.message);
      return getRuleBasedAnalysis(input, metrics);
    }
  }
  return getRuleBasedAnalysis(input, metrics);
}

async function getLlmAnalysis(input, metrics) {
  const prompt = buildPrompt(input, metrics);

  // Groq exposes an OpenAI-compatible /chat/completions endpoint.
  const response = await fetch(AI_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${AI_API_KEY}`,
    },
    body: JSON.stringify({
      model: AI_MODEL,
      max_tokens: 500,
      temperature: 0.4,
      response_format: { type: "json_object" },
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => "");
    throw new Error(`AI API returned status ${response.status}: ${errText}`);
  }

  const data = await response.json();
  const messageContent = data.choices?.[0]?.message?.content;
  if (!messageContent) throw new Error("No text content returned by AI API");

  const parsed = safeJsonParse(messageContent);
  if (!parsed) throw new Error("Could not parse AI JSON response");

  return {
    source: "ai",
    possibleReasons: parsed.possibleReasons || [],
    recommendations: parsed.recommendations || [],
  };
}

function buildPrompt(input, metrics) {
  return `You are a food-waste reduction assistant for a college canteen, supporting SDG 12 (Responsible Consumption and Production).

Meal details:
- Menu: ${input.menu}
- Expected students: ${input.expectedStudents}
- Food prepared: ${input.foodPreparedKg} kg
- Historical average waste: ${input.historicalAvgWasteKg} kg
- Day of week: ${input.dayOfWeek}
- Event/holiday info: ${input.eventInfo || "None"}

Calculated metrics:
- Estimated waste: ${metrics.estimatedWasteKg} kg
- Waste risk level: ${metrics.riskLevel}
- Historical waste percentage for this menu: ${metrics.historicalWastePercent}%

Respond with ONLY a JSON object (no markdown, no preamble) in this exact shape:
{
  "possibleReasons": ["reason 1", "reason 2", "reason 3"],
  "recommendations": ["action 1", "action 2", "action 3"]
}

Keep each reason and recommendation short (under 15 words), practical, and specific to a college canteen setting.`;
}

/**
 * Rule-based fallback. Deterministic and works fully offline, so the
 * prototype is always demoable even without any AI API key.
 */
function getRuleBasedAnalysis(input, metrics) {
  const reasons = [];
  const recommendations = [];

  if (metrics.kgPerStudent > 0.28) {
    reasons.push("Food prepared per student is higher than the usual portion size.");
    recommendations.push("Reduce batch size slightly and monitor plate returns.");
  }

  if (["Friday", "Saturday"].includes(input.dayOfWeek)) {
    reasons.push("Attendance tends to dip on Fridays/weekends, lowering actual footfall.");
    recommendations.push("Prepare a smaller base batch and keep a quick top-up option ready.");
  }

  if (input.eventInfo && input.eventInfo.trim().length > 0) {
    reasons.push(`An event/holiday ("${input.eventInfo}") may reduce or shift attendance.`);
    recommendations.push("Cross-check with the event schedule before finalizing quantities.");
  }

  if (metrics.historicalWastePercent > 15) {
    reasons.push(`${input.menu} has a history of higher-than-average waste.`);
    recommendations.push(`Consider a smaller portion size or an alternate recipe for ${input.menu}.`);
  }

  if (reasons.length === 0) {
    reasons.push("Preparation quantity closely matches typical demand for this meal.");
    recommendations.push("Maintain current preparation levels; no major changes needed.");
  }

  recommendations.push("Track actual plate waste today to improve future predictions.");

  if (metrics.riskLevel === "High") {
    recommendations.push("Notify canteen staff to prepare in two smaller batches instead of one large batch.");
  }

  return {
    source: "rule-based",
    possibleReasons: dedupe(reasons).slice(0, 4),
    recommendations: dedupe(recommendations).slice(0, 4),
  };
}

function dedupe(arr) {
  return [...new Set(arr)];
}

function safeJsonParse(text) {
  try {
    const cleaned = text.replace(/```json|```/g, "").trim();
    return JSON.parse(cleaned);
  } catch {
    return null;
  }
}

export { getAiAnalysis };
