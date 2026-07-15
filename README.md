# EchoDesk — Enterprise AI Customer Support Chatbot Platform

EchoDesk is a modern, production-grade B2B SaaS platform that enables businesses to train intelligent customer support chatbots on custom knowledge bases (product documents, files, and website URLs) and deploy them to any website in minutes with a single line of script.

---

## 🚀 Key Features

*   **Multi-Tenant Knowledge Engine**: 
    *   **URL Scraper**: Dynamically extract text content from any website URL (compiled into clean markdown using `html-to-text`).
    *   **Document Processor**: Parse uploaded PDF files (extracted server-side using `pdf-parse`).
*   **Google Gemini AI Core**: Trained context-aware chatbots powered by `@google/genai` (Google Gemini models) for fast, conversational support answers.
*   **One-Line Embeddable Chatbot**: Public JavaScript widget ([chatbot.js](file:///c:/Users/Yash/Desktop/echodesk/public/chatbot.js)) that can be dropped into any website's HTML `<body>` to load a floating, floating chat bubble.
*   **Sandbox Workspace & Live Preview**: A built-in chat playground panel for developers to test chatbot configurations and preview layout variations before publishing.
*   **Enterprise Authentication (SSO & Passkeys)**: Fully secure user login, Google SSO, and passwordless WebAuthn/Passkey registration powered by the **Scalekit Node SDK**.
*   **Tiered Subscription & Billing**: Multi-tier pricing structures (Free, Starter, Pro) with subscription creation, checkout flows, signature verification, and webhook event handlers integrated with **Razorpay**.
*   **Premium Dark/Light UI**: Responsive layout featuring advanced glassmorphic card overlays, custom animations (float, shimmer, marquee rows), and native **Tailwind CSS v4** styling.

---

## 🛠️ Tech Stack

*   **Framework**: Next.js (App Router, Server Components, Route Handlers, Edge Middleware)
*   **Styling**: Tailwind CSS v4, PostCSS, Lucide React (Icons)
*   **Database**: MongoDB via Mongoose (ODM)
*   **Authentication**: Scalekit SDK (OIDC, OAuth 2.0, SAML, Google SSO, Passkeys)
*   **AI Engine**: Google Gemini API via `@google/genai`
*   **Payment Gateway**: Razorpay SDK (Checkout, Webhooks, Signature Verification)
*   **Utilities**: `html-to-text` (HTML parser), `pdf-parse` (PDF text extractor), JWT session validation

---

## 📁 Project Architecture & File Flow

```
├── public/                 # Static assets & public script loaders
│   ├── chatbot.js          # Compiled client-side embeddable script
│   └── test.html           # Sandbox storefront demo for widget testing
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── api/            # API Route Handlers (Auth, Chat, Razorpay, Scrape, Widget)
│   │   ├── dashboard/      # Protected user workspace panels (Settings, Embed, Preview, Billing)
│   │   ├── login/          # Custom theme-responsive login screen
│   │   ├── layout.tsx      # Root layout (loads Plus Jakarta Sans display fonts)
│   │   └── globals.css     # Tailwind v4 configuration, theme variables & animations
│   ├── components/         # Reusable React components (ThemeToggle)
│   ├── lib/                # Database connections & SDK clients (db, razorpay, scalekit, session)
│   ├── models/             # MongoDB Mongoose schemas (User, ChatbotSettings, Conversation, Subscription)
│   ├── types/              # TypeScript interface definitions
│   └── middleware.ts       # Edge route interceptor & session protection
└── package.json            # Dependencies & build pipelines
```

---

## 🔑 Environment Configuration

Create a `.env` file in the project root directory and configure the following variables:

```env
# Application Settings
NEXT_PUBLIC_APP_URL="http://localhost:3000"
SESSION_SECRET="any-random-32-character-secret-key-here"

# MongoDB Database Connection
MONGODB_URI="mongodb+srv://<username>:<password>@cluster.mongodb.net/echodesk"

# Google Gemini API
GEMINI_API_KEY="AIzaSy..."

# Scalekit Authentication (SSO / OIDC / Passkeys)
SCALEKIT_ENV_URL="https://<your_tenant>.scalekit.dev"
SCALEKIT_CLIENT_ID="skc_..."
SCALEKIT_CLIENT_SECRET="sks_..."

# Razorpay Subscriptions & Payments
RAZORPAY_KEY_ID="rzp_test_..."
RAZORPAY_KEY_SECRET="rzp_secret_..."
RAZORPAY_WEBHOOK_SECRET="rzp_webhook_secret_..."
```

---

## 💻 Local Development

### 1. Installation
Clone the repository and install the dependencies:
```bash
npm install
```

### 2. Run the Development Server
Launch the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to view the application.

### 3. Build for Production
Generate the optimized production bundle:
```bash
npm run build
```

---

## 🔒 Security Principles

*   **Edge Middleware Protection**: Requests to `/dashboard/*` are intercepted at the edge. Route access is restricted unless a secure session cookie exists.
*   **HttpOnly Cookies**: Session tokens and JWTs are exchanged server-side and stored in encrypted `HttpOnly` cookies, preventing client-side script access and cross-site scripting (XSS) exposures.
*   **Server-Side Verification**: Authentication exchanges, Razorpay signature validations, and scraping logic are handled in Node.js Route Handlers. Webhook payloads are verified using SHA-256 HMAC cryptographic signatures.
