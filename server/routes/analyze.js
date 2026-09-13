import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { calculateWasteMetrics } from "../services/wasteCalculator.js";
import { getAiAnalysis } from "../services/aiService.js";

const router = express.Router();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const historyPath = path.join(__dirname, "..", "data", "wasteHistory.json");

router.post("/", async (req, res) => {
  try {
    const {
      menu,
      expectedStudents,
      foodPreparedKg,
      historicalAvgWasteKg,
      dayOfWeek,
      eventInfo,
    } = req.body;

    if (!menu || !expectedStudents || !foodPreparedKg || !dayOfWeek) {
      return res.status(400).json({
        error:
          "menu, expectedStudents, foodPreparedKg, and dayOfWeek are required.",
      });
    }

    const input = {
      menu: String(menu),
      expectedStudents: Number(expectedStudents),
      foodPreparedKg: Number(foodPreparedKg),
      historicalAvgWasteKg: Number(historicalAvgWasteKg) || 0,
      dayOfWeek: String(dayOfWeek),
      eventInfo: eventInfo ? String(eventInfo) : "",
    };

    const history = JSON.parse(fs.readFileSync(historyPath, "utf-8"));

    const metrics = calculateWasteMetrics(input, history);
    const aiResult = await getAiAnalysis(input, metrics);

    res.json({
      input,
      metrics,
      ai: aiResult,
    });
  } catch (err) {
    console.error("Error in /api/analyze:", err);
    res.status(500).json({ error: "Something went wrong while analyzing." });
  }
});

export default router;
