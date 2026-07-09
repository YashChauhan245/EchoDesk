// ===========================================
// TypeScript Interfaces for EchoDesk
// ===========================================

// --- User ---
export interface IUser {
  _id?: string;
  scalekitUserId: string;
  organizationId: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

// --- Chatbot Settings ---
export interface IChatbotSettings {
  _id?: string;
  organizationId: string;
  chatbotName: string;
  businessName: string;
  email: string;
  knowledgeBase: string;
  widgetColor: string;
  welcomeMessage: string;
  createdAt: Date;
  updatedAt: Date;
}

// --- Conversation ---
export interface IMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface IConversation {
  _id?: string;
  organizationId: string;
  sessionId: string;
  messages: IMessage[];
  createdAt: Date;
  updatedAt: Date;
}

// --- API Request/Response ---
export interface ChatRequest {
  organizationId: string;
  message: string;
  sessionId?: string;
}

export interface ChatResponse {
  response: string;
  sessionId: string;
}

export interface WidgetConfig {
  businessName: string;
  widgetColor: string;
  welcomeMessage: string;
}

// --- Session ---
export interface SessionPayload {
  userId: string;
  organizationId: string;
  email: string;
  name: string;
}

// --- Subscription ---
export interface ISubscription {
  _id?: string;
  organizationId: string;
  plan: 'FREE' | 'STARTER' | 'PRO';
  status: 'active' | 'inactive';
  razorpayCustomerId?: string;
  razorpaySubscriptionId?: string;
  currentPeriodEnd?: Date;
  limits: {
    maxChatbots: number;
    maxWebsites: number;
    maxMessages: number;
  };
  usage: {
    messagesUsed: number;
    chatbotsCreated: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

