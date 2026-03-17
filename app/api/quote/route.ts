import { NextResponse } from "next/server";

interface QuoteResult {
  quote: string;
  author: string;
}

const CATEGORIES = "success,wisdom,inspirational";
const FALLBACK_QUOTES: QuoteResult[] = [
  { quote: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { quote: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { quote: "Waste no more time arguing about what a good man should be. Be one.", author: "Marcus Aurelius" },
  { quote: "Discipline equals freedom.", author: "Jocko Willink" },
  { quote: "We suffer more often in imagination than in reality.", author: "Seneca" },
];

let cached: QuoteResult | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

async function fetchNinjaQuote(): Promise<QuoteResult | null> {
  const apiKey = process.env.API_NINJAS_KEY;
  if (!apiKey) return null;

  const res = await fetch(
    `https://api.api-ninjas.com/v2/randomquotes?categories=${CATEGORIES}`,
    { headers: { "X-Api-Key": apiKey } }
  );
  if (!res.ok) return null;

  const data = await res.json();
  if (data.length > 0) {
    return { quote: data[0].quote, author: data[0].author };
  }
  return null;
}

async function fetchStoicQuote(): Promise<QuoteResult | null> {
  const res = await fetch("https://stoic-quotes.com/api/quote");
  if (!res.ok) return null;

  const data = await res.json();
  if (data.text && data.author) {
    return { quote: data.text, author: data.author };
  }
  return null;
}

async function getQuote(): Promise<QuoteResult> {
  const now = Date.now();
  if (cached && now - cacheTimestamp < CACHE_DURATION) {
    return cached;
  }

  try {
    // ~50/50 mix between stoic and motivational
    const useStoic = Math.random() < 0.5;
    const result = useStoic
      ? (await fetchStoicQuote()) ?? (await fetchNinjaQuote())
      : (await fetchNinjaQuote()) ?? (await fetchStoicQuote());

    if (result) {
      cached = result;
      cacheTimestamp = now;
      return result;
    }
  } catch {
    // fall through to cache/fallback
  }

  if (cached) return cached;
  return FALLBACK_QUOTES[Math.floor(Math.random() * FALLBACK_QUOTES.length)];
}

export async function GET() {
  const quote = await getQuote();
  return NextResponse.json(quote);
}
