import { useState } from "react";
import Navbar from "./components/Navbar.jsx";
import Dashboard from "./components/Dashboard.jsx";
import AnalyzeWaste from "./components/AnalyzeWaste.jsx";
import WasteHistory from "./components/WasteHistory.jsx";
import About from "./components/About.jsx";

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="min-h-screen bg-sand-100">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="max-w-6xl mx-auto px-6 py-8">
        {activeTab === "dashboard" && (
          <Dashboard setActiveTab={setActiveTab} />
        )}
        {activeTab === "analyze" && <AnalyzeWaste />}
        {activeTab === "history" && <WasteHistory />}
        {activeTab === "about" && <About />}
      </main>

      <footer className="text-center text-xs text-ink/40 py-6">
        FoodWise AI — 1M1B AI for Sustainability Internship prototype ·
        SDG 12
      </footer>
    </div>
  );
}
