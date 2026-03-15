import { memo, useState, useEffect } from "react";
import { Play, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Channel } from "@/data/channels";
import { getViewerCount } from "@/data/channels";

interface ChannelCardProps {
  channel: Channel;
  index: number;
}

const ChannelCard = memo(({ channel, index }: ChannelCardProps) => {
  const navigate = useNavigate();
  const [viewers, setViewers] = useState(() => getViewerCount(channel.id));
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const iv = setInterval(() => {
      setViewers((v) => Math.max(5, v + Math.floor(Math.random() * 6 - 2)));
    }, 10000 + index * 500);
    return () => clearInterval(iv);
  }, [index]);

  return (
    <button
      onClick={() => navigate(`/player/${channel.id}`)}
      className="flex-shrink-0 w-[108px] group active:scale-90 transition-transform"
    >
      <div className="relative bg-card rounded-2xl overflow-hidden border border-border aspect-square flex items-center justify-center select-none shadow-sm">
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
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Play size={20} className="text-primary" fill="currentColor" />
          </div>
        )}
        {/* Live dot */}
        <div className="absolute top-1.5 right-1.5">
          <span className="live-indicator inline-block w-1.5 h-1.5 rounded-full bg-red-500" />
        </div>
        {/* Viewers */}
        <div className="absolute bottom-1 right-1">
          <div className="flex items-center gap-0.5 bg-foreground/50 px-1 py-0.5 rounded-full">
            <Eye size={6} className="text-white" />
            <span className="text-white text-[6px] font-bold">{viewers}</span>
          </div>
        </div>
      </div>
      <p className="mt-1 text-[10px] font-semibold text-foreground truncate text-left leading-tight">
        {channel.name}
      </p>
      <p className="text-[8px] text-muted-foreground truncate text-left">{channel.category}</p>
    </button>
  );
});

ChannelCard.displayName = "ChannelCard";

export default ChannelCard;
