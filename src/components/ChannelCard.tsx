import { memo, useState } from "react";
import { Tv, Lock, Radio } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Channel } from "@/data/channels";
import { useAuth, isChannelFree } from "@/hooks/useAuth";

interface ChannelCardProps {
  channel: Channel;
  index: number;
}

const ChannelCard = memo(({ channel, index }: ChannelCardProps) => {
  const navigate = useNavigate();
  const { activePlan, isAdmin } = useAuth();
  const [imgError, setImgError] = useState(false);
  const locked = !isAdmin && !activePlan && !isChannelFree(channel.id);

  return (
    <button
      onClick={() => navigate(`/player/${channel.id}`)}
      className="flex-shrink-0 w-[115px] group active:scale-95 transition-transform"
    >
      <div className="relative overflow-hidden rounded-md aspect-[2/3] flex items-center justify-center select-none bg-gradient-to-br from-neutral-800 to-neutral-950 border border-white/5 shadow-lg">
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
          <Tv size={28} className="text-white/70" />
        )}

        {locked && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <div className="w-9 h-9 rounded-full bg-black/80 border border-white/20 flex items-center justify-center">
              <Lock size={14} className="text-white" />
            </div>
          </div>
        )}

        <div className="absolute top-1.5 left-1.5 flex items-center gap-1 bg-primary rounded-sm px-1.5 py-0.5">
          <Radio size={8} className="text-white live-indicator" />
          <span className="text-white text-[8px] font-bold tracking-wide">AO VIVO</span>
        </div>

        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black to-transparent" />
        <div className="absolute bottom-1 left-1.5 right-1.5">
          <p className="text-white text-[10px] font-bold truncate leading-tight">{channel.name}</p>
        </div>
      </div>
    </button>
  );
});

ChannelCard.displayName = "ChannelCard";

export default ChannelCard;
