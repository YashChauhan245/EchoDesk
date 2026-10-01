// ===========================================
// Web Scraper URL API Route
// ===========================================
// POST /api/scrape/url
//
// Fetches the HTML of the provided URL, parses and strips
// boilerplate navigation elements, and returns clean text context.
// ===========================================

import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { convert } from 'html-to-text';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { url } = await request.json();
    if (!url || !url.trim()) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Basic URL validation
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url.trim());
      if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
        return NextResponse.json(
          { error: 'Only HTTP and HTTPS URLs are supported' },
          { status: 400 }
        );
      }

      // SSRF Protection: Prevent requests to localhost, internal network, or metadata services
      const hostname = parsedUrl.hostname.toLowerCase();
      const isPrivateOrLocal =
        hostname === 'localhost' ||
        hostname === '127.0.0.1' ||
        hostname === '0.0.0.0' ||
        hostname === '::1' ||
        hostname.endsWith('.local') ||
        hostname.startsWith('10.') ||
        hostname.startsWith('192.168.') ||
        hostname === '169.254.169.254'; // Cloud metadata IP

      if (isPrivateOrLocal) {
        return NextResponse.json(
          { error: 'Cannot scrape local or private network addresses' },
          { status: 400 }
        );
      }
    } catch {
      return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
    }

    // Fetch site HTML with a 12-second timeout
    let htmlContent = '';
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000);

      const response = await fetch(parsedUrl.toString(), {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          Accept:
            'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        },
        signal: controller.signal,
        next: { revalidate: 0 }, // Disable Next.js caching
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        return NextResponse.json(
          { error: `Failed to fetch page. Status: ${response.status} ${response.statusText}` },
          { status: 400 }
        );
      }

      // Ensure content is HTML/text, not a binary download
      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('text/html') && !contentType.includes('text/plain') && !contentType.includes('application/xhtml+xml')) {
        return NextResponse.json(
          { error: 'The URL does not point to a web page (unsupported content type: ' + (contentType.split(';')[0] || 'binary') + ')' },
          { status: 400 }
        );
      }

      htmlContent = await response.text();
    } catch (fetchErr: any) {
      console.error('Failed to scrape URL:', fetchErr);
      if (fetchErr.name === 'AbortError') {
        return NextResponse.json(
          { error: 'Website took too long to respond (timeout after 12s).' },
          { status: 408 }
        );
      }
      return NextResponse.json(
        { error: 'Failed to access the website. Make sure the link is public and accessible.' },
        { status: 400 }
      );
    }

    // Convert HTML to clean readable text
    let cleanText = '';
    try {
      cleanText = convert(htmlContent, {
        wordwrap: 120,
        selectors: [
          { selector: 'a', options: { ignoreHref: true } },
          { selector: 'img', format: 'skip' },
          { selector: 'nav', format: 'skip' },
          { selector: 'footer', format: 'skip' },
          { selector: 'header', format: 'skip' },
          { selector: 'script', format: 'skip' },
          { selector: 'style', format: 'skip' },
          { selector: 'iframe', format: 'skip' },
        ],
      });
    } catch (parseErr) {
      console.error('HTML conversion failed:', parseErr);
      return NextResponse.json(
        { error: 'Failed to parse website HTML data' },
        { status: 522 }
      );
    }

    // Clean up excessive blank lines and whitespace spacing
    const formattedText = cleanText
      .replace(/\r\n/g, '\n')
      .replace(/[ \t]+/g, ' ')
      .replace(/\n\s*\n\s*\n+/g, '\n\n')
      .trim();

    if (!formattedText || formattedText.length < 10) {
      return NextResponse.json(
        { error: 'Scraping succeeded, but no indexable text content was found on the page.' },
        { status: 422 }
      );
    }

    return NextResponse.json({
      text: formattedText,
      title: parsedUrl.hostname,
    });
  } catch (error) {
    console.error('POST /api/scrape/url error:', error);
    return NextResponse.json(
      { error: 'Failed to process website scraping' },
      { status: 500 }
    );
  }
}
