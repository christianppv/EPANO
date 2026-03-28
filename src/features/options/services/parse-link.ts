import { supabase } from '@/lib/supabase';
import type { OptionCategory, ParsedLinkResult } from '../types/option.types';

const VALID_CATEGORIES: OptionCategory[] = ['accommodation', 'flight', 'activity', 'car', 'other'];

function toCategory(value: string | null | undefined): OptionCategory {
  if (value && VALID_CATEGORIES.includes(value as OptionCategory)) return value as OptionCategory;
  return 'other';
}

function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

/**
 * Extracts a numeric rating from an Airbnb title string.
 * Airbnb embeds the rating in the og:title, e.g.:
 *   "Tiny House · Mickleton · ⭐4,9 · 1 Schlafzimmer"
 *   → "4.9"
 */
function extractAirbnbRating(title: string | null): string | null {
  if (!title) return null;
  const match = title.match(/[⭐★](\d[,.]?\d?)/);
  if (!match) return null;
  return match[1].replace(',', '.');
}

/**
 * Calls the parse-link Edge Function and normalises the response.
 *
 * GRACEFUL DEGRADATION (mandatory):
 * Any failure — network error, Edge Function error, unexpected payload —
 * returns a minimal card so the user can fill in the details manually.
 * The loop must never block.
 */
export async function parseLinkUrl(url: string): Promise<ParsedLinkResult> {
  const domain = extractDomain(url);

  const fallback: ParsedLinkResult = {
    url,
    title: domain,
    imageUrl: null,
    price: null,
    rating: null,
    sourceDomain: domain,
    category: 'other',
    notes: null,
  };

  try {
    const { data, error } = await supabase.functions.invoke('parse-link', {
      body: { url },
    });

    if (error || !data) return fallback;

    const isAirbnb = domain.includes('airbnb');
    const rating: string | null =
      data.rating ?? (isAirbnb ? extractAirbnbRating(data.title as string | null) : null);

    return {
      url,
      title: (data.title as string | null) ?? domain,
      imageUrl: (data.image_url as string | null) ?? null,
      price: (data.price as string | null) ?? null,
      rating,
      sourceDomain: (data.source_domain as string | null) ?? domain,
      category: toCategory(data.category as string | null),
      notes: (data.description as string | null) ?? null,
    };
  } catch {
    return fallback;
  }
}
