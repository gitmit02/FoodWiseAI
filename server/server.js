import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import analyzeRoute from "./routes/analyze.js";
import historyRoute from "./routes/history.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "FoodWise AI server is running." });
});

app.use("/api/analyze", analyzeRoute);
app.use("/api/history", historyRoute);

app.listen(PORT, () => {
  console.log(`FoodWise AI server listening on http://localhost:${PORT}`);
});
