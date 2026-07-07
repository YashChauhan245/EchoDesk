// ===========================================
// ChatbotSettings Model
// ===========================================
// Stores the chatbot configuration for each organization.
// Each organization has exactly ONE chatbot settings document
// (enforced by the unique index on organizationId).
//
// The knowledgeBase field is a free-text field where the business
// owner enters all their business info: FAQs, policies, product
// details, support contact info, AI personality instructions, etc.
// This gets injected into the AI system prompt at chat time.
// ===========================================

import mongoose, { Schema, Document } from 'mongoose';
import type { IChatbotSettings } from '@/types';

export interface IChatbotSettingsDocument
  extends Omit<IChatbotSettings, '_id'>,
    Document {}

const ChatbotSettingsSchema = new Schema<IChatbotSettingsDocument>(
  {
    organizationId: {
      type: String,
      required: [true, 'Organization ID is required'],
      unique: true,
      index: true,
    },
    businessName: {
      type: String,
      required: [true, 'Business name is required'],
      trim: true,
      maxlength: [200, 'Business name cannot exceed 200 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
    },
    knowledgeBase: {
      type: String,
      required: [true, 'Knowledge base is required'],
      maxlength: [50000, 'Knowledge base cannot exceed 50,000 characters'],
    },
    widgetColor: {
      type: String,
      default: '#6366f1', // Indigo-500 — a modern, premium default
      trim: true,
    },
    welcomeMessage: {
      type: String,
      default: 'Hi there! 👋 How can I help you today?',
      trim: true,
      maxlength: [500, 'Welcome message cannot exceed 500 characters'],
    },
  },
  {
    timestamps: true,
  }
);

const ChatbotSettings =
  mongoose.models.ChatbotSettings ||
  mongoose.model<IChatbotSettingsDocument>(
    'ChatbotSettings',
    ChatbotSettingsSchema
  );

export default ChatbotSettings;
