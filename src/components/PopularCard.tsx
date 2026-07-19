import { useState } from "react";
import { Play, Lock, Tv } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Channel } from "@/data/channels";
import { useAuth, isChannelFree } from "@/hooks/useAuth";

const PopularCard = ({ channel, rank }: { channel: Channel; rank?: number }) => {
  const navigate = useNavigate();
  const { activePlan, isAdmin } = useAuth();
  const locked = !isAdmin && !activePlan && !isChannelFree(channel.id);
  const [imgError, setImgError] = useState(false);

  return (
    <button
      onClick={() => navigate(`/player/${channel.id}`)}
      className="flex-shrink-0 flex items-end gap-1 active:scale-95 transition-transform"
    >
      {typeof rank === "number" && (
        <span
          className="font-brand text-[92px] leading-none text-transparent select-none"
          style={{ WebkitTextStroke: "2px hsl(0 0% 30%)" }}
        >
          {rank}
        </span>
      )}
      <div className="relative w-[110px] aspect-[2/3] rounded-md overflow-hidden bg-gradient-to-br from-neutral-800 to-neutral-950 border border-white/5 shadow-xl flex items-center justify-center">
        {!imgError ? (
          <img
            src={channel.logo}
            alt={channel.name}
            className={`w-16 h-16 object-contain pointer-events-none select-none ${locked ? "opacity-30 grayscale" : ""}`}
            loading="lazy"
            draggable={false}
            onError={() => setImgError(true)}
          />
        ) : (
          <Tv size={30} className="text-white/60" />
        )}
        {locked ? (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <Lock size={18} className="text-white" />
          </div>
        ) : (
          <div className="absolute bottom-1.5 right-1.5 w-7 h-7 rounded-full bg-white/95 flex items-center justify-center">
            <Play size={12} className="text-black fill-black ml-0.5" />
          </div>
        )}
      </div>
    </button>
  );
};

export default PopularCard;
