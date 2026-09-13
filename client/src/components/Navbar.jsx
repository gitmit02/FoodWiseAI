const TABS = [
  { id: "dashboard", label: "Dashboard" },
  { id: "analyze", label: "Analyze Waste" },
  { id: "history", label: "Waste History" },
  { id: "about", label: "About / Responsible AI" },
];

export default function Navbar({ activeTab, setActiveTab }) {
  return (
    <header className="bg-canopy-900 text-sand-100">
      <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-canopy-600 flex items-center justify-center text-lg">
            🌱
          </div>
          <div>
            <p className="font-bold leading-tight">FoodWise AI</p>
            <p className="text-xs text-canopy-100/80 leading-tight">
              Food Waste Prediction &amp; Reduction Assistant
            </p>
          </div>
        </div>

        <nav className="flex flex-wrap gap-2">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-canopy-100 text-canopy-900"
                  : "text-sand-100 hover:bg-canopy-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
