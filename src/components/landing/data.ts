export interface SupportScenario {
  id: "pricing" | "install" | "knowledge";
  label: string;
  type: string;
  question: string;
  answer: string;
  section: string;
  excerpt: string;
  prompt: string;
}

export const EMBED =
  '<script src="https://echodesk-platform.vercel.app/chatbot.js" data-org-id="your_org_id"></script>';
export const SCENARIOS: SupportScenario[] = [
  {
    id: "pricing",
    label: "Pricing.pdf",
    type: "PDF DOCUMENT",
    question: "Can I start free and upgrade later?",
    answer:
      "Yes. The Free plan includes 1 chatbot, 1 website, and 500 AI messages per month. When you need more room, Starter is ₹799/month and Pro is ₹2,499/month.",
    section: "Plans & pricing",
    excerpt:
      "Free — ₹0/month. 1 chatbot, 1 website, 500 AI messages/month. Starter — ₹799/month. Pro — ₹2,499/month.",
    prompt: "Can I start free?",
  },
  {
    id: "install",
    label: "Setup guide",
    type: "WEBSITE PAGE",
    question: "How do I add an agent to my website?",
    answer:
      "Copy the script from your EchoDesk dashboard and paste it into your website’s HTML. Your agent will appear as a chat widget, ready to answer using the knowledge you added.",
    section: "Add your agent",
    excerpt:
      "Copy your widget script from the dashboard. Paste it into your website’s HTML and replace the organization ID with your own.",
    prompt: "How do I install it?",
  },
  {
    id: "knowledge",
    label: "Product guide.md",
    type: "KNOWLEDGE TEXT",
    question: "What can my support agent learn from?",
    answer:
      "Add your PDFs, website pages, and written FAQs. EchoDesk finds relevant pieces of that content and uses them to guide its answer. You can test important questions in the sandbox before going live.",
    section: "Your knowledge base",
    excerpt:
      "Supported knowledge sources: PDF documents, website URLs, and plain text. Relevant excerpts from your knowledge are used as context for each answer.",
    prompt: "What can it learn?",
  },
];
export const THREADS = [
  {
    initials: "JD",
    question: "How do I install the widget?",
    answer: SCENARIOS[1].answer,
    topic: "Website setup",
    flagged: false,
  },
  {
    initials: "AL",
    question: "Could you check a charge on my account?",
    answer:
      "I don’t have enough information in the knowledge base to check an individual charge. Please contact the support team so they can take a closer look.",
    topic: "Billing question",
    flagged: true,
  },
  {
    initials: "MK",
    question: "What can my agent learn from?",
    answer: SCENARIOS[2].answer,
    topic: "Getting started",
    flagged: false,
  },
];
export const PLANS = [
  {
    name: "Free",
    price: "0",
    description: "Get to know your next support agent.",
    limits: [
      "1 AI chatbot",
      "1 website deployment",
      "500 AI messages / month",
      "Standard support",
    ],
  },
  {
    name: "Starter",
    price: "799",
    description: "A little more room for a growing business.",
    limits: [
      "3 AI chatbots",
      "3 website deployments",
      "10,000 AI messages / month",
      "Fast response support",
      "Custom widget branding",
    ],
  },
  {
    name: "Pro",
    price: "2,499",
    description: "For bigger teams and busier websites.",
    limits: [
      "10 AI chatbots",
      "10 website deployments",
      "50,000 AI messages / month",
      "Priority 24/7 support",
      "Custom widget branding",
      "Advanced training context limit",
    ],
  },
];
export const FAQS: [question: string, answer: string][] = [
  [
    "What can I train my agent on?",
    "Add PDF documents, website URLs, and plain text such as product information, FAQs, and help articles. EchoDesk organizes that knowledge into relevant context for customer questions.",
  ],
  [
    "Does it only answer from my content?",
    "Your agent retrieves relevant excerpts from your knowledge and uses them as context. AI can still make mistakes. Test important questions in the sandbox and review low-confidence replies in the inbox.",
  ],
  [
    "How much code does installation take?",
    "Copy the widget script from your dashboard and paste it into your website’s HTML. Replace the organization ID with your own. There is no custom API integration to build.",
  ],
  [
    "What happens if an AI model is unavailable?",
    "EchoDesk uses a five-stage model fallback chain and a local keyword-matching fallback to provide additional ways to respond when a model or service is unavailable.",
  ],
  [
    "Can my team review the conversations?",
    "Yes. The live inbox lets you read full conversation threads, filter flagged responses, and export conversations as CSV, JSON, or a print-ready PDF.",
  ],
];
