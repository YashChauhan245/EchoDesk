// ===========================================
// KnowledgeChunk Model (RAG)
// ===========================================
// Stores segmented text chunks and their dense vector embeddings
// generated via Google Gemini Embedding models.
//
// These chunks are queried using MongoDB Atlas $vectorSearch (or
// cosine similarity fallback) to retrieve only the top relevant
// excerpts at chat inference time, reducing token waste and improving precision.
// ===========================================

import mongoose, { Schema, Document } from 'mongoose';
import type { IKnowledgeChunk } from '@/types';

export interface IKnowledgeChunkDocument
  extends Omit<IKnowledgeChunk, '_id'>,
    Document {}

const KnowledgeChunkSchema = new Schema<IKnowledgeChunkDocument>(
  {
    organizationId: {
      type: String,
      required: [true, 'Organization ID is required'],
      index: true,
    },
    chatbotId: {
      type: String,
      required: [true, 'Chatbot ID is required'],
      index: true,
    },
    text: {
      type: String,
      required: [true, 'Chunk text is required'],
    },
    chunkIndex: {
      type: Number,
      required: [true, 'Chunk index is required'],
    },
    embedding: {
      type: [Number],
      required: [true, 'Vector embedding is required'],
    },
    metadata: {
      source: { type: String, default: 'knowledgeBase' },
      tokens: { type: Number },
    },
  },
  {
    timestamps: true,
  }
);

// Fast compound lookup index
KnowledgeChunkSchema.index({ chatbotId: 1, chunkIndex: 1 });
KnowledgeChunkSchema.index({ organizationId: 1 });

const KnowledgeChunk =
  mongoose.models.KnowledgeChunk ||
  mongoose.model<IKnowledgeChunkDocument>(
    'KnowledgeChunk',
    KnowledgeChunkSchema
  );

export default KnowledgeChunk;
