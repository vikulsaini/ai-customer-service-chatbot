# AI Customer Service Chatbot

Production-ready full-stack web application for the MCA project **Artificial Intelligence-Based Chatbots for Customer Service in the Information Technology Sector**.

## Stack

- Frontend: React.js, Vite, Tailwind CSS, Framer Motion, dark/light mode
- Backend: Node.js, Express.js, MVC architecture
- Database: MongoDB with Mongoose
- Authentication: JWT, bcrypt password hashing, protected routes, forgot-password demo flow
- AI/NLP: OpenAI Responses API integration, local FAQ intent fallback, sentiment, keywords, categories
- Deployment: Vercel frontend, Render/Railway backend, MongoDB Atlas

The OpenAI integration uses the official Responses API pattern recommended for new text-generation apps: https://platform.openai.com/docs/guides/text-generation

## Folder Structure

```text
.
├── client
│   ├── src
│   │   ├── components
│   │   ├── context
│   │   ├── layouts
│   │   ├── pages
│   │   └── services
│   └── tailwind.config.js
├── server
│   ├── src
│   │   ├── config
│   │   ├── controllers
│   │   ├── middleware
│   │   ├── models
│   │   ├── routes
│   │   ├── services
│   │   └── utils
│   └── .env.example
└── docs
```

## Setup

1. Install dependencies:

```bash
npm run install:all
```

2. Configure backend:

```bash
cp server/.env.example server/.env
```

Set `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`, and optionally `OPENAI_API_KEY`.

3. Configure frontend:

```bash
cp client/.env.example client/.env
```

4. Seed demo data:

```bash
npm run seed --prefix server
```

5. Run locally:

```bash
npm run dev
```

Frontend: `http://localhost:5173`
Backend: `http://localhost:5000`

Demo user: `aarav@example.com` / `User@12345`
Demo admin: value from `ADMIN_EMAIL` / `ADMIN_PASSWORD`

## Key Features

- Signup, login, logout, remembered session, protected routes
- AI chatbot with typing state, timestamps, quick replies, voice-to-text, speech synthesis, emoji-ready input, attachment control, PDF export
- Context-aware conversation storage in MongoDB
- FAQ intent handling, sentiment analysis, keyword extraction, chat categorization
- FAQ collection and searchable FAQ page
- Ticket generation for urgent or unresolved IT issues
- Dedicated chat history and ticket management pages
- User dashboard with chat statistics
- Admin panel for users, chat logs, analytics, and account blocking endpoint
- SEO-friendly title and meta description
- Production security basics: Helmet, CORS, rate limiting, validation, error middleware

## Deployment

This repository includes `render.yaml` for the backend and `client/vercel.json` for the frontend.

### Backend on Render/Railway

- Root directory: `server`
- Build command: `npm install`
- Start command: `npm start`
- Environment variables: copy from `server/.env.example`
- Use MongoDB Atlas connection string for `MONGO_URI`
- Set `CLIENT_URL` to your Vercel URL
- If `MONGO_URI` is not set or MongoDB is unavailable, the API runs in in-memory demo mode. Use MongoDB Atlas for real production persistence.

### Frontend on Vercel

- Root directory: `client`
- Build command: `npm run build`
- Output directory: `dist`
- Environment variable: `VITE_API_URL=https://your-backend-url/api`

## Screenshots / Mockup Ideas

- Landing page: SaaS hero with live IT support conversation preview
- Chatbot: mobile-first messenger UI with quick replies and voice controls
- Dashboard: cards for total chats, resolved queries, active users, and NLP categories
- Admin panel: user management table, chat logs, chatbot performance metrics
- Settings: dark mode, notifications, speech, multilingual toggles

## Sample Test Data

Seed file: `server/src/utils/seed.js`

Example chatbot prompts:

- "My VPN is not connecting and this is urgent."
- "I forgot my password and cannot access the portal."
- "Outlook is not syncing new emails."
- "The production server is slow and users are complaining."

## Notes

If `OPENAI_API_KEY` is not configured, the app still works using local FAQ and NLP fallback logic. Add an API key to enable generated support responses.
