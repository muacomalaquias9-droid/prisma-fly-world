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
        className="flex items-center gap-2 px-4 mb-2 group w-full"
      >
        <img
          src={group.flag}
          alt={group.country}
          className="w-6 h-4 object-cover border border-foreground/40 pointer-events-none select-none"
          draggable={false}
        />
        <h2 className="font-display font-normal text-base text-foreground italic">
          {group.country}
        </h2>
        <span className="flex-1 border-t border-dotted border-foreground/40 mx-2" />
        <span className="text-[9px] text-foreground ink-stamp">{group.channels.length} canais</span>
        <ChevronRight size={14} className="text-foreground group-hover:text-primary transition-colors" />
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
