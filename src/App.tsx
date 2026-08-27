import React, { useState, useRef, useEffect } from 'react';
import { Play, Sparkles, RefreshCw, Copy, Check, Radio, Terminal, Cpu, Zap, Volume2, VolumeX } from 'lucide-react';
import { LanguageMode, getRandomWords, CURATED_FALLBACK_IDS } from './lexicon';

export default function App() {
  const [languageMode, setLanguageMode] = useState<LanguageMode>('RUS');
  const [tags, setTags] = useState<string[]>(['КОВБОЙ', 'НЕСЕТ', 'ОВОЩ']);
  const [hashtags, setHashtags] = useState<string>('#shorts #viral #trends #algorithm');
  const [resolvedUrl, setResolvedUrl] = useState<string>('https://www.youtube.com/watch?v=aqz-KE-bpKQ');
  const [embedUrl, setEmbedUrl] = useState<string>('https://www.youtube.com/embed/aqz-KE-bpKQ?autoplay=1&mute=1&allowfullscreen=true');
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [statusLog, setStatusLog] = useState<string>('NEURAL DISCOVERY MATRIX READY');
  const [discoveredTokensCount, setDiscoveredTokensCount] = useState<number>(14);
  const [tokenIndex, setTokenIndex] = useState<number>(5);

  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Initialize with initial tags
  useEffect(() => {
    const initialWords = getRandomWords('RUS', 3);
    setTags(initialWords);
  }, []);

  const handleCopyUrl = () => {
    if (resolvedUrl) {
      navigator.clipboard.writeText(resolvedUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Async Automation Engine on "СГЕНЕРИРОВАТЬ"
  const handleGenerate = async () => {
    if (isLoading) return;
    setIsLoading(true);
    setStatusLog('INITIALIZING QUERY PROTOCOL...');

    try {
      // Action A: Instantly refresh tags workspace dashboard with 3 random vocabulary units matching selected language modifier
      const newWords = getRandomWords(languageMode, 3);
      setTags(newWords);

      const generatedHashtags = `#shorts #${newWords[0].toLowerCase()} #${newWords[1].toLowerCase()} #neural #stream`;
      setHashtags(generatedHashtags);

      const queryString = newWords.join(' ');
      setStatusLog(`SEARCHING CATALOG: [${newWords.join(', ')}]...`);

      let isolatedVideoId = '';
      let targetChosenIndex = 5;

      // Action B & C: Silent background fetch request to search live YouTube results & regex ID capture
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(queryString)}`);
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.videoId) {
            isolatedVideoId = data.videoId;
            if (data.allFound) setDiscoveredTokensCount(data.allFound);
            if (data.chosenIndex !== undefined) setTokenIndex(data.chosenIndex + 1);
          }
        }
      } catch (fetchErr) {
        console.warn('Backend proxy search notice:', fetchErr);
      }

      // If network block/cors/fallback needed, choose from verified fallback IDs or generate deterministic token
      if (!isolatedVideoId) {
        const randomIndex = Math.floor(Math.random() * CURATED_FALLBACK_IDS.length);
        isolatedVideoId = CURATED_FALLBACK_IDS[randomIndex];
        targetChosenIndex = (randomIndex % 10) + 1;
        setTokenIndex(targetChosenIndex);
        setDiscoveredTokensCount(CURATED_FALLBACK_IDS.length);
      }

      // Action D: Output full resolved youtube address string into top green "INPUT MODULE"
      const fullYoutubeUrl = `https://www.youtube.com/watch?v=${isolatedVideoId}`;
      setResolvedUrl(fullYoutubeUrl);

      // Action E: Immediately update the central 9:16 vertical smartphone iframe embed frame target src URL with isolated video ID and forced muted autoplay sequence
      const newEmbedUrl = `https://www.youtube.com/embed/${isolatedVideoId}?autoplay=1&mute=${isMuted ? '1' : '0'}&allowfullscreen=true&rel=0&modestbranding=1`;
      setEmbedUrl(newEmbedUrl);
      setIsPlaying(true);

      if (iframeRef.current) {
        iframeRef.current.src = newEmbedUrl;
      }

      setStatusLog(`DEPLOYED ID: ${isolatedVideoId} (TOKEN #${targetChosenIndex})`);
    } catch (err: any) {
      console.error('Generation cycle error:', err);
      setStatusLog('FALLBACK DEPLOYMENT COMPLETE');
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualUrlChange = (newVal: string) => {
    setResolvedUrl(newVal);
    const trimmed = newVal.trim();
    if (!trimmed) return;

    let videoId = '';
    if (trimmed.includes('/shorts/')) {
      const match = trimmed.match(/\/shorts\/([a-zA-Z0-9_-]+)/);
      if (match && match[1]) videoId = match[1];
    } else if (trimmed.includes('watch?v=')) {
      const match = trimmed.match(/watch\?v=([a-zA-Z0-9_-]+)/);
      if (match && match[1]) videoId = match[1];
    } else if (trimmed.includes('youtu.be/')) {
      const match = trimmed.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
      if (match && match[1]) videoId = match[1];
    }

    if (videoId) {
      const manualEmbed = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=${isMuted ? '1' : '0'}&allowfullscreen=true`;
      setEmbedUrl(manualEmbed);
      setIsPlaying(true);
      if (iframeRef.current) {
        iframeRef.current.src = manualEmbed;
      }
    }
  };

  const toggleAudio = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (embedUrl) {
      const updated = embedUrl.replace(/mute=\d/, `mute=${nextMuted ? '1' : '0'}`);
      setEmbedUrl(updated);
      if (iframeRef.current) {
        iframeRef.current.src = updated;
      }
    }
  };

  return (
    <main
      id="app-root"
      className="min-h-screen w-full bg-[#0a0a0a] flex items-center justify-center p-4 sm:p-6 lg:p-10 text-zinc-100 overflow-x-hidden select-none font-sans relative"
    >
      {/* Ambient Cyber Neon Background Glows */}
      <div className="fixed -top-20 -left-20 w-96 h-96 bg-[#00ff66]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed -bottom-20 -right-20 w-96 h-96 bg-[#00f3ff]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#ff003c]/5 rounded-full blur-[180px] pointer-events-none" />

      {/* Cyber Grid Background lines */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0, 255, 102, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 102, 0.4) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="flex flex-col xl:flex-row items-center justify-center gap-8 lg:gap-14 max-w-6xl w-full relative z-10">
        {/* ========================================================================= */}
        {/* CENTERED VERTICAL SMARTPHONE VIEWPORT (360x640, 9:16 Aspect)              */}
        {/* ========================================================================= */}
        <div className="flex-none relative group">
          {/* Neon Glow Frame Boundary */}
          <div
            id="player-viewport-frame"
            className="relative w-[340px] sm:w-[360px] h-[600px] sm:h-[640px] bg-black rounded-[36px] frame-glow-green flex items-center justify-center overflow-hidden z-10 transition-all duration-300 shadow-[0_0_35px_rgba(0,255,102,0.25)]"
          >
            {/* Phone Screen Bezel Overlay */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none border-[10px] sm:border-[12px] border-black rounded-[36px] z-30" />

            {/* Top Phone Speaker / Sensor Pill Bar */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-4 bg-zinc-900/90 rounded-full z-40 flex items-center justify-center gap-2 border border-zinc-800 pointer-events-none">
              <div className="w-8 h-1 bg-zinc-700 rounded-full" />
              <div className="w-2 h-2 bg-cyan-500/80 rounded-full animate-pulse" />
            </div>

            {/* Embedded YouTube Player iframe */}
            <iframe
              ref={iframeRef}
              id="video-frame"
              src={embedUrl}
              title="YouTube Shorts Cyber Player"
              className={`w-full h-full bg-zinc-950 transition-opacity duration-300 relative z-10 ${
                isPlaying ? 'opacity-100' : 'opacity-0'
              }`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />

            {/* Standby UI (if video hasn't triggered) */}
            {!isPlaying && (
              <div
                id="placeholder"
                className="absolute inset-0 flex flex-col items-center justify-center text-zinc-600 bg-[#0c0c0c] z-0 p-6 text-center"
              >
                <div className="w-16 h-16 rounded-full border border-dashed border-[#00ff66]/50 flex items-center justify-center mb-4 relative">
                  <Play className="w-6 h-6 text-[#00ff66] fill-[#00ff66]/20 ml-0.5" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#00ff66] rounded-full animate-ping" />
                </div>
                <span className="text-[11px] tracking-[0.25em] uppercase text-[#00ff66] font-mono font-bold">
                  9:16 LIVE STREAM
                </span>
                <span className="text-[9px] tracking-widest uppercase opacity-40 mt-1 font-mono">
                  360 × 640 TARGET VIEWPORT
                </span>
              </div>
            )}

            {/* Quick Floating Sound Toggle Overlay */}
            <button
              onClick={toggleAudio}
              className="absolute bottom-5 right-5 z-40 bg-black/80 hover:bg-zinc-900 text-[#00ff66] p-2.5 rounded-full border border-[#00ff66]/50 shadow-[0_0_12px_rgba(0,255,102,0.3)] transition-all cursor-pointer"
              title={isMuted ? 'Включить звук' : 'Выключить звук'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#00ff66]" />}
            </button>
          </div>

          {/* Vertical Metadata Annotation */}
          <div
            className="hidden xl:flex absolute -right-6 top-1/2 -translate-y-1/2 flex-col gap-8 opacity-40 text-[9px] tracking-widest uppercase text-emerald-400 font-mono"
            style={{ writingMode: 'vertical-rl' }}
          >
            <span>LIVE SHORTS MATRIX STREAM v2.4</span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT MODULE CONTROL PANEL (EXACTLY 3 STACKED ELEMENTS + TELEMETRY)      */}
        {/* ========================================================================= */}
        <section
          id="control-panel"
          className="flex-1 flex flex-col gap-5 max-w-[460px] w-full"
        >
          {/* Header Title & Status */}
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
            <div>
              <h2 className="tech-font text-xl sm:text-2xl tracking-tighter text-white font-black flex items-center gap-2">
                <span className="text-[#00ff66]">MATRIX</span>
                <span>STREAM</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950/80 text-[#00ff66] border border-[#00ff66]/40 font-mono tracking-widest">
                  ONLINE
                </span>
              </h2>
              <p className="text-[10px] text-zinc-400 tracking-[0.18em] uppercase font-mono mt-0.5">
                Automated Shorts Parser Engine
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#00ff66] font-mono">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span className="text-[10px] font-bold">READY</span>
            </div>
          </div>

          {/* ===================================================================== */}
          {/* 1. TOP BLOCK: INPUT MODULE (Dynamic String URL Container)             */}
          {/* ===================================================================== */}
          <div className="flex flex-col gap-1.5" id="input-module-block">
            <div className="flex items-center justify-between">
              <label
                htmlFor="url-input"
                className="text-[10px] text-[#00ff66] font-bold tracking-widest uppercase ml-0.5 font-mono flex items-center gap-1.5"
              >
                <Terminal className="w-3 h-3 text-[#00ff66]" />
                INPUT MODULE
              </label>
              <span className="text-[9px] text-zinc-500 font-mono uppercase tracking-wider">
                Target Dynamic Address
              </span>
            </div>

            <div className="relative w-full flex items-center">
              <input
                id="url-input"
                type="text"
                value={resolvedUrl}
                onChange={(e) => handleManualUrlChange(e.target.value)}
                placeholder="ВСТАВЬТЕ ССЫЛКУ ИЛИ СГЕНЕРИРУЙТЕ"
                spellCheck={false}
                className="w-full bg-zinc-950 border-2 neon-green py-3 pl-3.5 pr-11 tech-font text-xs tracking-wider outline-none text-[#00ff66] placeholder:text-emerald-800 placeholder:font-mono rounded-none transition-all duration-200 focus:shadow-[0_0_20px_rgba(0,255,102,0.4)]"
              />
              <button
                type="button"
                onClick={handleCopyUrl}
                className="absolute right-2 text-zinc-400 hover:text-[#00ff66] p-1.5 transition-colors cursor-pointer"
                title="Скопировать ссылку"
              >
                {copied ? <Check className="w-4 h-4 text-[#00ff66]" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* ===================================================================== */}
          {/* 2. MIDDLE BLOCK: FILTERS ([РУС], [ENG], [МИКС]) + MAIN TAGS DASHBOARD */}
          {/* ===================================================================== */}
          <div className="flex flex-row items-stretch gap-3.5" id="middle-dashboard-block">
            {/* Left Column: 3 Filter Toggles stacked vertically */}
            <div className="flex flex-col justify-between gap-2 w-24 flex-shrink-0">
              {(['RUS', 'ENG', 'MIX'] as LanguageMode[]).map((mode) => {
                const labelMap = { RUS: '[РУС]', ENG: '[ENG]', MIX: '[МИКС]' };
                const isSelected = languageMode === mode;

                return (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => {
                      setLanguageMode(mode);
                      const newW = getRandomWords(mode, 3);
                      setTags(newW);
                      setHashtags(`#shorts #${newW[0].toLowerCase()} #${newW[1].toLowerCase()} #stream`);
                    }}
                    className={`flex-1 py-2.5 px-2 text-center text-xs font-mono font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer border ${
                      isSelected
                        ? 'border-[#00ff66] bg-[#00ff66]/15 text-[#00ff66] shadow-[0_0_12px_rgba(0,255,102,0.35)]'
                        : 'border-zinc-800 bg-zinc-950/80 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200'
                    }`}
                  >
                    {labelMap[mode]}
                  </button>
                );
              })}
            </div>

            {/* Right Column: Main Display Dashboard with 3 Generated Comma-Separated Tags */}
            <div className="flex-1 bg-zinc-950 border-2 border-[#00ff66]/80 p-3.5 flex flex-col justify-between shadow-[0_0_15px_rgba(0,255,102,0.15)] relative overflow-hidden">
              <div className="flex items-center justify-between text-[9px] text-zinc-500 font-mono tracking-widest uppercase border-b border-zinc-800/80 pb-1.5">
                <span className="flex items-center gap-1 text-emerald-400 font-bold">
                  <Zap className="w-2.5 h-2.5" />
                  TAGS MATRIX
                </span>
                <span className="text-zinc-500">{languageMode} MODE</span>
              </div>

              {/* 3 Generated comma-separated tags */}
              <div className="py-2.5">
                <div className="tech-font text-sm sm:text-base font-extrabold text-white tracking-wider leading-relaxed break-words text-shadow-[0_0_8px_rgba(255,255,255,0.4)]">
                  {tags.join(', ')}
                </div>
              </div>

              {/* Minor hashtag log beneath tags */}
              <div className="pt-1.5 border-t border-zinc-900 flex items-center justify-between text-[10px] font-mono text-zinc-500 tracking-wider">
                <span className="text-emerald-500/80 truncate">{hashtags}</span>
                <Sparkles className="w-3 h-3 text-[#00ff66] flex-shrink-0 ml-1 opacity-70" />
              </div>
            </div>
          </div>

          {/* ===================================================================== */}
          {/* 3. BOTTOM BLOCK: PROMINENT EXECUTION BUTTON "СГЕНЕРИРОВАТЬ"           */}
          {/* ===================================================================== */}
          <div className="flex flex-col gap-2" id="bottom-execution-block">
            <button
              id="generate-button"
              type="button"
              onClick={handleGenerate}
              disabled={isLoading}
              className="w-full h-16 sm:h-18 bg-[#0a0a0a] hover:bg-[#00ff66]/10 active:scale-[0.99] border-2 border-[#00ff66] text-[#00ff66] hover:text-[#33ff88] font-black text-lg sm:text-xl tracking-[0.2em] transition-all duration-200 cursor-pointer flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(0,255,102,0.3)] hover:shadow-[0_0_30px_rgba(0,255,102,0.6)] pulse-glow-green"
              style={{
                fontFamily: "'Orbitron', 'JetBrains Mono', sans-serif",
              }}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin text-[#00ff66]" />
                  <span>ОБРАБОТКА...</span>
                </>
              ) : (
                <>
                  <Cpu className="w-5 h-5 text-[#00ff66]" />
                  <span>СГЕНЕРИРОВАТЬ</span>
                </>
              )}
            </button>
          </div>

          {/* ===================================================================== */}
          {/* TELEMETRY & SYSTEM STATUS HUD                                         */}
          {/* ===================================================================== */}
          <div className="p-3.5 border-l-2 border-[#00ff66] space-y-2.5 bg-zinc-950/80">
            {/* Status log ticker */}
            <div className="flex items-center justify-between text-[9px] font-mono border-b border-zinc-800/60 pb-1.5">
              <span className="text-zinc-500 uppercase tracking-wider">Protocol Status</span>
              <span className="text-[#00ff66] font-bold truncate max-w-[240px]">{statusLog}</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
              <div className="flex items-center justify-between">
                <span className="text-zinc-500 uppercase tracking-tighter">Stream Quality</span>
                <span className="text-emerald-400 font-bold">UHD_4K</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-500 uppercase tracking-tighter">Encryption</span>
                <span className="text-zinc-400">AES-256</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-500 uppercase tracking-tighter">Buffer Index</span>
                <span className="text-cyan-400 font-bold">NODE #{tokenIndex}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-500 uppercase tracking-tighter">Discovered Pool</span>
                <span className="text-[#00ff66] font-bold">{discoveredTokensCount} TOKENS</span>
              </div>
            </div>

            {/* Glowing progress bar */}
            <div className="w-full h-1.5 bg-zinc-900 mt-2 relative overflow-hidden rounded-none">
              <div
                className={`absolute top-0 left-0 h-full bg-[#00ff66] shadow-[0_0_10px_#00ff66] transition-all duration-500 ${
                  isLoading ? 'w-full animate-pulse' : 'w-4/5'
                }`}
              />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
