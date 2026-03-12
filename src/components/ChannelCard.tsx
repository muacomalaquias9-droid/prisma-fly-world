import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Channel } from "@/data/channels";

interface ChannelCardProps {
  channel: Channel;
  index: number;
}

const ChannelCard = ({ channel, index }: ChannelCardProps) => {
  const navigate = useNavigate();

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => navigate(`/player/${channel.id}`)}
      className="flex-shrink-0 w-36 group"
    >
      <div className="relative bg-card rounded-xl overflow-hidden shadow-sm border border-border aspect-video flex items-center justify-center">
        <img
          src={channel.logo}
          alt={channel.name}
          className="w-16 h-16 object-contain"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
        <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <Play size={28} className="text-primary drop-shadow-lg" fill="currentColor" />
          </div>
        </div>
        <div className="absolute top-1.5 right-1.5">
          <span className="live-indicator inline-block w-2 h-2 rounded-full bg-red-500" />
        </div>
      </div>
      <p className="mt-2 text-xs font-medium text-foreground truncate text-left">
        {channel.name}
      </p>
      <p className="text-[10px] text-muted-foreground truncate text-left">
        {channel.category}
      </p>
    </motion.button>
  );
};

export default ChannelCard;
