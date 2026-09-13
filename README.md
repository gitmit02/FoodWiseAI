# FoodWise AI 🌱

**AI-Powered Food Waste Prediction and Reduction Assistant**
Prototype for the 1M1B AI for Sustainability Virtual Internship (IBM SkillsBuild & AICTE)
**Primary SDG:** SDG 12 — Responsible Consumption and Production

---

## 1. What this project does

A canteen staff member enters details about an upcoming meal (menu, expected
students, planned quantity, historical waste, day, event info). FoodWise AI
returns:

1. Estimated food waste
2. Waste risk level (Low / Medium / High)
3. Possible reasons for the waste
4. Recommended amount of food to prepare
5. AI-generated actions to reduce waste
6. Potential waste reduction (kg)

It also shows a **Waste History** table/chart from sample data, and an
**About / Responsible AI** page explaining the limits of the system.

---

## 2. Architecture (short version)

```
Browser (React + Vite + Tailwind)
        │  axios POST /api/analyze, GET /api/history
        ▼
Express server (Node.js)
   ├── wasteCalculator.js   → plain JS math: waste %, risk score, recommended kg
   └── aiService.js         → LLM call (if AI_API_KEY set) OR rule-based fallback
        │
        ▼
   data/wasteHistory.json   → sample canteen records (no database)
```

- **All numeric calculations** (waste %, risk score, recommended kg) are done
  with plain JavaScript in `server/services/wasteCalculator.js` — fast,
  deterministic, and easy to explain in a viva/demo.
- **The AI layer** only does language reasoning: possible causes and
  recommendations. If `AI_API_KEY` is set in `server/.env`, it calls an LLM
  (Anthropic Messages API format). If not, it automatically uses a
  rule-based fallback in `aiService.js`, so the app **always works for a
  demo**, even with no internet or API key.
- No database, no login/auth, no Docker — just two Node processes.

---

## 3. Project structure

```
FoodWiseAI/
│
├── client/                      React + Vite + Tailwind frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── AnalyzeWaste.jsx
│   │   │   ├── WasteHistory.jsx
│   │   │   ├── About.jsx
│   │   │   └── RiskBadge.jsx
│   │   ├── api.js               axios calls to backend
│   │   ├── App.jsx               tab-based page switcher
│   │   ├── main.jsx
│   │   └── index.css             Tailwind + small custom classes
│   ├── index.html
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── vite.config.js
│   ├── package.json
│   └── .env.example
│
├── server/                      Node.js + Express backend
│   ├── data/
│   │   └── wasteHistory.json     ~25 sample canteen records
│   ├── routes/
│   │   ├── analyze.js            POST /api/analyze
│   │   └── history.js            GET  /api/history
│   ├── services/
│   │   ├── wasteCalculator.js    numeric logic (no AI)
│   │   └── aiService.js          LLM call + rule-based fallback
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
├── README.md
└── .gitignore
```

---

## 4. How to run it locally

You need **Node.js 18+** installed.

### Step 1 — Backend (Express server)

```bash
cd server
npm install
cp .env.example .env      # on Windows: copy .env.example .env
npm start
```
 
The server starts at **http://localhost:5000**.
You should see: `FoodWise AI server listening on http://localhost:5000`

### Step 2 — Frontend (React app), in a **separate terminal**

```bash
cd client
npm install
npm run dev
```

The app opens at **http://localhost:5173**.

### Step 3 — Use the app

Open `http://localhost:5173` in your browser, go to **Analyze Waste**, fill
in the meal details, and click **Analyze Food Waste**.

> ⚠️ The backend must be running on port 5000 for the frontend to fetch
> data — always start the server first.

---

## 5. Environment variables

### `server/.env` (copy from `server/.env.example`)

| Variable      | Required? | Description                                                                 |
|---------------|-----------|-------------------------------------------------------------------------------|
| `PORT`        | No        | Port for the Express server. Defaults to `5000`.                             |
| `AI_API_KEY`  | No        | If set, FoodWise AI calls a real LLM for reasons/recommendations. If left empty, a rule-based fallback is used automatically — the app still works fully. |
| `AI_API_URL`  | No        | Override the AI endpoint. Defaults to Anthropic's Messages API.              |
| `AI_MODEL`    | No        | Override the model name. Defaults to `claude-3-5-haiku-20241022`.            |

**Never commit your real `.env` file** — only `.env.example` is included in
the ZIP, and `.env` is already listed in `.gitignore`.

### `client/.env` (optional)

Not required — the frontend is hardcoded to call `http://localhost:5000` in
`src/api.js`. `client/.env.example` is included only if you'd like to later
move that URL into an environment variable.

---

## 6. Using IBM Bob for this project

IBM Bob can be used directly on top of this codebase as a development
assistant, for example:

- **Frontend:** "Add a filter dropdown to the Waste History table" → edit `client/src/components/WasteHistory.jsx`
- **Backend:** "Add a new field for wastage cause category" → edit `server/routes/analyze.js` and `server/services/wasteCalculator.js`
- **Debugging:** paste an error from `npm run dev` or `npm start` and ask Bob to fix it
- **Sample data:** ask Bob to add more rows to `server/data/wasteHistory.json`
- **Documentation:** ask Bob to expand this README or generate a PPT summary

No separate "IBM Bob module" is built into the app — Bob is simply used as
an assistant while working on this same simple codebase.

---

## 7. Responsible AI notes

- AI recommendations are **decision-support**, not guaranteed predictions.
- Results depend on the quality of the data entered.
- No personal or sensitive student information is collected or required.
- The final decision always remains with the canteen manager.
- The app is designed to avoid presenting uncertain AI outputs as facts.

---

## 8. Things intentionally left out (by design)

Per the project brief, this prototype does **not** include: MongoDB or any
database, authentication/login, Docker, microservices, or complex ML models.
It's meant to be simple, working, and easy to explain in an internship demo.
