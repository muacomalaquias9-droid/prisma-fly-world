import { useState, useEffect, useMemo } from "react";
import { Search, Wifi, TrendingUp, Eye, Star } from "lucide-react";
import { channelGroups, getAllChannels, getPopularChannels, getViewerCount } from "@/data/channels";
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
    return getAllChannels().filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.country.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q)
    );
  }, [search]);

  const popularChannels = useMemo(() => getPopularChannels(), []);

  return (
    <div className="h-full flex flex-col">
      {/* Header - DStv Premium */}
      <header className="flex-shrink-0 px-4 pt-4 pb-3 bg-gradient-to-b from-primary/5 to-background">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display font-bold text-2xl text-foreground">
              Prisma<span className="text-primary">Fly</span>
            </h1>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              TV ao vivo do mundo inteiro
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-primary/10 px-2 py-1 rounded-full">
              <Eye size={10} className="text-primary" />
              <span className="text-primary text-[10px] font-bold">
                {Math.floor(1200 + Math.random() * 500)}
              </span>
            </div>
            <div className="flex items-center gap-1.5 bg-green-500/10 px-2.5 py-1 rounded-full">
              <Wifi size={12} className="text-green-500" />
              <span className="text-green-600 text-[10px] font-semibold">Online</span>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mt-3 relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
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
            {/* Popular / Trending Section */}
            <section className="mb-5">
              <div className="flex items-center gap-2 px-4 mb-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <TrendingUp size={12} className="text-primary" />
                </div>
                <h2 className="font-display font-bold text-sm text-foreground">
                  Em Alta
                </h2>
                <Star size={12} className="text-amber-500 ml-1" />
              </div>
              <div className="flex gap-3 overflow-x-auto overscroll-x-contain px-4 pb-3 scrollbar-hide">
                {popularChannels.map((ch, i) => (
                  <PopularCard key={ch.id} channel={ch} />
                ))}
              </div>
            </section>

            {/* Channel Groups */}
            {channelGroups.map((group) => (
              <ChannelRow key={group.country} group={group} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

/* Popular channel card - bigger, gradient, viewer count */
import { useNavigate } from "react-router-dom";
import type { Channel } from "@/data/channels";

const PopularCard = ({ channel }: { channel: Channel }) => {
  const navigate = useNavigate();
  const viewers = getViewerCount(channel.id);

  return (
    <button
      onClick={() => navigate(`/player/${channel.id}`)}
      className="flex-shrink-0 w-40 group active:scale-95 transition-transform"
    >
      <div className="relative bg-gradient-to-br from-primary/10 via-card to-accent/5 rounded-2xl overflow-hidden shadow-md border border-primary/10 aspect-[4/3] flex items-center justify-center select-none">
        <img
          src={channel.logo}
          alt={channel.name}
          className="w-16 h-16 object-contain pointer-events-none select-none drop-shadow-lg"
          loading="lazy"
          draggable={false}
          onContextMenu={(e) => e.preventDefault()}
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
        {/* Live badge */}
        <div className="absolute top-2 left-2">
          <div className="flex items-center gap-1 bg-red-600/90 px-2 py-0.5 rounded-full">
            <span className="live-indicator w-1.5 h-1.5 rounded-full bg-white inline-block" />
            <span className="text-white text-[8px] font-bold uppercase tracking-wider">
              LIVE
            </span>
          </div>
        </div>
        {/* Viewer count */}
        <div className="absolute top-2 right-2">
          <div className="flex items-center gap-1 bg-foreground/60 px-1.5 py-0.5 rounded-full">
            <Eye size={8} className="text-white" />
            <span className="text-white text-[8px] font-bold">{viewers}</span>
          </div>
        </div>
        {/* Gradient overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-foreground/80 to-transparent" />
        <div className="absolute bottom-2 left-2 right-2">
          <p className="text-white text-[11px] font-display font-semibold truncate drop-shadow">
            {channel.name}
          </p>
          <p className="text-white/60 text-[9px] truncate">{channel.category}</p>
        </div>
      </div>
    </button>
  );
};

const LoadingPulse = () => (
  <div className="flex flex-col items-center justify-center py-20 gap-4">
    <div className="relative">
      <div className="w-12 h-12 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
      <Wifi
        size={16}
        className="text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      />
    </div>
    <p className="text-sm text-muted-foreground font-body">Carregando canais...</p>
  </div>
);

export default Index;
