"use client";

import { useEffect, useState } from "react";
import { Copy, Check } from "lucide-react";

const QUOTES = [
    "The only way to do great work is to love what you do.",
    "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    "Believe you can and you're halfway there.",
    "Your time is limited, don't waste it living someone else's life.",
    "I find that the harder I work, the more luck I seem to have.",
    "The secret of getting ahead is getting started.",
    "Do what you can, with what you have, where you are.",
    "Continuous improvement is better than delayed perfection.",
    "Discipline equals freedom.",
    "It always seems impossible until it's done."
];

export function DailyQuote() {
    const [quote, setQuote] = useState("");
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        // Pick a deterministic quote based on the day of the year
        const dayOfYear = Math.floor(
            (new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) /
            1000 /
            60 /
            60 /
            24
        );
        setQuote(QUOTES[dayOfYear % QUOTES.length]);
    }, []);

    const handleCopy = () => {
        navigator.clipboard.writeText(quote);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (!quote) return null;

    return (
        <div className="relative w-full overflow-hidden rounded-2xl border border-black/5 dark:border-white/[0.08] bg-zinc-50 dark:bg-[#0a0a0a] p-1 shadow-sm">
            {/* Inner container for the actual card */}
            <div className="relative flex min-h-[100px] w-full flex-col sm:flex-row items-center justify-between gap-6 overflow-hidden rounded-xl bg-white dark:bg-[#0e0e0e] px-8 py-6 ring-1 ring-black/5 dark:ring-0">

                {/* Decorative subtle dot pattern mimicking the reference image */}
                <div
                    className="pointer-events-none absolute inset-0 opacity-[0.04] dark:opacity-[0.15]"
                    style={{
                        backgroundImage: `radial-gradient(currentColor 1px, transparent 1px)`,
                        backgroundSize: "16px 16px",
                        maskImage: "radial-gradient(ellipse at left center, black 10%, transparent 60%)",
                        WebkitMaskImage: "radial-gradient(ellipse at left center, black 10%, transparent 60%)"
                    }}
                />

                {/* Content */}
                <div className="relative z-10 flex flex-1 flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-6">
                    <p className="text-lg font-medium tracking-tight text-zinc-800 dark:text-white/95 leading-relaxed sm:text-xl md:text-2xl">
                        "{quote}"
                    </p>
                </div>

                {/* Right side actions and badge */}
                <div className="relative z-10 flex shrink-0 items-center gap-4 self-end sm:self-center">
                    {/* pill badge entirely like the reference "s PRO" */}
                    <div className="hidden sm:flex items-center gap-2 rounded-full border border-black/5 dark:border-white/10 bg-black/5 dark:bg-white/5 px-3 py-1 font-mono text-xs font-semibold tracking-wider text-zinc-600 dark:text-white/70 backdrop-blur-md">
                        <span className="flex h-4 w-4 items-center justify-center rounded-[4px] bg-black/10 dark:bg-white/10 text-[10px]">
                            Q
                        </span>
                        DAILY
                    </div>

                    <button
                        onClick={handleCopy}
                        className="group flex h-12 w-12 items-center justify-center rounded-xl border border-black/5 dark:border-white/10 bg-black/5 dark:bg-white/5 transition-all hover:bg-black/10 dark:hover:bg-white/10 active:scale-95"
                        aria-label="Copy quote"
                    >
                        {copied ? (
                            <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
                        ) : (
                            <Copy className="h-5 w-5 text-zinc-500 dark:text-white/60 transition-colors group-hover:text-zinc-900 dark:group-hover:text-white" />
                        )}
                    </button>
                </div>

                {/* Subtle glow effect behind the button like the reference */}
                <div className="pointer-events-none absolute right-4 top-1/2 h-32 w-32 -translate-y-1/2 rounded-full bg-blue-500/5 dark:bg-white/[0.02] blur-2xl" />
            </div>
        </div>
    );
}
