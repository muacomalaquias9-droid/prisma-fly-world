import { memo, useState, useEffect } from "react";
import { Eye, Tv } from "lucide-react";
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
    }, 12000 + index * 300);
    return () => clearInterval(iv);
  }, [index]);

  return (
    <button
      onClick={() => navigate(`/player/${channel.id}`)}
      className="flex-shrink-0 w-[100px] group active:translate-y-[1px] transition-transform"
    >
      <div className="relative vintage-card crt-lines overflow-hidden aspect-square flex items-center justify-center select-none">
        {!imgError ? (
          <img
            src={channel.logo}
            alt={channel.name}
            className="w-11 h-11 object-contain pointer-events-none select-none"
            loading="lazy"
            draggable={false}
            onContextMenu={(e) => e.preventDefault()}
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-11 h-11 bg-primary/15 border border-primary/40 flex items-center justify-center">
            <Tv size={18} className="text-primary" />
          </div>
        )}
        <div className="absolute top-1 left-1">
          <span className="ink-stamp text-[6px] text-primary font-bold">CH</span>
        </div>
        <div className="absolute top-1.5 right-1.5">
          <span className="live-indicator inline-block w-1.5 h-1.5 rounded-full bg-primary" />
        </div>
        <div className="absolute bottom-1 right-1">
          <div className="flex items-center gap-0.5 bg-foreground/80 px-1 py-0.5">
            <Eye size={6} className="text-background" />
            <span className="text-background text-[6px] font-bold font-typewriter">{viewers}</span>
          </div>
        </div>
      </div>
      <p className="mt-1 text-[10px] font-display text-foreground truncate text-left leading-tight">
        {channel.name}
      </p>
      <p className="text-[7px] text-muted-foreground truncate text-left ink-stamp">{channel.category}</p>
    </button>
  );
});

ChannelCard.displayName = "ChannelCard";

export default ChannelCard;
