// ===========================================
// MongoDB Connection Singleton
// ===========================================
// In serverless environments (like Vercel), each API call can spin up
// a new instance. Without caching, every request would create a new
// MongoDB connection — quickly exhausting the connection pool.
//
// This module caches the Mongoose connection on the Node.js global
// object so it persists across hot reloads (dev) and across
// invocations in the same serverless container (production).
// ===========================================

import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || '';

// Extend the global type to include our mongoose cache
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Use a global variable to cache the connection across hot reloads in dev
const globalWithMongoose = global as typeof global & {
  mongoose: MongooseCache;
};

let cached: MongooseCache = globalWithMongoose.mongoose || {
  conn: null,
  promise: null,
};

if (!globalWithMongoose.mongoose) {
  globalWithMongoose.mongoose = cached;
}

/**
 * Connect to MongoDB. Returns the cached connection if available,
 * otherwise creates a new one and caches it.
 */
async function dbConnect(): Promise<typeof mongoose> {
  if (!MONGODB_URI) {
    throw new Error(
      'Please define the MONGODB_URI environment variable in .env.local'
    );
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Fail immediately if not connected
      maxPoolSize: 10,       // Keep a pool of up to 10 connections for reuse
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of hanging
      socketTimeoutMS: 45000,         // Close inactive sockets after 45s
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null; // Reset on failure so next call retries
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
