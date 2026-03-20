"use client";

import { useState } from "react";

interface ResultCardProps {
  translation: string;
  keywords: string[];
}

export function ResultCard({ translation, keywords }: ResultCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(translation);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard not available */
    }
  };

  return (
    <section
      aria-label="Translation result"
      className="animate-fade-in-up rounded-2xl border border-[#334155] bg-[#1E293B] shadow-[0_4px_24px_rgba(0,0,0,0.4)] overflow-hidden"
    >
      {/* Translation section */}
      <div className="px-5 pt-5 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold tracking-widest uppercase text-[#94A3B8]">
              Translation
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#0F172A] text-[#22C55E] border border-[#334155]">
              English
            </span>
          </div>

          <button
            onClick={handleCopy}
            aria-label="Copy translation to clipboard"
            className="
              flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
              border transition-all duration-200
              border-[#334155] text-[#94A3B8] bg-[#0F172A]
              hover:border-[#3B82F6] hover:text-[#3B82F6]
              active:scale-95
            "
          >
            {copied ? (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3.5 w-3.5 text-[#22C55E]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span className="text-[#22C55E]">Copied!</span>
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3.5 w-3.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                  <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                </svg>
                Copy Translation
              </>
            )}
          </button>
        </div>

        <p className="text-[#E2E8F0] text-base leading-relaxed font-sans whitespace-pre-wrap">
          {translation}
        </p>
      </div>

      {/* Divider */}
      <div className="h-px bg-[#334155] mx-5" />

      {/* Keywords section */}
      <div className="px-5 py-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-semibold tracking-widest uppercase text-[#94A3B8]">
            Keywords
          </span>
          <span className="text-xs text-[#475569]">{keywords.length} extracted</span>
        </div>

        {keywords.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {keywords.map((keyword, index) => (
              <span
                key={index}
                className="
                  inline-flex items-center px-3 py-1 rounded-full
                  text-xs font-medium
                  bg-[#0F172A] border border-[#334155]
                  text-[#94A3B8]
                  transition-all duration-150
                  hover:border-[#3B82F6] hover:text-[#3B82F6] hover:bg-[#1e3a5f]/30
                  cursor-default
                "
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {keyword}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-[#475569]">No keywords extracted.</p>
        )}
      </div>
    </section>
  );
}
