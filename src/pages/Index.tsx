import { useState, useEffect, useMemo } from "react";
import { Search, Wifi } from "lucide-react";
import { channelGroups, getAllChannels } from "@/data/channels";
import ChannelRow from "@/components/ChannelRow";
import ChannelCard from "@/components/ChannelCard";

const Index = () => {
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  const filteredChannels = useMemo(() => {
    if (!search.trim()) return null;
    const q = search.toLowerCase();
    return getAllChannels().filter((c) =>
      c.name.toLowerCase().includes(q) ||
      c.country.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q)
    );
  }, [search]);

  return (
    <div className="h-full flex flex-col">
      {/* Header - DStv style */}
      <header className="flex-shrink-0 px-4 pt-4 pb-3 bg-background">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display font-bold text-2xl text-foreground">
              Prisma<span className="text-primary">Fly</span>
            </h1>
            <p className="text-[10px] text-muted-foreground mt-0.5">TV ao vivo do mundo inteiro</p>
          </div>
          <div className="flex items-center gap-1.5 bg-green-500/10 px-2.5 py-1 rounded-full">
            <Wifi size={12} className="text-green-500" />
            <span className="text-green-600 text-[10px] font-semibold">Online</span>
          </div>
        </div>

        {/* Search */}
        <div className="mt-3 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar canais, países ou categorias..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-card border border-border rounded-xl text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto overscroll-contain pb-20">
        {loading ? (
          <LoadingPulse />
        ) : filteredChannels ? (
          <div className="px-4">
            <p className="text-xs text-muted-foreground mb-3">
              {filteredChannels.length} canais encontrados
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {filteredChannels.map((ch, i) => (
                <ChannelCard key={ch.id} channel={ch} index={i} />
              ))}
            </div>
          </div>
        ) : (
          <div className="pt-2">
            {channelGroups.map((group) => (
              <ChannelRow key={group.country} group={group} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

const LoadingPulse = () => (
  <div className="flex flex-col items-center justify-center py-20 gap-4">
    <div className="relative">
      <div className="w-12 h-12 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
      <Wifi size={16} className="text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
    </div>
    <p className="text-sm text-muted-foreground font-body">Carregando canais...</p>
  </div>
);

export default Index;
