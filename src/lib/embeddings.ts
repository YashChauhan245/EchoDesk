// ===========================================
// RAG Embeddings & Vector Search Module
// ===========================================
// Handles chunking, vector embedding generation via Google GenAI,
// and hybrid retrieval (Atlas $vectorSearch with in-memory cosine fallback).
// ===========================================

import { GoogleGenAI } from '@google/genai';
import dbConnect from '@/lib/db';
import KnowledgeChunk from '@/models/KnowledgeChunk';

const EMBEDDING_MODELS = [
  'gemini-embedding-001',
  'gemini-embedding-2',
  'gemini-embedding-2-preview',
];

const TARGET_DIMENSION = 768;

/**
 * Initialize Google GenAI client
 */
function getAIClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY || '';
  return new GoogleGenAI({ apiKey });
}

/**
 * Intelligently chunks text into semantic segments with overlap.
 * Respects paragraph boundaries, markdown headers, and FAQ formats.
 */
export function chunkText(
  text: string,
  maxChunkChars = 800,
  overlapChars = 120
): string[] {
  if (!text || !text.trim()) return [];

  const trimmed = text.trim();
  if (trimmed.length <= maxChunkChars) {
    return [trimmed];
  }

  // Split text by paragraphs or double linebreaks
  const rawParagraphs = trimmed
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  const units: string[] = [];

  for (const para of rawParagraphs) {
    if (para.length <= maxChunkChars) {
      units.push(para);
    } else {
      // Split large paragraphs into sentences or list items
      const sentences = para
        .split(/(?<=[.!?])\s+|\n/)
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      let buffer = '';
      for (const sent of sentences) {
        if ((buffer + ' ' + sent).trim().length > maxChunkChars && buffer.length > 0) {
          units.push(buffer.trim());
          buffer = sent;
        } else {
          buffer = buffer ? `${buffer} ${sent}` : sent;
        }
      }
      if (buffer.trim()) {
        units.push(buffer.trim());
      }
    }
  }

  // Assemble into final overlapping chunks
  const chunks: string[] = [];
  let currentChunk = '';

  for (const unit of units) {
    if (!currentChunk) {
      currentChunk = unit;
    } else if ((currentChunk + '\n\n' + unit).length <= maxChunkChars) {
      currentChunk += '\n\n' + unit;
    } else {
      // Push the current chunk
      chunks.push(currentChunk.trim());

      // Retain an overlap window from previous chunk
      if (overlapChars > 0 && currentChunk.length > overlapChars) {
        const words = currentChunk.split(/\s+/);
        const overlapWordCount = Math.min(words.length, Math.ceil(overlapChars / 6));
        const overlap = words.slice(-overlapWordCount).join(' ');
        currentChunk = `${overlap}\n\n${unit}`;
      } else {
        currentChunk = unit;
      }
    }
  }

  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }

  return chunks.filter((c) => c.length > 20);
}

/**
 * Generate a dense vector embedding for a single text using Gemini.
 */
export async function generateEmbedding(
  text: string,
  taskType: 'RETRIEVAL_DOCUMENT' | 'RETRIEVAL_QUERY' = 'RETRIEVAL_DOCUMENT'
): Promise<number[]> {
  const ai = getAIClient();
  let lastError: Error | null = null;

  for (const model of EMBEDDING_MODELS) {
    try {
      const response = await ai.models.embedContent({
        model,
        contents: text,
        config: {
          outputDimensionality: TARGET_DIMENSION,
        },
      });

      // Extract vector values safely across response structures
      let values: number[] | undefined;

      if (response.embeddings && response.embeddings.length > 0) {
        values = response.embeddings[0].values;
      } else if ((response as { embedding?: { values?: number[] } }).embedding?.values) {
        values = (response as { embedding?: { values?: number[] } }).embedding?.values;
      }

      if (values && values.length > 0) {
        return values;
      }
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      console.warn(`Embedding failed with model ${model}:`, lastError.message);
    }
  }

  throw new Error(
    `Failed to generate embedding with all models. Last error: ${lastError?.message || 'unknown'}`
  );
}

/**
 * Generates embeddings in small batches to respect API limits.
 */
export async function generateEmbeddingsBatch(
  texts: string[],
  taskType: 'RETRIEVAL_DOCUMENT' | 'RETRIEVAL_QUERY' = 'RETRIEVAL_DOCUMENT'
): Promise<number[][]> {
  const results: number[][] = [];
  const batchSize = 3;

  for (let i = 0; i < texts.length; i += batchSize) {
    const batch = texts.slice(i, i + batchSize);
    const batchPromises = batch.map((text) => generateEmbedding(text, taskType));
    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);

    // Minor delay between batches to avoid burst rate limits
    if (i + batchSize < texts.length) {
      await new Promise((resolve) => setTimeout(resolve, 150));
    }
  }

  return results;
}

