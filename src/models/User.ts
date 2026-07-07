// ===========================================
// User Model
// ===========================================
// Stores user information synced from Scalekit authentication.
// Each user belongs to exactly one organization (multi-tenant isolation).
// The scalekitUserId maps to the 'sub' claim in Scalekit tokens.
// The organizationId maps to the 'oid' claim in Scalekit tokens.
// ===========================================

import mongoose, { Schema, Document } from 'mongoose';
import type { IUser } from '@/types';

export interface IUserDocument extends Omit<IUser, '_id'>, Document {}

const UserSchema = new Schema<IUserDocument>(
  {
    scalekitUserId: {
      type: String,
      required: [true, 'Scalekit user ID is required'],
      unique: true,
      index: true,
    },
    organizationId: {
      type: String,
      required: [true, 'Organization ID is required'],
      index: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
  },
  {
    timestamps: true, // Auto-manage createdAt and updatedAt
  }
);

// Prevent model re-compilation in dev (hot reload)
const User =
  mongoose.models.User || mongoose.model<IUserDocument>('User', UserSchema);

export default User;
