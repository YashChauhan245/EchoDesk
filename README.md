# EchoDesk — Enterprise AI Customer Support Chatbot Platform

EchoDesk is a modern, production-grade B2B SaaS platform that enables businesses to train intelligent customer support chatbots on custom knowledge bases (product documents, files, and website URLs) and deploy them to any website in minutes with a single line of script.

---

## 🚀 Key Features

*   **Multi-Tenant Knowledge Engine**: 
    *   **URL Scraper**: Dynamically extract text content from any website URL (compiled into clean markdown using `html-to-text`).
    *   **Document Processor**: Parse uploaded PDF files (extracted server-side using `pdf-parse`).
*   **Google Gemini AI Core**: Trained context-aware chatbots powered by `@google/genai` (Google Gemini models) for fast, conversational support answers.
*   **One-Line Embeddable Chatbot**: Public JavaScript widget ([chatbot.js](file:///c:/Users/Yash/Desktop/echodesk/public/chatbot.js)) that can be dropped into any website's HTML `<body>` to load a floating chat bubble.
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
│   └── logo.png            # Main platform branding logo
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── api/            # API Route Handlers (Auth, Chat, Razorpay, Scrape, Settings, Widget)
│   │   ├── dashboard/      # Protected user workspace panels (Settings, Embed, Preview, Billing)
│   │   ├── login/          # Custom theme-responsive login screen
│   │   ├── test/           # Sandbox storefront demo route for widget testing
│   │   ├── layout.tsx      # Root layout (loads Plus Jakarta Sans display fonts)
│   │   └── globals.css     # Tailwind v4 configuration, theme variables & animations
│   ├── components/         # Reusable React components (ThemeToggle)
│   ├── lib/                # Database connections & SDK clients (db, razorpay, scalekit, session)
│   ├── models/             # MongoDB Mongoose schemas (User, ChatbotSettings, Conversation, Subscription)
│   ├── types/              # TypeScript interface definitions
│   └── middleware.ts       # Edge route interceptor & session protection
└── package.json            # Dependencies & build pipelines
```

### Key Modules & Components
*   [src/app/page.tsx](file:///c:/Users/Yash/Desktop/echodesk/src/app/page.tsx): Modern high-converting SaaS landing page with responsive animations and interactive chat preview widget.
*   [src/app/login/page.tsx](file:///c:/Users/Yash/Desktop/echodesk/src/app/login/page.tsx): Seamless, dual-mode portal supporting enterprise Google SSO and security key registration.
*   [src/app/dashboard/page.tsx](file:///c:/Users/Yash/Desktop/echodesk/src/app/dashboard/page.tsx): Main supervisor panel showing metrics, subscriptions status, and chatbot status details.
*   [src/app/dashboard/settings/page.tsx](file:///c:/Users/Yash/Desktop/echodesk/src/app/dashboard/settings/page.tsx): Panel for training knowledge bases (crawling URLs, uploading PDFs) and customizing widget properties.
*   [src/app/dashboard/preview/page.tsx](file:///c:/Users/Yash/Desktop/echodesk/src/app/dashboard/preview/page.tsx): Direct playground testing panel displaying the chatbot interface exactly how end-users experience it.
*   [src/app/dashboard/embed/page.tsx](file:///c:/Users/Yash/Desktop/echodesk/src/app/dashboard/embed/page.tsx): Code generation module providing copy-paste integration scripts.
*   [src/app/dashboard/pricing/page.tsx](file:///c:/Users/Yash/Desktop/echodesk/src/app/dashboard/pricing/page.tsx): Manage active levels (Free, Starter, Pro) with complete Razorpay integration.
*   [src/app/test/page.tsx](file:///c:/Users/Yash/Desktop/echodesk/src/app/test/page.tsx): Simulated storefront web page designed to debug the widget script and bubble responsiveness.
*   [src/middleware.ts](file:///c:/Users/Yash/Desktop/echodesk/src/middleware.ts): Edge middleware restricting non-public access to `/dashboard/*` when no active session cookie is present.

---

## 📡 API Reference

### 🔐 Authentication & Accounts
*   **POST** `/api/auth/login`
    *   Initiates Scalekit Single Sign-On (SSO) login/redirection flow or passkey challenges.
*   **GET** `/api/auth/callback`
    *   OAuth 2.0 callback code verification handler. Creates a secure session cookie on success.
*   **POST** `/api/auth/logout`
    *   Destroys the session and clears authentication cookies.

### 🤖 Chatbot Settings & Inference
*   **GET** `/api/settings`
    *   Fetch all active chatbots and current subscription details for the authorized organization.
*   **POST** `/api/settings`
    *   Create or update chatbot definitions (name, welcome message, hex custom theme, knowledge text).
*   **POST** `/api/chat`
    *   Submit a user message. Uses Google Gemini API to return context-informed answers based on organization training data.
*   **GET** `/api/widget`
    *   Retrieve public chatbot details (custom theme, names, welcome greeting) to load in the embeddable script.

### 🌐 Scrapers & Data Extraction
*   **POST** `/api/scrape/url`
    *   Scrapes web page text content from a given URL and converts it into structured Markdown.
*   **POST** `/api/scrape/file`
    *   Extracts text content from uploaded PDF documentation using `pdf-parse`.

### 💳 Razorpay Payments & Subscriptions
*   **POST** `/api/razorpay/checkout`
    *   Initiate Razorpay checkout session and create a subscription instance.
*   **POST** `/api/razorpay/verify`
    *   Verify the Razorpay payment signature before enabling paid status limits.
*   **POST** `/api/razorpay/webhook`
    *   Listen to Razorpay system events (`subscription.authenticated`, `subscription.activated`, `subscription.charged`, `subscription.cancelled`) to toggle limits dynamically.

---

## 🗄️ Database Schemas & Models

The platform enforces database-level tenant isolation using `organizationId`. The following MongoDB Mongoose schemas define the application:

### 1. User Schema
Defined in [src/models/User.ts](file:///c:/Users/Yash/Desktop/echodesk/src/models/User.ts). Stores organization context mapped from auth provider credentials:
*   `scalekitUserId`: Unique Scalekit user subject identifier.
*   `organizationId`: Matches target business instance.
*   `email` & `name`: User contact parameters.

### 2. Chatbot Settings Schema
Defined in [src/models/ChatbotSettings.ts](file:///c:/Users/Yash/Desktop/echodesk/src/models/ChatbotSettings.ts). Stores chatbot personality configurations and training resources:
*   `chatbotName`: Default display title.
*   `businessName`: Name of the tenant business.
*   `knowledgeBase`: Multi-resource raw and scraped markdown text (up to 50,000 characters).
*   `widgetColor`: Widget brand theme color (hex string).
*   `welcomeMessage`: Default greeting string.

### 3. Conversation Schema
Defined in [src/models/Conversation.ts](file:///c:/Users/Yash/Desktop/echodesk/src/models/Conversation.ts). Stores session-scoped history for returning customers:
*   `sessionId`: Session identifier persistent in visitor browser.
*   `messages`: Embedded array containing `{ role: 'user' | 'assistant', content: string, timestamp: Date }`.

### 4. Subscription Schema
Defined in [src/models/Subscription.ts](file:///c:/Users/Yash/Desktop/echodesk/src/models/Subscription.ts). Tracks API credits and chatbot instantiation rules:
*   `plan`: `'FREE' | 'STARTER' | 'PRO'`.
*   `limits`: `{ maxChatbots, maxWebsites, maxMessages }`.
*   `usage`: `{ messagesUsed, chatbotsCreated }`.

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

*   **Edge Middleware Protection**: Requests to `/dashboard/*` are intercepted at the edge via [src/middleware.ts](file:///c:/Users/Yash/Desktop/echodesk/src/middleware.ts). Access is restricted unless a secure session cookie exists.
*   **HttpOnly Cookies**: Session tokens and JWTs are exchanged server-side and stored in encrypted `HttpOnly` cookies, preventing client-side script access and cross-site scripting (XSS) exposures.
*   **Server-Side Verification**: Authentication exchanges, Razorpay signature validations, and scraping logic are handled in Node.js Route Handlers. Webhook payloads are verified using SHA-256 HMAC cryptographic signatures.
