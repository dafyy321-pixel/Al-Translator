"use client";

import { useState } from "react";
import { TranslatorHeader } from "./translator-header";
import { InputCard } from "./input-card";
import { ResultCard } from "./result-card";
import { ErrorAlert } from "./error-alert";

interface TranslationResult {
  translation: string;
  keywords: string[];
}

export function Translator() {
  const [inputText, setInputText] = useState("");
  const [result, setResult] = useState<TranslationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultKey, setResultKey] = useState(0);

  const handleTranslate = async () => {
    if (!inputText.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Translation failed. Please try again.");
        return;
      }

      setResult(data);
      setResultKey((k) => k + 1);
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] flex flex-col items-center justify-start px-4 py-16 md:py-20">
      {/* Background grid decoration */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 overflow-hidden"
      >
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(#3B82F6 1px, transparent 1px), linear-gradient(90deg, #3B82F6 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        {/* Radial glow top */}
        <div
          className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full opacity-10"
          style={{
            background:
              "radial-gradient(ellipse at center, #3B82F6 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="relative w-full max-w-2xl flex flex-col gap-5">
        <TranslatorHeader />

        <InputCard
          value={inputText}
          onChange={setInputText}
          isLoading={isLoading}
          onTranslate={handleTranslate}
        />

        {error && <ErrorAlert message={error} />}

        {result && (
          <ResultCard
            key={resultKey}
            translation={result.translation}
            keywords={result.keywords}
          />
        )}

        {/* Footer */}
        <footer className="text-center text-xs text-[#475569] mt-4 select-none">
          Powered by ModelScope API
        </footer>
      </div>
    </div>
  );
}