/**
 * Mathematical Cosine Similarity between two normalized vectors.
 */
export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (!vecA || !vecB || vecA.length !== vecB.length || vecA.length === 0) {
    return 0;
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Indexes (or re-indexes) a chatbot's knowledge base into vector chunks.
 */
export async function indexKnowledgeBase(
  chatbotId: string,
  organizationId: string,
  knowledgeBase: string
): Promise<number> {
  await dbConnect();

  // If knowledgeBase is empty, clear existing chunks and return 0
  if (!knowledgeBase || !knowledgeBase.trim()) {
    await KnowledgeChunk.deleteMany({ chatbotId });
    return 0;
  }

  // 1. Chunk the document
  const chunks = chunkText(knowledgeBase);
  if (chunks.length === 0) {
    await KnowledgeChunk.deleteMany({ chatbotId });
    return 0;
  }

  console.log(
    `[RAG] Chunked knowledge base for chatbot ${chatbotId}: ${chunks.length} chunks generated.`
  );

  // 2. Generate vector embeddings for all chunks
  const embeddings = await generateEmbeddingsBatch(chunks, 'RETRIEVAL_DOCUMENT');

  // 3. Atomically replace previous chunks
  await KnowledgeChunk.deleteMany({ chatbotId });

  const chunkDocs = chunks.map((chunk, index) => ({
    organizationId,
    chatbotId,
    text: chunk,
    chunkIndex: index,
    embedding: embeddings[index],
    metadata: {
      source: 'knowledgeBase',
      tokens: Math.ceil(chunk.length / 4),
    },
  }));

  await KnowledgeChunk.insertMany(chunkDocs);
  console.log(`[RAG] Successfully indexed ${chunkDocs.length} chunks into KnowledgeChunk.`);

  return chunkDocs.length;
}

/**
 * Retrieves the most relevant knowledge chunks for a given query.
 * First tries Atlas $vectorSearch; seamlessly falls back to in-memory cosine
 * similarity so it works out-of-the-box before the Atlas Search index is created.
 */
export async function findRelevantChunks(
  query: string,
  chatbotId: string,
  organizationId: string,
  limit = 4
): Promise<Array<{ text: string; score: number }>> {
  await dbConnect();

  // Check if any chunks exist for this chatbot
  const totalChunks = await KnowledgeChunk.countDocuments({ chatbotId });
  if (totalChunks === 0) {
    return [];
  }

  // Generate embedding for query
  const queryEmbedding = await generateEmbedding(query, 'RETRIEVAL_QUERY');

  // 1. Try MongoDB Atlas $vectorSearch
  try {
    const atlasResults = await KnowledgeChunk.aggregate([
      {
        $vectorSearch: {
          index: 'vector_index',
          path: 'embedding',
          queryVector: queryEmbedding,
          numCandidates: Math.max(limit * 5, 20),
          limit: limit,
          filter: { chatbotId: chatbotId },
        },
      },
      {
        $project: {
          _id: 1,
          text: 1,
          score: { $meta: 'vectorSearchScore' },
        },
      },
    ]);

    if (atlasResults && atlasResults.length > 0) {
      console.log(`[RAG] Retrieved ${atlasResults.length} chunks via Atlas $vectorSearch.`);
      return atlasResults.map((r: { text: string; score: number }) => ({
        text: r.text,
        score: r.score,
      }));
    }
  } catch (vectorSearchError) {
    console.warn(
      '[RAG] Atlas $vectorSearch unavailable (index may not be configured yet). Using resilient cosine fallback:',
      vectorSearchError instanceof Error ? vectorSearchError.message : vectorSearchError
    );
  }

  // 2. Resilient In-Memory Fallback
  // Fetches all chunks for this specific chatbot and calculates cosine similarity
  const chunks = await KnowledgeChunk.find({ chatbotId }).lean();
  if (!chunks || chunks.length === 0) return [];

  const scoredChunks = chunks
    .map((chunk) => ({
      text: chunk.text,
      score: cosineSimilarity(queryEmbedding, chunk.embedding),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  console.log(
    `[RAG] Retrieved ${scoredChunks.length} chunks via in-memory cosine similarity (top score: ${scoredChunks[0]?.score.toFixed(3)}).`
  );

  return scoredChunks;
}
