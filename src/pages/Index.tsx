import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { channelGroups, getAllChannels } from "@/data/channels";
import ChannelRow from "@/components/ChannelRow";
import ChannelCard from "@/components/ChannelCard";
import SkeletonLoader from "@/components/SkeletonLoader";

const Index = () => {
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(t);
  }, []);

  const filteredChannels = search.trim()
    ? getAllChannels().filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.country.toLowerCase().includes(search.toLowerCase())
      )
    : null;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <header className="flex-shrink-0 px-4 pt-4 pb-3">
        <h1 className="font-display font-bold text-2xl text-foreground">
          Prisma<span className="text-primary">Fly</span>
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">TV ao vivo do mundo inteiro</p>

        {/* Search */}
        <div className="mt-3 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar canais ou países..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-card border border-border rounded-xl text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto scrollbar-hide pb-20">
        {loading ? (
          <SkeletonLoader />
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

export default Index;
