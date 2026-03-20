"use client";

interface InputCardProps {
  value: string;
  onChange: (value: string) => void;
  isLoading: boolean;
  onTranslate: () => void;
}

const MAX_CHARS = 2000;

export function InputCard({
  value,
  onChange,
  isLoading,
  onTranslate,
}: InputCardProps) {
  const charCount = value.length;
  const isOverLimit = charCount > MAX_CHARS;
  const isEmpty = value.trim().length === 0;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      if (!isEmpty && !isLoading && !isOverLimit) {
        onTranslate();
      }
    }
  };

  return (
    <section
      aria-label="Chinese text input"
      className="rounded-2xl border border-[#334155] bg-[#1E293B] shadow-[0_4px_24px_rgba(0,0,0,0.4)] overflow-hidden transition-shadow duration-300 hover:shadow-[0_6px_32px_rgba(59,130,246,0.12)]"
    >
      {/* Card header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-[#334155]">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold tracking-widest uppercase text-[#94A3B8]">
            Input
          </span>
          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#0F172A] text-[#3B82F6] border border-[#334155]">
            Chinese
          </span>
        </div>
        <span
          className={`text-xs font-mono tabular-nums transition-colors ${
            isOverLimit
              ? "text-red-400"
              : charCount > MAX_CHARS * 0.85
                ? "text-amber-400"
                : "text-[#94A3B8]"
          }`}
        >
          {charCount.toLocaleString()} / {MAX_CHARS.toLocaleString()}
        </span>
      </div>

      {/* Textarea */}
      <div className="relative">
        <textarea
          aria-label="Enter Chinese text to translate"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="输入中文文本..."
          rows={7}
          className="w-full resize-none bg-transparent px-5 py-4 text-base leading-relaxed text-[#E2E8F0] placeholder:text-[#475569] focus:outline-none font-sans"
          disabled={isLoading}
          spellCheck={false}
        />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-5 py-3 border-t border-[#334155]">
        <span className="text-xs text-[#475569]">
          Press{" "}
          <kbd className="px-1.5 py-0.5 rounded border border-[#334155] bg-[#0F172A] text-[10px] font-mono text-[#94A3B8]">
            ⌘ Enter
          </kbd>{" "}
          to translate
        </span>

        <button
          onClick={onTranslate}
          disabled={isEmpty || isLoading || isOverLimit}
          aria-label={isLoading ? "Translating..." : "Translate text"}
          className="
            group relative flex items-center gap-2 px-5 py-2 rounded-xl
            bg-[#3B82F6] text-white text-sm font-semibold
            transition-all duration-200
            hover:bg-[#2563EB] hover:shadow-[0_0_20px_rgba(59,130,246,0.4)]
            active:scale-[0.97]
            disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#3B82F6] disabled:hover:shadow-none
          "
        >
          {isLoading ? (
            <>
              <span className="relative flex h-3.5 w-3.5">
                <svg
                  className="animate-spin h-3.5 w-3.5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
              </span>
              Translating...
            </>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3.5 w-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="m5 8 6 6" />
                <path d="m4 14 6-6 2-3" />
                <path d="M2 5h12" />
                <path d="M7 2h1" />
                <path d="m22 22-5-10-5 10" />
                <path d="M14 18h6" />
              </svg>
              Translate
            </>
          )}
        </button>
      </div>
    </section>
  );
}
