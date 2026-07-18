import { memo, useState, useEffect } from "react";
import { Eye, Tv, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Channel } from "@/data/channels";
import { getViewerCount } from "@/data/channels";
import { useAuth, isChannelFree } from "@/hooks/useAuth";

interface ChannelCardProps {
  channel: Channel;
  index: number;
}

const ChannelCard = memo(({ channel, index }: ChannelCardProps) => {
  const navigate = useNavigate();
  const { activePlan, isAdmin } = useAuth();
  const [viewers, setViewers] = useState(() => getViewerCount(channel.id));
  const [imgError, setImgError] = useState(false);

  const locked = !isAdmin && !activePlan && !isChannelFree(channel.id);

  useEffect(() => {
    const iv = setInterval(() => {
      setViewers((v) => Math.max(5, v + Math.floor(Math.random() * 6 - 2)));
    }, 12000 + index * 300);
    return () => clearInterval(iv);
  }, [index]);

  return (
    <button
      onClick={() => navigate(`/player/${channel.id}`)}
      className="flex-shrink-0 w-[104px] group active:scale-95 transition-transform"
    >
      <div className="relative vintage-card overflow-hidden aspect-square flex items-center justify-center select-none bg-secondary">
        {!imgError ? (
          <img
            src={channel.logo}
            alt={channel.name}
            className={`w-14 h-14 object-contain pointer-events-none select-none ${locked ? "opacity-30 grayscale" : ""}`}
            loading="lazy"
            draggable={false}
            onContextMenu={(e) => e.preventDefault()}
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
            <Tv size={20} className="text-primary" />
          </div>
        )}

        {locked && (
          <div className="absolute inset-0 bg-foreground/40 backdrop-blur-[1px] flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-background/95 flex items-center justify-center shadow">
              <Lock size={14} className="text-foreground" />
            </div>
          </div>
        )}

        {!locked && isChannelFree(channel.id) && (
          <div className="absolute top-1.5 left-1.5">
            <span className="text-[8px] text-green-700 font-bold bg-green-500/15 px-1.5 py-0.5 rounded-full">FREE</span>
          </div>
        )}

        <div className="absolute top-1.5 right-1.5">
          <span className="live-indicator inline-block w-2 h-2 rounded-full bg-red-500 ring-2 ring-background" />
        </div>
        <div className="absolute bottom-1.5 right-1.5">
          <div className="flex items-center gap-0.5 bg-foreground/80 rounded-full px-1.5 py-0.5">
            <Eye size={7} className="text-background" />
            <span className="text-background text-[8px] font-semibold">{viewers}</span>
          </div>
        </div>
      </div>
      <p className="mt-1.5 text-[12px] font-semibold text-foreground truncate text-left leading-tight">
        {channel.name}
      </p>
      <p className="text-[10px] text-muted-foreground truncate text-left">{channel.category}</p>
    </button>
  );
});

ChannelCard.displayName = "ChannelCard";

export default ChannelCard;
