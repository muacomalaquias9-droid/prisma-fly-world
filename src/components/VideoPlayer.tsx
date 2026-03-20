import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import {
  ArrowLeft, Volume2, VolumeX, Maximize, Minimize, Loader2,
  Wifi, Eye, Settings, RotateCw, Subtitles, Languages
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Channel } from "@/data/channels";
import { getViewerCount } from "@/data/channels";

interface VideoPlayerProps {
  channel: Channel;
}

const QUALITY_OPTIONS = [
  { label: "Auto", level: -1 },
  { label: "8K", level: 0 },
  { label: "4K", level: 1 },
  { label: "1080p", level: 2 },
  { label: "720p", level: 3 },
  { label: "480p", level: 4 },
  { label: "360p", level: 5 },
];

const LANGUAGES = [
  { code: "pt", label: "Português", flag: "https://flagcdn.com/w20/br.png" },
  { code: "en", label: "English", flag: "https://flagcdn.com/w20/us.png" },
  { code: "fr", label: "Français", flag: "https://flagcdn.com/w20/fr.png" },
  { code: "es", label: "Español", flag: "https://flagcdn.com/w20/es.png" },
  { code: "ar", label: "العربية", flag: "https://flagcdn.com/w20/sa.png" },
  { code: "zh", label: "中文", flag: "https://flagcdn.com/w20/cn.png" },
  { code: "de", label: "Deutsch", flag: "https://flagcdn.com/w20/de.png" },
  { code: "sw", label: "Kiswahili", flag: "https://flagcdn.com/w20/ke.png" },
];

