import { useEffect, useState } from "react";
import { fetchWasteHistory } from "../api.js";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

export default function Dashboard({ setActiveTab }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchWasteHistory()
      .then(setHistory)
      .catch(() => setError("Could not load waste history from the server."))
      .finally(() => setLoading(false));
  }, []);

  const totalPrepared = history.reduce((s, r) => s + r.foodPreparedKg, 0);
  const totalWasted = history.reduce((s, r) => s + r.foodWastedKg, 0);
  const avgWastePercent =
    totalPrepared > 0 ? ((totalWasted / totalPrepared) * 100).toFixed(1) : "0";
  const recordCount = history.length;

  const chartData = history.slice(-8).map((r) => ({
    label: r.date.slice(5),
    Prepared: r.foodPreparedKg,
    Wasted: r.foodWastedKg,
  }));

  return (
    <div className="space-y-8">
      {/* Hero */}
      <section className="bg-canopy-900 text-sand-100 rounded-2xl px-8 py-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="max-w-xl">
          <span className="inline-block bg-canopy-600 text-sand-100 text-xs font-semibold px-3 py-1 rounded-full mb-3">
            SDG 12 — Responsible Consumption and Production
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">
            Predict food waste before it happens.
          </h1>
          <p className="mt-3 text-canopy-100/90">
            FoodWise AI helps college canteens plan preparation quantities
            using historical patterns and AI-generated recommendations, so
            good food doesn't end up in the bin.
          </p>
          <button
            onClick={() => setActiveTab("analyze")}
            className="mt-6 bg-harvest-500 text-canopy-950 font-semibold px-5 py-2.5 rounded-lg hover:brightness-105 transition"
          >
            Analyze an upcoming meal
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4 text-center md:min-w-[280px]">
          <StatCard label="Avg. waste %" value={`${avgWastePercent}%`} />
          <StatCard label="Records logged" value={recordCount} />
          <StatCard
            label="Total prepared"
            value={`${totalPrepared.toFixed(0)} kg`}
          />
          <StatCard
            label="Total wasted"
            value={`${totalWasted.toFixed(0)} kg`}
          />
        </div>
      </section>

      {/* Chart preview */}
      <section className="bg-white rounded-2xl border border-canopy-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg">Food Prepared vs Food Wasted</h2>
          <button
            onClick={() => setActiveTab("history")}
            className="text-sm text-canopy-700 font-medium hover:underline"
          >
            View full history →
          </button>
        </div>

        {loading && <p className="text-sm text-ink/60">Loading chart…</p>}
        {error && <p className="text-sm text-clay-600">{error}</p>}

        {!loading && !error && (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#EDE9DC" />
              <XAxis dataKey="label" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} unit=" kg" />
              <Tooltip />
              <Legend />
              <Bar dataKey="Prepared" fill="#276A4D" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Wasted" fill="#C1502E" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </section>

      {/* Sustainability impact */}
      <section className="grid gap-4 md:grid-cols-3">
        <InfoCard
          title="Why this matters"
          text="Uneaten food wastes the water, land, and energy used to grow it, and produces methane in landfills — directly undermining SDG 12."
        />
        <InfoCard
          title="How FoodWise helps"
          text="By spotting patterns in past waste, canteens can right-size preparation instead of guessing, cutting both waste and cost."
        />
        <InfoCard
          title="Human in the loop"
          text="AI suggests, the canteen manager decides. See the About / Responsible AI tab for details."
        />
      </section>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="bg-canopy-800 rounded-xl px-4 py-4">
      <p className="text-2xl font-extrabold">{value}</p>
      <p className="text-xs text-canopy-100/80 mt-1">{label}</p>
    </div>
  );
}

function InfoCard({ title, text }) {
  return (
    <div className="bg-white rounded-2xl border border-canopy-100 p-5">
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-sm text-ink/70 leading-relaxed">{text}</p>
    </div>
  );
}
