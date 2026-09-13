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

export default function WasteHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchWasteHistory()
      .then(setHistory)
      .catch(() => setError("Could not load waste history from the server."))
      .finally(() => setLoading(false));
  }, []);

  const chartData = history.map((r) => ({
    label: r.date.slice(5),
    Prepared: r.foodPreparedKg,
    Wasted: r.foodWastedKg,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Waste History</h1>
        <p className="text-ink/60 text-sm mt-1">
          Sample records from recent canteen meals, used to detect patterns.
        </p>
      </div>

      {error && <p className="text-clay-600 text-sm">{error}</p>}

      <div className="bg-white rounded-2xl border border-canopy-100 p-6">
        <h2 className="font-semibold mb-4">Food Prepared vs Food Wasted</h2>
        {!loading && (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#EDE9DC" />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 12 }} unit=" kg" />
              <Tooltip />
              <Legend />
              <Bar dataKey="Prepared" fill="#276A4D" radius={[3, 3, 0, 0]} />
              <Bar dataKey="Wasted" fill="#C1502E" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-canopy-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-canopy-50 text-left text-ink/60">
              <tr>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Day</th>
                <th className="px-4 py-3 font-medium">Menu</th>
                <th className="px-4 py-3 font-medium text-right">Students</th>
                <th className="px-4 py-3 font-medium text-right">
                  Prepared (kg)
                </th>
                <th className="px-4 py-3 font-medium text-right">
                  Wasted (kg)
                </th>
                <th className="px-4 py-3 font-medium text-right">Waste %</th>
              </tr>
            </thead>
            <tbody>
              {history.map((r, i) => (
                <tr
                  key={i}
                  className={i % 2 === 0 ? "bg-white" : "bg-canopy-50/40"}
                >
                  <td className="px-4 py-2.5">{r.date}</td>
                  <td className="px-4 py-2.5">{r.day}</td>
                  <td className="px-4 py-2.5">{r.menu}</td>
                  <td className="px-4 py-2.5 text-right">
                    {r.studentsServed}
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    {r.foodPreparedKg}
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    {r.foodWastedKg}
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    {((r.foodWastedKg / r.foodPreparedKg) * 100).toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
