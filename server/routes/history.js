import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const historyPath = path.join(__dirname, "..", "data", "wasteHistory.json");

router.get("/", (req, res) => {
  try {
    const history = JSON.parse(fs.readFileSync(historyPath, "utf-8"));
    res.json(history);
  } catch (err) {
    console.error("Error in /api/history:", err);
    res.status(500).json({ error: "Could not load waste history." });
  }
});

export default router;
