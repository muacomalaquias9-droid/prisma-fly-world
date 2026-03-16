import { useState, useEffect } from "react";
import { Eye, Tv } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Channel } from "@/data/channels";
import { getViewerCount } from "@/data/channels";

const PopularCard = ({ channel }: { channel: Channel }) => {
  const navigate = useNavigate();
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
      className="flex-shrink-0 w-32 group active:scale-95 transition-transform"
    >
      <div className="relative bg-gradient-to-br from-primary/10 via-card to-accent/5 rounded-2xl overflow-hidden shadow-md border border-primary/10 aspect-[4/3] flex items-center justify-center select-none">
        {!imgError ? (
          <img
            src={channel.logo}
            alt={channel.name}
            className="w-12 h-12 object-contain pointer-events-none select-none drop-shadow-lg"
            loading="lazy"
            draggable={false}
            onContextMenu={(e) => e.preventDefault()}
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
            <Tv size={20} className="text-primary" />
          </div>
        )}
        <div className="absolute top-1.5 left-1.5">
          <div className="flex items-center gap-0.5 bg-red-600/90 px-1.5 py-0.5 rounded-full">
            <span className="live-indicator w-1 h-1 rounded-full bg-white inline-block" />
            <span className="text-white text-[7px] font-bold uppercase tracking-wider">LIVE</span>
          </div>
        </div>
        <div className="absolute top-1.5 right-1.5">
          <div className="flex items-center gap-0.5 bg-foreground/60 px-1 py-0.5 rounded-full">
            <Eye size={7} className="text-white" />
            <span className="text-white text-[7px] font-bold">{viewers}</span>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-foreground/80 to-transparent" />
        <div className="absolute bottom-1.5 left-1.5 right-1.5">
          <p className="text-white text-[9px] font-display font-semibold truncate drop-shadow">{channel.name}</p>
          <p className="text-white/60 text-[7px] truncate">{channel.category}</p>
        </div>
      </div>
    </button>
  );
};

export default PopularCard;
