import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { channelGroups } from "@/data/channels";
import ChannelCard from "@/components/ChannelCard";

const Regions = () => {
  const [searchParams] = useSearchParams();
  const initialCountry = searchParams.get("country") || channelGroups[0]?.country || "";
  const [selected, setSelected] = useState(initialCountry);

  const activeGroup = channelGroups.find((g) => g.country === selected);

  return (
    <div className="h-full flex flex-col">
      <header className="flex-shrink-0 px-4 pt-4 pb-2">
        <h1 className="font-display font-bold text-xl text-foreground">Regiões</h1>
        <p className="text-xs text-muted-foreground">Escolha um país</p>
      </header>

      <div className="flex-shrink-0 flex gap-2 overflow-x-auto overscroll-x-contain scrollbar-hide px-4 py-3">
        {channelGroups.map((g) => (
          <button
            key={g.country}
            onClick={() => setSelected(g.country)}
            className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selected === g.country
                ? "bg-primary text-primary-foreground"
                : "bg-card text-foreground border border-border"
            }`}
          >
            <img
              src={g.flag}
              alt={g.country}
              className="w-5 h-3.5 object-cover rounded-sm"
            />
            {g.country}
          </button>
        ))}
      </div>

      <main className="flex-1 overflow-y-auto overscroll-contain scrollbar-hide px-4 pb-20">
        {activeGroup && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-2">
            {activeGroup.channels.map((ch, i) => (
              <ChannelCard key={ch.id} channel={ch} index={i} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Regions;
