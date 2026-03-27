---
name: link-parser
description: Implements or extends EPANO's link parsing Edge Function. Use when working on URL-to-card conversion, domain-specific scrapers, or the parse-link Supabase Edge Function.
---

Link parsing is EPANO's technical wedge.

## Architecture
- Supabase Edge Function (Deno runtime)
- Input: raw URL string
- Output: { title, image_url, price, rating, source_domain, category, description }

## Parsing Strategy (in order)
1. Open Graph tags (og:title, og:image, og:description) – works for 80%
2. Domain-specific regex for top 10 travel domains
3. Fallback: URL + domain name + empty fields for manual editing

## Domain Mapping
booking.com → accommodation | airbnb.com → accommodation | hostelworld.com → accommodation
skyscanner.* → flight | google.com/flights → flight | kayak.* → flight
getyourguide.com → activity | viator.com → activity | tripadvisor.* → activity
rentalcars.com → car | Everything else → other

## CRITICAL: Graceful Degradation
- Missing image → category-based placeholder emoji
- Missing price → "Preis nicht verfügbar"
- Missing title → Use URL path or domain name
- Complete failure → Show URL + domain + manual edit fields
- **THE LOOP MUST NEVER BLOCK.**

## Performance: < 2 seconds end-to-end. Timeout on fetch: 5 seconds max.