const VideoPlayer = ({ channel }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const navigate = useNavigate();
  const [muted, setMuted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [ping, setPing] = useState(0);
  const [viewers, setViewers] = useState(0);
  const [showSubMenu, setShowSubMenu] = useState<"quality" | "language" | null>(null);
  const [selectedQuality, setSelectedQuality] = useState(-1);
  const [selectedLang, setSelectedLang] = useState("pt");
  const [availableLevels, setAvailableLevels] = useState<{ label: string; level: number }[]>([]);
  const hideTimeout = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    setViewers(getViewerCount(channel.id));
    const iv = setInterval(() => {
      setViewers((v) => Math.max(10, v + Math.floor(Math.random() * 5 - 2)));
    }, 8000);
    return () => clearInterval(iv);
  }, [channel.id]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    setLoading(true);
    setError(false);

    let hls: Hls | null = null;

    if (Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        maxBufferLength: 5,
        maxMaxBufferLength: 15,
        maxBufferSize: 5 * 1024 * 1024,
        startLevel: -1,
        abrEwmaDefaultEstimate: 1000000,
        fragLoadingTimeOut: 8000,
        manifestLoadingTimeOut: 6000,
        levelLoadingTimeOut: 6000,
        fragLoadingMaxRetry: 3,
        manifestLoadingMaxRetry: 2,
        levelLoadingMaxRetry: 2,
        startFragPrefetch: true,
        testBandwidth: true,
        progressive: true,
        backBufferLength: 0,
      });
      hlsRef.current = hls;
      hls.loadSource(channel.url);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, (_, data) => {
        video.play().catch(() => {});
        setLoading(false);
        const levels = data.levels.map((l, i) => ({
          label: l.height >= 4320 ? "8K" : l.height >= 2160 ? "4K" : `${l.height}p`,
          level: i,
        }));
        setAvailableLevels([{ label: "Auto", level: -1 }, ...levels]);
      });
      hls.on(Hls.Events.FRAG_LOADED, (_, data) => {
        if (data.frag.stats.loading) {
          setPing(Math.round(data.frag.stats.loading.end - data.frag.stats.loading.start));
        }
      });
      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
            setTimeout(() => hls?.startLoad(), 1000);
          } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
            hls?.recoverMediaError();
          } else {
            setError(true);
            setLoading(false);
          }
        }
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = channel.url;
      video.addEventListener("loadedmetadata", () => {
        video.play().catch(() => {});
        setLoading(false);
      });
      video.addEventListener("error", () => {
        setError(true);
        setLoading(false);
      });
    } else {
      setError(true);
      setLoading(false);
    }

    return () => {
      if (hls) hls.destroy();
      hlsRef.current = null;
    };
  }, [channel.url]);

  const toggleFullscreen = async () => {
    if (!containerRef.current) return;
    try {
      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen();
        setIsFullscreen(true);
        if (screen.orientation && "lock" in screen.orientation) {
          try { await (screen.orientation as any).lock("landscape"); } catch {}
        }
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
        if (screen.orientation && "unlock" in screen.orientation) {
          try { (screen.orientation as any).unlock(); } catch {}
        }
      }
    } catch {}
  };

  const rotateScreen = async () => {
    if (screen.orientation && "lock" in screen.orientation) {
      const current = screen.orientation.type;
      const next = current.includes("landscape") ? "portrait" : "landscape";
      try { await (screen.orientation as any).lock(next); } catch {}
    }
  };

  const handleQualityChange = (level: number) => {
    if (hlsRef.current) {
      hlsRef.current.currentLevel = level;
      setSelectedQuality(level);
    }
    setShowSubMenu(null);
  };

  const handleInteraction = () => {
    setShowControls(true);
    setShowSubMenu(null);
    clearTimeout(hideTimeout.current);
    hideTimeout.current = setTimeout(() => setShowControls(false), 3500);
  };

  useEffect(() => {
    hideTimeout.current = setTimeout(() => setShowControls(false), 3500);
    return () => clearTimeout(hideTimeout.current);
  }, []);

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full bg-black flex items-center justify-center overflow-hidden"
      onClick={handleInteraction}
      onMouseMove={handleInteraction}
      onContextMenu={(e) => e.preventDefault()}
    >
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        muted={muted}
        playsInline
        autoPlay
        controlsList="nodownload"
        disablePictureInPicture
        onContextMenu={(e) => e.preventDefault()}
      />

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <Loader2 size={44} className="text-primary animate-spin" />
              <Wifi size={18} className="text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            <p className="text-white/90 text-sm font-body font-medium">Conectando...</p>
            <p className="text-white/40 text-xs">{channel.name}</p>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
          <div className="flex flex-col items-center gap-3 text-center px-8">
            <div className="w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center">
              <Wifi size={28} className="text-destructive" />
            </div>
            <p className="text-white text-sm font-body font-medium">Sinal indisponível</p>
            <p className="text-white/50 text-xs">O canal {channel.name} está temporariamente fora do ar</p>
            <button
              onClick={() => navigate(-1)}
              className="mt-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium active:scale-95 transition-transform"
            >
              Voltar
            </button>
          </div>
        </div>
      )}

      {/* Controls overlay */}
      <div
        className={`absolute inset-0 transition-opacity duration-300 z-20 ${
          showControls ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent p-3 flex items-center gap-3">
          <button
            onClick={(e) => { e.stopPropagation(); navigate(-1); }}
            className="text-white w-9 h-9 flex items-center justify-center rounded-full bg-white/10 active:scale-90 transition-transform"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-display font-semibold text-sm truncate">{channel.name}</h3>
            <p className="text-white/50 text-[10px] font-body">{channel.country} · {channel.category}</p>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded-full">
              <Eye size={9} className="text-white" />
              <span className="text-white text-[9px] font-bold">{viewers}</span>
            </div>
            {ping > 0 && (
              <span className="text-green-400 text-[9px] font-mono bg-black/40 px-1.5 py-0.5 rounded-full">{ping}ms</span>
            )}
            <div className="flex items-center gap-1 bg-red-600/90 px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-white inline-block animate-pulse" />
              <span className="text-white text-[9px] font-bold uppercase">LIVE</span>
            </div>
          </div>
        </div>

        {/* Sub menus */}
        {showSubMenu === "quality" && (
          <div className="absolute bottom-20 right-4 bg-black/95 rounded-xl p-2 z-30 min-w-[120px]" onClick={(e) => e.stopPropagation()}>
            <p className="text-white/60 text-[10px] font-bold uppercase px-2 mb-1">Qualidade</p>
            {(availableLevels.length > 1 ? availableLevels : QUALITY_OPTIONS).map((q) => (
              <button
                key={q.level}
                onClick={() => handleQualityChange(q.level)}
                className={`block w-full text-left px-3 py-1.5 rounded-lg text-xs ${
                  selectedQuality === q.level ? "bg-primary text-white" : "text-white/80 hover:bg-white/10"
                } active:scale-95 transition-transform`}
              >
                {q.label}
              </button>
            ))}
          </div>
        )}

        {showSubMenu === "language" && (
          <div className="absolute bottom-20 right-4 bg-black/95 rounded-xl p-2 z-30 min-w-[140px]" onClick={(e) => e.stopPropagation()}>
            <p className="text-white/60 text-[10px] font-bold uppercase px-2 mb-1">Idioma / Legenda</p>
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => { setSelectedLang(lang.code); setShowSubMenu(null); }}
                className={`flex items-center gap-2 w-full text-left px-3 py-1.5 rounded-lg text-xs ${
                  selectedLang === lang.code ? "bg-primary text-white" : "text-white/80 hover:bg-white/10"
                } active:scale-95 transition-transform`}
              >
                <img src={lang.flag} alt="" className="w-4 h-3 rounded-sm object-cover" />
                {lang.label}
              </button>
            ))}
          </div>
        )}

        {/* Bottom bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 flex items-center justify-end gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); rotateScreen(); }}
            className="text-white w-10 h-10 flex items-center justify-center rounded-full bg-white/10 active:scale-90 transition-transform"
          >
            <RotateCw size={18} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setShowSubMenu(showSubMenu === "language" ? null : "language"); }}
            className="text-white w-10 h-10 flex items-center justify-center rounded-full bg-white/10 active:scale-90 transition-transform"
          >
            <Languages size={18} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setShowSubMenu(showSubMenu === "quality" ? null : "quality"); }}
            className="text-white w-10 h-10 flex items-center justify-center rounded-full bg-white/10 active:scale-90 transition-transform"
          >
            <Settings size={18} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setMuted(!muted); }}
            className="text-white w-10 h-10 flex items-center justify-center rounded-full bg-white/10 active:scale-90 transition-transform"
          >
            {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); toggleFullscreen(); }}
            className="text-white w-10 h-10 flex items-center justify-center rounded-full bg-white/10 active:scale-90 transition-transform"
          >
            {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
