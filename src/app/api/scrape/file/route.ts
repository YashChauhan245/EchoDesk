// ===========================================
// File Scraper API Route
// ===========================================
// POST /api/scrape/file
//
// Accepts a PDF or TXT file via multipart/form-data,
// extracts the text content, and returns it.
// ===========================================

import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';

// Polyfill browser globals required by pdfjs-dist internally.
// This prevents Next.js route pre-rendering evaluation from crashing
// with "ReferenceError: DOMMatrix is not defined".
if (typeof global !== 'undefined') {
  if (!(global as any).DOMMatrix) {
    (global as any).DOMMatrix = class DOMMatrix {};
  }
  if (!(global as any).ImageData) {
    (global as any).ImageData = class ImageData {};
  }
  if (!(global as any).Path2D) {
    (global as any).Path2D = class Path2D {};
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Size limit: 2MB
    const MAX_SIZE = 2 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: 'File size exceeds the 2MB limit' },
        { status: 400 }
      );
    }

    const fileName = file.name.toLowerCase();
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let extractedText = '';

    if (fileName.endsWith('.txt')) {
      // Plain text file
      extractedText = buffer.toString('utf-8');
    } else if (fileName.endsWith('.pdf')) {
      // PDF file extraction (Lazily import pdf-parse inside the check block)
      try {
        const pdfParse = require('pdf-parse');
        const parsed = await pdfParse(buffer);
        extractedText = parsed.text || '';
      } catch (pdfErr) {
        console.error('Failed to parse PDF:', pdfErr);
        return NextResponse.json(
          { error: 'Failed to extract text from PDF file. The file may be corrupt or scanned images only.' },
          { status: 422 }
        );
      }
    } else {
      return NextResponse.json(
        { error: 'Unsupported file format. Please upload a .txt or .pdf file.' },
        { status: 400 }
      );
    }

    // Clean up text slightly (remove excess carriage returns, double spacing)
    const cleanedText = extractedText
      .replace(/\r\n/g, '\n')
      .replace(/[ \t]+/g, ' ')
      .replace(/\n\s*\n\s*\n+/g, '\n\n') // Limit max consecutive blank lines
      .trim();

    return NextResponse.json({
      text: cleanedText,
      fileName: file.name,
      fileSize: file.size,
    });
  } catch (error) {
    console.error('POST /api/scrape/file error:', error);
    return NextResponse.json(
      { error: 'Failed to process file upload' },
      { status: 500 }
    );
  }
}
