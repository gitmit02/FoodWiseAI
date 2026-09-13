export default function About() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold">About FoodWise AI</h1>
        <p className="text-ink/70 mt-2 leading-relaxed">
          FoodWise AI is a prototype built for the 1M1B AI for Sustainability
          Virtual Internship, in collaboration with IBM SkillsBuild and
          AICTE. It supports <strong>SDG 12 — Responsible Consumption and
          Production</strong> by helping college canteens plan food
          preparation quantities and reduce avoidable waste.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-canopy-100 p-6">
        <h2 className="font-semibold text-lg mb-3">How it works</h2>
        <p className="text-sm text-ink/70 leading-relaxed">
          Numeric calculations — like historical waste percentage, estimated
          waste, and risk scoring — are computed with straightforward
          JavaScript logic. An AI component (an LLM when an API key is
          configured, otherwise a rule-based fallback) is used only where it
          adds real value: explaining likely causes of waste and generating
          practical, plain-language recommendations.
        </p>
      </div>

      <div className="bg-canopy-900 text-sand-100 rounded-2xl p-6">
        <h2 className="font-semibold text-lg mb-3">Responsible AI</h2>
        <ul className="space-y-2 text-sm text-canopy-100/90 list-disc list-inside">
          <li>
            AI recommendations are decision-support, not guaranteed
            predictions.
          </li>
          <li>Results depend on the quality of the data provided.</li>
          <li>No personal or sensitive student information is required.</li>
          <li>The final decision always remains with the canteen manager.</li>
          <li>
            The system avoids presenting uncertain AI outputs as guaranteed
            facts.
          </li>
        </ul>
      </div>
    </div>
  );
}
