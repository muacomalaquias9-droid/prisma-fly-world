import { memo } from "react";
import type { ChannelGroup } from "@/data/channels";
import ChannelCard from "./ChannelCard";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ChannelRowProps {
  group: ChannelGroup;
}

const ChannelRow = memo(({ group }: ChannelRowProps) => {
  const navigate = useNavigate();

  return (
    <section className="mb-5">
      <button
        onClick={() => navigate(`/regions?country=${group.country}`)}
        className="flex items-center gap-2 px-4 mb-2 group"
      >
        <img
          src={group.flag}
          alt={group.country}
          className="w-6 h-4 object-cover rounded-sm shadow-sm pointer-events-none select-none"
          draggable={false}
        />
        <h2 className="font-display font-semibold text-sm text-foreground">
          {group.country}
        </h2>
        <span className="text-[10px] text-muted-foreground ml-1">{group.channels.length} canais</span>
        <ChevronRight size={14} className="text-muted-foreground group-hover:text-primary transition-colors ml-auto" />
      </button>
      <div className="flex gap-2.5 overflow-x-auto overscroll-x-contain px-4 pb-2 scrollbar-hide">
        {group.channels.map((channel, i) => (
          <ChannelCard key={channel.id} channel={channel} index={i} />
        ))}
      </div>
    </section>
  );
});

ChannelRow.displayName = "ChannelRow";

export default ChannelRow;
