import { useState } from "react";
import { analyzeFoodWaste } from "../api.js";
import RiskBadge from "./RiskBadge.jsx";

const MENU_OPTIONS = [
  "Rice + Dal",
  "Rajma Rice",
  "Chole Bhature",
  "Roti + Paneer",
  "Pulao",
  "Biryani",
  "Idli + Sambar",
];

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const initialForm = {
  menu: MENU_OPTIONS[0],
  expectedStudents: 400,
  foodPreparedKg: 100,
  historicalAvgWasteKg: 10,
  dayOfWeek: "Monday",
  eventInfo: "",
};

export default function AnalyzeWaste() {
  const [form, setForm] = useState(initialForm);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const data = await analyzeFoodWaste(form);
      setResult(data);
    } catch (err) {
      setError(
        "Could not reach the FoodWise AI server. Make sure the backend is running on port 5000."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="lg:col-span-2 bg-white rounded-2xl border border-canopy-100 p-6 space-y-4 h-fit"
      >
        <h2 className="font-bold text-lg">Upcoming meal details</h2>

        <Field label="Menu item">
          <select
            name="menu"
            value={form.menu}
            onChange={handleChange}
            className="input"
          >
            {MENU_OPTIONS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Expected number of students">
          <input
            type="number"
            name="expectedStudents"
            min="1"
            value={form.expectedStudents}
            onChange={handleChange}
            className="input"
            required
          />
        </Field>

        <Field label="Food planned / prepared (kg)">
          <input
            type="number"
            name="foodPreparedKg"
            min="1"
            step="0.1"
            value={form.foodPreparedKg}
            onChange={handleChange}
            className="input"
            required
          />
        </Field>

        <Field label="Historical average waste (kg)">
          <input
            type="number"
            name="historicalAvgWasteKg"
            min="0"
            step="0.1"
            value={form.historicalAvgWasteKg}
            onChange={handleChange}
            className="input"
          />
        </Field>

        <Field label="Day of the week">
          <select
            name="dayOfWeek"
            value={form.dayOfWeek}
            onChange={handleChange}
            className="input"
          >
            {DAYS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Event / holiday info (optional)">
          <input
            type="text"
            name="eventInfo"
            placeholder="e.g. Mid-sem exams, college fest"
            value={form.eventInfo}
            onChange={handleChange}
            className="input"
          />
        </Field>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-canopy-800 text-sand-100 font-semibold py-2.5 rounded-lg hover:bg-canopy-900 transition disabled:opacity-60"
        >
          {loading ? "Analyzing…" : "Analyze Food Waste"}
        </button>

        {error && <p className="text-sm text-clay-600">{error}</p>}
      </form>

      {/* Results */}
      <div className="lg:col-span-3 space-y-4">
        {!result && !loading && (
          <div className="bg-white rounded-2xl border border-canopy-100 p-10 text-center text-ink/50">
            Fill in the meal details and click{" "}
            <strong>Analyze Food Waste</strong> to see the prediction.
          </div>
        )}

        {loading && (
          <div className="bg-white rounded-2xl border border-canopy-100 p-10 text-center text-ink/50">
            Running analysis…
          </div>
        )}

        {result && (
          <>
            <div className="bg-white rounded-2xl border border-canopy-100 p-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <ResultStat
                label="Waste risk"
                value={<RiskBadge level={result.metrics.riskLevel} />}
              />
              <ResultStat
                label="Estimated waste"
                value={`${result.metrics.estimatedWasteKg} kg`}
              />
              <ResultStat
                label="Recommended preparation"
                value={`${result.metrics.recommendedPreparationKg} kg`}
              />
              <ResultStat
                label="Potential reduction"
                value={`${result.metrics.potentialWasteReductionKg} kg`}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <ResultCard title="Possible causes">
                <ul className="list-disc list-inside space-y-1.5 text-sm text-ink/80">
                  {result.ai.possibleReasons.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </ResultCard>

              <ResultCard title="AI recommendations">
                <ul className="list-disc list-inside space-y-1.5 text-sm text-ink/80">
                  {result.ai.recommendations.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </ResultCard>
            </div>

            <div className="bg-canopy-50 border border-canopy-100 rounded-2xl p-4 text-xs text-ink/60 flex flex-wrap gap-x-6 gap-y-1">
              <span>
                Historical waste rate for this menu:{" "}
                <strong>{result.metrics.historicalWastePercent}%</strong>
              </span>
              <span>
                Prepared per student:{" "}
                <strong>{result.metrics.kgPerStudent} kg</strong>
              </span>
              <span>
                Analysis source:{" "}
                <strong>
                  {result.ai.source === "ai" ? "AI model" : "Rule-based fallback"}
                </strong>
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-ink/80 mb-1">
        {label}
      </span>
      {children}
    </label>
  );
}

function ResultStat({ label, value }) {
  return (
    <div>
      <p className="text-xs text-ink/50 mb-1">{label}</p>
      <div className="font-bold text-lg">{value}</div>
    </div>
  );
}

function ResultCard({ title, children }) {
  return (
    <div className="bg-white rounded-2xl border border-canopy-100 p-5">
      <h3 className="font-semibold mb-3">{title}</h3>
      {children}
    </div>
  );
}
