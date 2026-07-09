// ===========================================
// Subscription Model
// ===========================================
// Stores subscription plans, current limits, and usages
// for each organization (multi-tenant isolation).
// ===========================================

import mongoose, { Schema, Document } from 'mongoose';
import type { ISubscription } from '@/types';

export interface ISubscriptionDocument
  extends Omit<ISubscription, '_id'>,
    Document {}

const SubscriptionSchema = new Schema<ISubscriptionDocument>(
  {
    organizationId: {
      type: String,
      required: [true, 'Organization ID is required'],
      unique: true,
      index: true,
    },
    plan: {
      type: String,
      enum: ['FREE', 'STARTER', 'PRO'],
      default: 'FREE',
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
      required: true,
    },
    razorpayCustomerId: {
      type: String,
    },
    razorpaySubscriptionId: {
      type: String,
    },
    currentPeriodEnd: {
      type: Date,
    },
    limits: {
      maxChatbots: {
        type: Number,
        default: 1,
        required: true,
      },
      maxWebsites: {
        type: Number,
        default: 1,
        required: true,
      },
      maxMessages: {
        type: Number,
        default: 500,
        required: true,
      },
    },
    usage: {
      messagesUsed: {
        type: Number,
        default: 0,
        required: true,
      },
      chatbotsCreated: {
        type: Number,
        default: 0,
        required: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

const Subscription =
  mongoose.models.Subscription ||
  mongoose.model<ISubscriptionDocument>('Subscription', SubscriptionSchema);

export default Subscription;
