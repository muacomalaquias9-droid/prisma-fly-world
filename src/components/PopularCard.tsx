import { useState, useEffect } from "react";
import { Eye, Tv, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Channel } from "@/data/channels";
import { getViewerCount } from "@/data/channels";
import { useAuth, isChannelFree } from "@/hooks/useAuth";

const PopularCard = ({ channel }: { channel: Channel }) => {
  const navigate = useNavigate();
  const { activePlan, isAdmin } = useAuth();
  const locked = !isAdmin && !activePlan && !isChannelFree(channel.id);
  const [viewers, setViewers] = useState(() => getViewerCount(channel.id));
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const iv = setInterval(() => {
      setViewers((v) => Math.max(10, v + Math.floor(Math.random() * 8 - 3)));
    }, 8000);
    return () => clearInterval(iv);
  }, []);

  return (
    <button
      onClick={() => navigate(`/player/${channel.id}`)}
      className="flex-shrink-0 w-40 group active:scale-95 transition-transform"
    >
      <div className="relative overflow-hidden rounded-2xl aspect-[4/3] flex items-center justify-center select-none bg-gradient-to-br from-secondary to-muted border border-border">
        {!imgError ? (
          <img
            src={channel.logo}
            alt={channel.name}
            className={`w-16 h-16 object-contain pointer-events-none select-none ${locked ? "opacity-30 grayscale" : ""}`}
            loading="lazy"
            draggable={false}
            onContextMenu={(e) => e.preventDefault()}
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Tv size={24} className="text-primary" />
          </div>
        )}
        {locked && (
          <div className="absolute inset-0 bg-foreground/40 backdrop-blur-[1px] flex items-center justify-center z-10">
            <div className="w-10 h-10 rounded-full bg-background/95 flex items-center justify-center shadow">
              <Lock size={16} className="text-foreground" />
            </div>
          </div>
        )}
        <div className="absolute top-2 left-2">
          <div className="flex items-center gap-1 bg-red-500 rounded-full px-2 py-0.5">
            <span className="live-indicator w-1.5 h-1.5 rounded-full bg-white inline-block" />
            <span className="text-white text-[9px] font-bold">LIVE</span>
          </div>
        </div>
        <div className="absolute top-2 right-2">
          <div className="flex items-center gap-1 bg-foreground/80 rounded-full px-2 py-0.5">
            <Eye size={9} className="text-background" />
            <span className="text-background text-[9px] font-semibold">{viewers}</span>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-foreground/85 to-transparent" />
        <div className="absolute bottom-2 left-2.5 right-2.5">
          <p className="text-background text-[12px] font-semibold truncate">{channel.name}</p>
          <p className="text-background/70 text-[10px] truncate">{channel.category}</p>
        </div>
      </div>
    </button>
  );
};


export default PopularCard;
