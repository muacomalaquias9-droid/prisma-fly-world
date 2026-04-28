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
      className="flex-shrink-0 w-32 group active:translate-y-[1px] transition-transform"
    >
      <div className="relative vintage-card crt-lines overflow-hidden aspect-[4/3] flex items-center justify-center select-none bg-secondary">
        {!imgError ? (
          <img
            src={channel.logo}
            alt={channel.name}
            className="w-12 h-12 object-contain pointer-events-none select-none"
            loading="lazy"
            draggable={false}
            onContextMenu={(e) => e.preventDefault()}
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-12 h-12 bg-primary/20 border border-primary/40 flex items-center justify-center">
            <Tv size={20} className="text-primary" />
          </div>
        )}
        <div className="absolute top-1.5 left-1.5">
          <div className="flex items-center gap-0.5 bg-primary px-1.5 py-0.5">
            <span className="live-indicator w-1 h-1 rounded-full bg-primary-foreground inline-block" />
            <span className="text-primary-foreground text-[7px] font-bold ink-stamp">No Ar</span>
          </div>
        </div>
        <div className="absolute top-1.5 right-1.5">
          <div className="flex items-center gap-0.5 bg-foreground/80 px-1 py-0.5">
            <Eye size={7} className="text-background" />
            <span className="text-background text-[7px] font-bold font-typewriter">{viewers}</span>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-foreground/85 to-transparent" />
        <div className="absolute bottom-1.5 left-1.5 right-1.5">
          <p className="text-background text-[10px] font-display truncate">{channel.name}</p>
          <p className="text-background/70 text-[7px] truncate ink-stamp">{channel.category}</p>
        </div>
      </div>
    </button>
  );
};

export default PopularCard;
