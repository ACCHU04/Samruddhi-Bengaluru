<p align="center">
  <img src="assets/logo.svg" alt="Samruddhi Bengaluru" width="600">
</p>

# Mitra NammaEco

A multi-language AI financial assistant for informal workers in Bengaluru. Provides a voice-first WhatsApp interface for financial tracking, government scheme discovery, and data-driven business decisions.

## Features

- **Natural Language Financial Tracking** — Gemini AI extracts income and expense from conversational text or voice notes, storing structured data in Firestore.
- **Multi-Language Support** — Understands and responds in Kannada, Hindi, Tamil, Telugu, and English using colloquial, workplace-appropriate language.
- **Government Scheme Matching** — Matches worker profiles (occupation, age, location) against a database of schemes and provides step-by-step application guidance.
- **Crisis-Aware Empathy** — Detects mentions of illness, accidents, or emergencies and switches to a supportive mode with relevant resource recommendations.
- **Supplier Savings Analysis** — Uses Google Maps Places and Distance Matrix APIs to calculate real wholesale market distances, auto fares, and break-even quantities.

## Architecture

```
.
├── functions/              # Firebase Cloud Functions (backend)
│   ├── index.js            # Express server + webhook handler
│   ├── messageHandler.js   # WhatsApp message routing & onboarding
│   ├── gemini.js           # Google Gemini AI integration
│   ├── database.js         # Firestore data access layer
│   ├── languages.js        # Multi-language string tables
│   ├── whatsapp.js         # WhatsApp Business API client
│   ├── voice.js            # Google Cloud STT / TTS pipeline
│   ├── maps.js             # Google Maps Places & Distance Matrix
│   ├── scheduler.js        # Scheduled daily / weekly / monthly tasks
│   └── schemes.json        # Government schemes dataset
├── nammaeco/               # React + Vite frontend
│   ├── src/pages/          # Dashboard, Schemes, Marketplace, etc.
│   └── public/
├── assets/                 # Brand assets (logo, icons)
├── scratch/                # Development / test scripts (gitignored)
├── firebase.json           # Firebase hosting & functions config
└── .gitignore
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Node.js, Express.js |
| Cloud | Firebase Cloud Functions (Gen 2), Firestore |
| AI | Google Gemini (`@google/generative-ai`) |
| Voice | Google Cloud Speech-to-Text, Text-to-Speech |
| Messaging | WhatsApp Business Cloud API |
| Maps | Google Maps Places API, Distance Matrix API |
| Frontend | React 19, Vite, Recharts, React Router |

## Getting Started

### Prerequisites

- Node.js 20+
- Firebase project with Firestore enabled
- Google Cloud project with Speech-to-Text, Text-to-Speech, and Maps APIs enabled
- WhatsApp Business API access (Meta Developer account)

### Setup

1. Clone the repository and install dependencies:

```bash
cd functions
npm install
cd ../nammaeco
npm install
```

2. Create a `.env` file in `functions/`:

```env
GEMINI_API_KEY=your_gemini_api_key
WHATSAPP_TOKEN=your_whatsapp_token
WHATSAPP_PHONE_ID=your_phone_id
VERIFY_TOKEN=your_webhook_verify_token
GOOGLE_MAPS_API_KEY=your_maps_api_key
APP_PORT=3000
```

3. Run locally:

```bash
cd functions
npm run dev
```

4. Deploy to Firebase:

```bash
firebase deploy
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | Health check |
| GET | `/status` | Bot status + total user count |
| GET | `/webhook` | WhatsApp webhook verification |
| POST | `/webhook` | Incoming WhatsApp message handler |

## Scheduled Tasks

| Task | Schedule | Description |
|------|----------|-------------|
| Daily Pulse | 8 PM IST | Evening check-in prompt |
| Weekly Summary | Sunday 7 PM IST | Income/expense report |
| Monthly Unlock | 1st of month | NammaEco tier progression |

## License

ISC
