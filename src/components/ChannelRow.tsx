import { memo } from "react";
import type { ChannelGroup } from "@/data/channels";
import ChannelCard from "./ChannelCard";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ChannelRow = memo(({ group }: { group: ChannelGroup }) => {
  const navigate = useNavigate();
  return (
    <section className="mb-6">
      <button
        onClick={() => navigate(`/regions?country=${group.country}`)}
        className="flex items-center gap-2 px-4 mb-2 w-full"
      >
        <img
          src={group.flag}
          alt={group.country}
          className="w-5 h-3.5 object-cover rounded-[2px] pointer-events-none select-none"
          draggable={false}
        />
        <h2 className="font-display text-white text-[15px] font-bold">{group.country}</h2>
        <ChevronRight size={16} className="text-white/60" />
        <span className="flex-1" />
        <span className="text-[10px] text-white/40">{group.channels.length}</span>
      </button>
      <div className="flex gap-2 overflow-x-auto overscroll-x-contain px-4 pb-1 scrollbar-hide">
        {group.channels.map((c, i) => <ChannelCard key={c.id} channel={c} index={i} />)}
      </div>
    </section>
  );
});

ChannelRow.displayName = "ChannelRow";
export default ChannelRow;
