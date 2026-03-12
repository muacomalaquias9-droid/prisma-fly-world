import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { ArrowLeft, Volume2, VolumeX, Maximize, Minimize, Loader2 } from "lucide-react";
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
  const [showControls, setShowControls] = useState(true);
  const hideTimeout = useRef<ReturnType<typeof setTimeout>>();

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
        maxBufferLength: 30,
        maxMaxBufferLength: 60,
      });
      hls.loadSource(channel.url);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(() => {});
        setLoading(false);
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
      if (hls) {
        hls.destroy();
      }
    };
  }, [channel.url]);

  const toggleFullscreen = async () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      await containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleInteraction = () => {
    setShowControls(true);
    clearTimeout(hideTimeout.current);
    hideTimeout.current = setTimeout(() => setShowControls(false), 3000);
  };

  useEffect(() => {
    hideTimeout.current = setTimeout(() => setShowControls(false), 3000);
    return () => clearTimeout(hideTimeout.current);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full bg-player-bg flex items-center justify-center"
      onClick={handleInteraction}
      onMouseMove={handleInteraction}
    >
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        muted={muted}
        playsInline
        autoPlay
      />

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-player-bg">
          <div className="flex flex-col items-center gap-3">
            <Loader2 size={40} className="text-primary animate-spin" />
            <p className="text-primary-foreground text-sm font-body">
              Carregando {channel.name}...
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-player-bg">
          <div className="flex flex-col items-center gap-3 text-center px-8">
            <div className="w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center">
              <span className="text-2xl">📡</span>
            </div>
            <p className="text-primary-foreground text-sm font-body">
              Sinal indisponível
            </p>
            <p className="text-primary-foreground/60 text-xs">
              O canal {channel.name} está temporariamente fora do ar
            </p>
            <button
              onClick={() => navigate(-1)}
              className="mt-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium"
            >
              Voltar
            </button>
          </div>
        </div>
      )}

      {/* Controls overlay */}
      <div
        className={`absolute inset-0 transition-opacity duration-300 ${
          showControls ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/70 to-transparent p-4 flex items-center gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(-1);
            }}
            className="text-primary-foreground"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h3 className="text-primary-foreground font-display font-semibold text-sm">
              {channel.name}
            </h3>
            <p className="text-primary-foreground/60 text-xs font-body">
              {channel.country} • {channel.category}
            </p>
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <span className="live-indicator w-2 h-2 rounded-full bg-red-500 inline-block" />
            <span className="text-red-400 text-xs font-semibold uppercase tracking-wider">
              AO VIVO
            </span>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 flex items-center justify-end gap-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setMuted(!muted);
            }}
            className="text-primary-foreground"
          >
            {muted ? <VolumeX size={22} /> : <Volume2 size={22} />}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFullscreen();
            }}
            className="text-primary-foreground"
          >
            {isFullscreen ? <Minimize size={22} /> : <Maximize size={22} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
