// ===========================================
// Conversation Model
// ===========================================
// Stores chat conversations between website visitors and the AI.
// Each conversation belongs to an organization and has a unique
// sessionId (generated client-side per visitor session).
//
// Messages are stored as an embedded array for fast reads —
// loading a full conversation is a single document fetch.
// The sessionId is stored in localStorage on the visitor's browser,
// so returning visitors continue their conversation.
// ===========================================

import mongoose, { Schema, Document } from 'mongoose';
import type { IConversation, IMessage } from '@/types';

export interface IConversationDocument
  extends Omit<IConversation, '_id'>,
    Document {}

const MessageSchema = new Schema<IMessage>(
  {
    role: {
      type: String,
      enum: ['user', 'assistant'],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false } // Messages don't need their own _id
);

const ConversationSchema = new Schema<IConversationDocument>(
  {
    organizationId: {
      type: String,
      required: [true, 'Organization ID is required'],
      index: true,
    },
    sessionId: {
      type: String,
      required: [true, 'Session ID is required'],
      index: true,
    },
    messages: {
      type: [MessageSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for fast lookups: find conversation by org + session
ConversationSchema.index({ organizationId: 1, sessionId: 1 }, { unique: true });

const Conversation =
  mongoose.models.Conversation ||
  mongoose.model<IConversationDocument>('Conversation', ConversationSchema);

export default Conversation;
