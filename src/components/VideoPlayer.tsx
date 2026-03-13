import { useEffect, useRef, useState, useCallback } from "react";
import Hls from "hls.js";
import { ArrowLeft, Volume2, VolumeX, Maximize, Minimize, Loader2, RotateCw, Wifi } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Channel } from "@/data/channels";

interface VideoPlayerProps {
  channel: Channel;
}

const VideoPlayer = ({ channel }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [muted, setMuted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [ping, setPing] = useState(0);
  const hideTimeout = useRef<ReturnType<typeof setTimeout>>();
  const pingInterval = useRef<ReturnType<typeof setInterval>>();

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
        maxBufferLength: 10,
        maxMaxBufferLength: 30,
        maxBufferSize: 10 * 1024 * 1024,
        startLevel: -1,
        abrEwmaDefaultEstimate: 500000,
      });
      hls.loadSource(channel.url);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(() => {});
        setLoading(false);
      });
      hls.on(Hls.Events.FRAG_LOADED, (_, data) => {
        if (data.frag.stats.loading) {
          setPing(Math.round(data.frag.stats.loading.end - data.frag.stats.loading.start));
        }
      });
      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
            hls?.startLoad();
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
    };
  }, [channel.url]);

  const toggleFullscreen = async () => {
    if (!containerRef.current) return;
    try {
      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch {}
  };

  const handleRotate = useCallback(() => {
    setRotation((prev) => (prev + 90) % 360);
  }, []);

  const handleInteraction = () => {
    setShowControls(true);
    clearTimeout(hideTimeout.current);
    hideTimeout.current = setTimeout(() => setShowControls(false), 3500);
  };

  useEffect(() => {
    hideTimeout.current = setTimeout(() => setShowControls(false), 3500);
    return () => clearTimeout(hideTimeout.current);
  }, []);

  const rotationStyle = rotation !== 0 ? {
    transform: `rotate(${rotation}deg)`,
    width: rotation % 180 !== 0 ? '100vh' : '100%',
    height: rotation % 180 !== 0 ? '100vw' : '100%',
  } : {};

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full bg-player-bg flex items-center justify-center overflow-hidden"
      onClick={handleInteraction}
      onMouseMove={handleInteraction}
      onContextMenu={(e) => e.preventDefault()}
    >
      <video
        ref={videoRef}
        className="w-full h-full object-contain transition-transform duration-300"
        style={rotationStyle}
        muted={muted}
        playsInline
        autoPlay
        controlsList="nodownload"
        disablePictureInPicture
        onContextMenu={(e) => e.preventDefault()}
      />

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-player-bg z-10">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <Loader2 size={44} className="text-primary animate-spin" />
              <Wifi size={18} className="text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            <p className="text-white/90 text-sm font-body font-medium">
              Conectando ao sinal...
            </p>
            <p className="text-white/40 text-xs">{channel.name}</p>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-player-bg z-10">
          <div className="flex flex-col items-center gap-3 text-center px-8">
            <div className="w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center">
              <Wifi size={28} className="text-destructive" />
            </div>
            <p className="text-white text-sm font-body font-medium">
              Sinal indisponível
            </p>
            <p className="text-white/50 text-xs">
              O canal {channel.name} está temporariamente fora do ar
            </p>
            <button
              onClick={() => navigate(-1)}
              className="mt-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium"
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
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent p-4 flex items-center gap-3">
          <button
            onClick={(e) => { e.stopPropagation(); navigate(-1); }}
            className="text-white w-9 h-9 flex items-center justify-center rounded-full bg-white/10"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-display font-semibold text-sm truncate">
              {channel.name}
            </h3>
            <p className="text-white/50 text-xs font-body">
              {channel.country} · {channel.category}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {ping > 0 && (
              <span className="text-green-400 text-[10px] font-mono bg-black/40 px-2 py-0.5 rounded-full">
                {ping}ms
              </span>
            )}
            <div className="flex items-center gap-1.5 bg-red-600/90 px-2.5 py-1 rounded-full">
              <span className="live-indicator w-1.5 h-1.5 rounded-full bg-white inline-block" />
              <span className="text-white text-[10px] font-bold uppercase tracking-wider">LIVE</span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 flex items-center justify-end gap-3">
          <button
            onClick={(e) => { e.stopPropagation(); handleRotate(); }}
            className="text-white w-10 h-10 flex items-center justify-center rounded-full bg-white/10"
          >
            <RotateCw size={20} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setMuted(!muted); }}
            className="text-white w-10 h-10 flex items-center justify-center rounded-full bg-white/10"
          >
            {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); toggleFullscreen(); }}
            className="text-white w-10 h-10 flex items-center justify-center rounded-full bg-white/10"
          >
            {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
