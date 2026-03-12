import type { ChannelGroup } from "@/data/channels";
import ChannelCard from "./ChannelCard";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ChannelRowProps {
  group: ChannelGroup;
}

const ChannelRow = ({ group }: ChannelRowProps) => {
  const navigate = useNavigate();

  return (
    <section className="mb-6">
      <button
        onClick={() => navigate(`/regions?country=${group.country}`)}
        className="flex items-center gap-2 px-4 mb-3 group"
      >
        <img
          src={group.flag}
          alt={group.country}
          className="w-6 h-4 object-cover rounded-sm shadow-sm"
        />
        <h2 className="font-display font-semibold text-base text-foreground">
          {group.country}
        </h2>
        <ChevronRight size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
      </button>
      <div className="flex gap-3 overflow-x-auto scrollbar-hide px-4 pb-2">
        {group.channels.map((channel, i) => (
          <ChannelCard key={channel.id} channel={channel} index={i} />
        ))}
      </div>
    </section>
  );
};

export default ChannelRow;
