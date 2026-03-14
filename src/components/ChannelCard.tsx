import { memo } from "react";
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
  const viewers = getViewerCount(channel.id);

  return (
    <button
      onClick={() => navigate(`/player/${channel.id}`)}
      className="flex-shrink-0 w-32 group active:scale-95 transition-transform"
    >
      <div className="relative bg-card rounded-xl overflow-hidden shadow-sm border border-border aspect-video flex items-center justify-center select-none">
        <img
          src={channel.logo}
          alt={channel.name}
          className="w-14 h-14 object-contain pointer-events-none select-none"
          loading="lazy"
          draggable={false}
          onContextMenu={(e) => e.preventDefault()}
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
        <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <Play size={24} className="text-primary drop-shadow-lg" fill="currentColor" />
          </div>
        </div>
        <div className="absolute top-1.5 right-1.5">
          <span className="live-indicator inline-block w-1.5 h-1.5 rounded-full bg-red-500" />
        </div>
        {/* Viewer count */}
        <div className="absolute bottom-1 right-1">
          <div className="flex items-center gap-0.5 bg-foreground/50 px-1 py-0.5 rounded-full">
            <Eye size={7} className="text-white" />
            <span className="text-white text-[7px] font-bold">{viewers}</span>
          </div>
        </div>
      </div>
      <p className="mt-1.5 text-[11px] font-medium text-foreground truncate text-left">
        {channel.name}
      </p>
      <p className="text-[9px] text-muted-foreground truncate text-left">
        {channel.category}
      </p>
    </button>
  );
});

ChannelCard.displayName = "ChannelCard";

export default ChannelCard;
