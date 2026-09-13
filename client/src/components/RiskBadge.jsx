const STYLES = {
  Low: "bg-canopy-100 text-canopy-800 border-canopy-600",
  Medium: "bg-harvest-100 text-harvest-500 border-harvest-500",
  High: "bg-clay-100 text-clay-600 border-clay-600",
};

export default function RiskBadge({ level }) {
  const style = STYLES[level] || STYLES.Low;
  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-sm font-semibold border ${style}`}
    >
      {level} risk
    </span>
  );
}
