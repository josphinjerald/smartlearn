# SmartLearn — Adaptive learning scaffold

This project is a starter scaffold for an AI-based adaptive learning platform (React + Firebase) focused on accessible, simplified interactions for learners.

Features included in this scaffold:
- Initial diagnostic assessment
- Learner profile storage in Firestore
- Simple heuristic classifier for levels (Beginner → Mastery)
- Recommended adaptive learning path
- Simplified AI tutor (step-by-step hints + TTS)
- Basic gamified mini-game and dashboard

Getting started

1. Install dependencies

```bash
npm install
```

2. Add Firebase config via environment variables (create a `.env` file in project root):

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

3. Run locally

```bash
npm run dev
```

Notes & next steps
- This scaffold focuses on structure and core flows. For production: add security rules, proper authentication flows, real AI integrations (server-side LLM), accessibility testing, multimedia content storage, analytics pipelines and tests.
- Do not use it as-is with real student data until you add consent, privacy, and compliance measures.

Server-side tutor (OpenAI)

This project includes a small Express-based tutor API scaffold at `server/index.js`. To enable it:

1. Install server dependencies and start the tutor API:

```bash
cd server
npm install
OPENAI_API_KEY=your_key npm start
```

2. The frontend will call `/api/tutor` by default when running in production behind the same host. For development, set `VITE_TUTOR_API_URL` to `http://localhost:4000/api/tutor` in a `.env` file.

The endpoint proxies prompts to OpenAI and returns short, simplified tutor replies. Keep your OpenAI key private and do not commit it.
