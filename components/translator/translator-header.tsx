export function TranslatorHeader() {
  return (
    <header className="text-center mb-10 select-none">
      {/* Small label badge */}
      <div className="inline-flex items-center gap-2 mb-5 px-3 py-1.5 rounded-full border border-[#334155] bg-[#1E293B] text-xs font-medium tracking-widest uppercase text-[#3B82F6]">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22C55E] opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#22C55E]" />
        </span>
        AI Powered
      </div>

      <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-balance text-[#E2E8F0] mb-3">
        AI Translator
      </h1>
      <p className="text-base md:text-lg text-[#94A3B8] text-balance max-w-md mx-auto leading-relaxed">
        Translate Chinese into English with intelligent keyword extraction
      </p>
    </header>
  );
}
