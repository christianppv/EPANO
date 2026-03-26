/**
 * ENAPO Link Parser – Supabase Edge Function
 *
 * Converts a raw URL into a structured option card.
 * This is ENAPO's technical wedge – the "wow moment".
 *
 * Flow: URL → fetch page → extract OG tags → domain heuristics → structured card
 * Critical rule: GRACEFUL DEGRADATION – always return a card, even if parsing fails.
 *
 * Deploy: npx supabase functions deploy parse-link
 * Test:   npx supabase functions serve parse-link
 */

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

// ─── Domain → Category Mapping ─────────────────────

const DOMAIN_CATEGORY_MAP: Record<string, string> = {
  'booking.com': 'accommodation',
  'airbnb.com': 'accommodation',
  'airbnb.de': 'accommodation',
  'hostelworld.com': 'accommodation',
  'hotels.com': 'accommodation',
  'vrbo.com': 'accommodation',
  'skyscanner.com': 'flight',
  'skyscanner.de': 'flight',
  'skyscanner.net': 'flight',
  'google.com/travel/flights': 'flight',
  'kayak.com': 'flight',
  'kayak.de': 'flight',
  'kiwi.com': 'flight',
  'getyourguide.com': 'activity',
  'getyourguide.de': 'activity',
  'viator.com': 'activity',
  'tripadvisor.com': 'activity',
  'tripadvisor.de': 'activity',
  'rentalcars.com': 'car',
  'check24.de': 'car',
  'maps.google.com': 'activity',
};

interface ParsedLink {
  url: string;
  title: string | null;
  image_url: string | null;
  price: string | null;
  rating: string | null;
  source_domain: string | null;
  category: string;
  description: string | null;
}

// ─── Helpers ────────────────────────────────────────

function extractDomain(url: string): string | null {
  try {
    const hostname = new URL(url).hostname.replace(/^www\./, '');
    return hostname;
  } catch {
    return null;
  }
}

function categorizeByDomain(domain: string | null): string {
  if (!domain) return 'other';

  for (const [pattern, category] of Object.entries(DOMAIN_CATEGORY_MAP)) {
    if (domain.includes(pattern)) return category;
  }

  return 'other';
}

function extractMetaContent(html: string, property: string): string | null {
  // Match og: and other meta tags
  const patterns = [
    new RegExp(`<meta[^>]*property=["']${property}["'][^>]*content=["']([^"']*)["']`, 'i'),
    new RegExp(`<meta[^>]*content=["']([^"']*)["'][^>]*property=["']${property}["']`, 'i'),
    new RegExp(`<meta[^>]*name=["']${property}["'][^>]*content=["']([^"']*)["']`, 'i'),
    new RegExp(`<meta[^>]*content=["']([^"']*)["'][^>]*name=["']${property}["']`, 'i'),
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) return match[1].trim();
  }

  return null;
}

function extractTitle(html: string): string | null {
  const ogTitle = extractMetaContent(html, 'og:title');
  if (ogTitle) return ogTitle;

  const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  return titleMatch?.[1]?.trim() || null;
}

function extractPrice(html: string): string | null {
  // Common price patterns in travel sites
  const pricePatterns = [
    /(\d{1,4}[.,]\d{2})\s*€/,
    /€\s*(\d{1,4}[.,]\d{2})/,
    /(\d{1,4}[.,]\d{2})\s*EUR/i,
    /price['":\s]*(\d{1,4}[.,]?\d{0,2})\s*€?/i,
  ];

  for (const pattern of pricePatterns) {
    const match = html.match(pattern);
    if (match) return `${match[1]}€`;
  }

  return null;
}

// ─── Main Handler ───────────────────────────────────

serve(async (req: Request) => {
  // CORS headers
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers });
  }

  try {
    const { url } = await req.json();

    if (!url || typeof url !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Missing or invalid URL' }),
        { status: 400, headers }
      );
    }

    const domain = extractDomain(url);
    const category = categorizeByDomain(domain);

    // Default result (graceful degradation baseline)
    const result: ParsedLink = {
      url,
      title: null,
      image_url: null,
      price: null,
      rating: null,
      source_domain: domain,
      category,
      description: null,
    };

    // Try to fetch and parse the page (with timeout)
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000); // 5s timeout

      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; ENAPO/1.0; +https://enapo.app)',
          'Accept': 'text/html',
        },
        signal: controller.signal,
        redirect: 'follow',
      });

      clearTimeout(timeout);

      if (response.ok) {
        const html = await response.text();

        // Extract Open Graph tags
        result.title = extractTitle(html);
        result.image_url = extractMetaContent(html, 'og:image');
        result.description = extractMetaContent(html, 'og:description');

        // Try to extract price from HTML
        result.price = extractPrice(html);

        // Extract rating if available in meta tags
        const ratingMeta = extractMetaContent(html, 'rating');
        if (ratingMeta) result.rating = ratingMeta;
      }
    } catch (fetchError) {
      // Fetch failed – that's OK. We still return the card with URL + domain.
      // GRACEFUL DEGRADATION: The loop must never block.
      console.warn(`Failed to fetch ${url}:`, fetchError);
    }

    return new Response(JSON.stringify(result), { status: 200, headers });
  } catch (error) {
    // Even on total failure, return a minimal response
    return new Response(
      JSON.stringify({
        error: 'Parse failed',
        url: null,
        title: null,
        image_url: null,
        price: null,
        rating: null,
        source_domain: null,
        category: 'other',
        description: null,
      }),
      { status: 200, headers } // 200, not 500! The UI handles missing data.
    );
  }
});
