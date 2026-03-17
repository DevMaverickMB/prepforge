"use client";

import { useEffect, useState, useCallback } from "react";
import { Flame } from "lucide-react";

interface DailyQuoteProps {
  streak?: number;
}

export function DailyQuote({ streak = 0 }: DailyQuoteProps) {
  const [quote, setQuote] = useState("");
  const [author, setAuthor] = useState("");

  const fetchQuote = useCallback(async () => {
    try {
      const res = await fetch("/api/quote");
      if (res.ok) {
        const data = await res.json();
        setQuote(data.quote);
        setAuthor(data.author);
      }
    } catch {
      // silently keep the current quote
    }
  }, []);

  useEffect(() => {
    fetchQuote();
    const interval = setInterval(fetchQuote, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchQuote]);

  if (!quote) return null;

  // Dimensions for the cutout
  const cutoutW = 180; // px width of the top-right cutout
  const cutoutH = 50;  // px height of the top-right cutout
  const r = 20;        // inner concave corner radius
  const sr = 12;       // small outward junction corner radius

  return (
    <div className="relative w-full">
      {/* The full card */}
      <div className="relative rounded-[20px] border border-white/[0.06] bg-[#0c0c0c] min-h-[100px] overflow-hidden">
        {/* Dot texture on the left */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.14]"
          style={{
            backgroundImage: `radial-gradient(rgba(255,255,255,0.7) 1px, transparent 1px)`,
            backgroundSize: "14px 14px",
            maskImage: "radial-gradient(ellipse 50% 80% at 20% 50%, black 0%, transparent 80%)",
            WebkitMaskImage: "radial-gradient(ellipse 50% 80% at 20% 50%, black 0%, transparent 80%)",
          }}
        />

        {/* Quote text — vertically centered */}
        <div className="relative z-10 px-7 pr-[200px] flex items-center min-h-[100px]">
          <div>
            <p className="text-[17px] sm:text-[19px] lg:text-[21px] font-semibold tracking-tight text-white leading-snug italic">
              &ldquo;{quote}&rdquo;
            </p>
            {author && (
              <p className="mt-1.5 text-[13px] font-medium text-white/40 tracking-wide">
                — {author}
              </p>
            )}
          </div>
        </div>

        {/*
          Top-right cutout overlay:
          Rounded at bottom-left (concave inner curve) + top-left and bottom-right (junction curves).
        */}
        <div
          className="absolute top-[-1px] right-[-1px] z-20 bg-background"
          style={{
            width: cutoutW + 1,
            height: cutoutH + 1,
            borderBottomLeftRadius: r,
            borderTopLeftRadius: sr,
            borderBottomRightRadius: sr,
          }}
        />

        {/* === Border reconstruction === */}

        {/* Top edge (left of cutout, shortened for junction arc) */}
        <div
          className="absolute z-30 h-[1px] bg-white/[0.06]"
          style={{ top: 0, left: 0, right: cutoutW + sr }}
        />

        {/* Junction 1 arc: top-right turn from top edge into cutout left edge */}
        <div
          className="absolute z-30 pointer-events-none"
          style={{
            top: 0,
            right: cutoutW,
            width: sr,
            height: sr,
            borderTopRightRadius: sr,
            borderTop: "1px solid rgba(255,255,255,0.06)",
            borderRight: "1px solid rgba(255,255,255,0.06)",
          }}
        />

        {/* Left edge of cutout (vertical, between junction 1 arc and concave arc) */}
        <div
          className="absolute z-30 w-[1px] bg-white/[0.06]"
          style={{ top: sr, right: cutoutW, height: cutoutH - r - sr }}
        />

        {/* Concave inner corner arc (bottom-left radius) */}
        <div
          className="absolute z-30 pointer-events-none"
          style={{
            top: cutoutH - r,
            right: cutoutW - r,
            width: r,
            height: r,
            borderBottomLeftRadius: r,
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            borderLeft: "1px solid rgba(255,255,255,0.06)",
          }}
        />

        {/* Bottom edge of cutout (horizontal, between concave arc and junction 2 arc) */}
        <div
          className="absolute z-30 h-[1px] bg-white/[0.06]"
          style={{ top: cutoutH, right: sr, width: cutoutW - r - sr }}
        />

        {/* Junction 2 arc: top-right turn from cutout bottom into card right edge */}
        <div
          className="absolute z-30 pointer-events-none"
          style={{
            top: cutoutH,
            right: 0,
            width: sr,
            height: sr,
            borderTopRightRadius: sr,
            borderTop: "1px solid rgba(255,255,255,0.06)",
            borderRight: "1px solid rgba(255,255,255,0.06)",
          }}
        />

        {/* Right edge of card (below junction 2 arc) */}
        <div
          className="absolute z-30 w-[1px] bg-white/[0.06]"
          style={{ top: cutoutH + sr, right: 0, bottom: 0 }}
        />
      </div>

      {/* Streak pill — positioned in the cutout area, outside the card */}
      <div
        className="absolute z-40 flex items-center justify-center"
        style={{ top: 0, right: 0, width: cutoutW, height: cutoutH }}
      >
        {streak === 0 ? (
          <div className="flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-4 py-2 backdrop-blur-sm">
            <Flame className="h-4 w-4 text-muted-foreground" />
            <span className="text-[13px] font-semibold text-muted-foreground">No active streak</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 rounded-full border border-orange-500/25 bg-orange-500/10 px-4 py-2 backdrop-blur-sm">
            <Flame className="h-4 w-4 text-orange-400" strokeWidth={2.5} />
            <span className="text-[13px] font-bold text-orange-400">
              {streak} day streak
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
