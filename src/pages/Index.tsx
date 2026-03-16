import { useState, useEffect, useMemo } from "react";
import { Search, Wifi, TrendingUp, Eye, Star, Download } from "lucide-react";
import { channelGroups, getAllChannels, getPopularChannels, getViewerCount } from "@/data/channels";
import { useM3UServers } from "@/hooks/useM3UParser";
import ChannelRow from "@/components/ChannelRow";
import ChannelCard from "@/components/ChannelCard";
import PopularCard from "@/components/PopularCard";
import { useNavigate } from "react-router-dom";
import type { Channel } from "@/data/channels";

const Index = () => {
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [globalViewers, setGlobalViewers] = useState(0);
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const { serverChannels, loading: serversLoading } = useM3UServers();

  useEffect(() => {
    const handler = (e: any) => { e.preventDefault(); setInstallPrompt(e); };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    setInstallPrompt(null);
  };

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    setGlobalViewers(Math.floor(1200 + Math.random() * 500));
    const iv = setInterval(() => {
      setGlobalViewers((v) => v + Math.floor(Math.random() * 10 - 4));
    }, 5000);
    return () => clearInterval(iv);
  }, []);

  const allChannels = useMemo(() => [...serverChannels, ...getAllChannels()], [serverChannels]);

  const filteredChannels = useMemo(() => {
    if (!search.trim()) return null;
    const q = search.toLowerCase();
    return allChannels.filter(
      (c) => c.name.toLowerCase().includes(q) || c.country.toLowerCase().includes(q) || c.category.toLowerCase().includes(q)
    );
  }, [search, allChannels]);

  const popularChannels = useMemo(() => getPopularChannels(), []);

  return (
    <div className="h-full flex flex-col bg-background">
      <header className="flex-shrink-0 px-4 pt-3 pb-2 bg-gradient-to-b from-primary/5 to-transparent safe-area-top">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display font-extrabold text-xl text-foreground tracking-tight">
              Prisma<span className="text-primary">Fly</span>
            </h1>
            <p className="text-[9px] text-muted-foreground mt-0.5">TV ao vivo • Mundo inteiro</p>
          </div>
          <div className="flex items-center gap-1.5">
            {installPrompt && (
              <button
                onClick={handleInstall}
                className="flex items-center gap-1 bg-primary text-primary-foreground px-2.5 py-1 rounded-full text-[10px] font-bold active:scale-90 transition-transform"
              >
                <Download size={10} />
                Instalar
              </button>
            )}
            <div className="flex items-center gap-1 bg-primary/10 px-2 py-1 rounded-full">
              <Eye size={9} className="text-primary" />
              <span className="text-primary text-[9px] font-bold">{globalViewers}</span>
            </div>
            <div className="flex items-center gap-1 bg-green-500/10 px-2 py-1 rounded-full">
              <Wifi size={9} className="text-green-500" />
              <span className="text-green-600 text-[8px] font-semibold">Online</span>
            </div>
          </div>
        </div>

        <div className="mt-2 relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar canais, países..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-card border border-border rounded-xl text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </header>

      <main className="flex-1 overflow-y-auto overscroll-contain pb-20 scrollbar-hide">
        {loading ? (
          <LoadingPulse />
        ) : filteredChannels ? (
          <div className="px-4 pt-2">
            <p className="text-xs text-muted-foreground mb-3">{filteredChannels.length} canais encontrados</p>
            <div className="grid grid-cols-3 gap-2">
              {filteredChannels.map((ch, i) => (
                <ChannelCard key={ch.id} channel={ch} index={i} />
              ))}
            </div>
          </div>
        ) : (
          <div className="pt-2">
            {/* Server Channels */}
            {serverChannels.length > 0 && (
              <section className="mb-4">
                <div className="flex items-center gap-2 px-4 mb-2">
                  <div className="w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center">
                    <Wifi size={10} className="text-green-500" />
                  </div>
                  <h2 className="font-display font-bold text-xs text-foreground">Servidores M3U</h2>
                  <span className="text-[8px] text-green-500 font-semibold bg-green-500/10 px-1.5 py-0.5 rounded-full">NOVO</span>
                </div>
                <div className="flex gap-2 overflow-x-auto px-4 pb-2 scrollbar-hide">
                  {serverChannels.map((ch, i) => (
                    <ChannelCard key={ch.id} channel={ch} index={i} />
                  ))}
                </div>
              </section>
            )}

            {/* Popular */}
            <section className="mb-4">
              <div className="flex items-center gap-2 px-4 mb-2">
                <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                  <TrendingUp size={10} className="text-primary" />
                </div>
                <h2 className="font-display font-bold text-xs text-foreground">Em Alta</h2>
                <Star size={10} className="text-amber-500" />
              </div>
              <div className="flex gap-2.5 overflow-x-auto px-4 pb-2 scrollbar-hide">
                {popularChannels.map((ch) => (
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

const LoadingPulse = () => (
  <div className="flex flex-col items-center justify-center py-20 gap-3">
    <div className="relative">
      <div className="w-10 h-10 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
      <Wifi size={14} className="text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
    </div>
    <p className="text-xs text-muted-foreground font-body">Carregando canais...</p>
  </div>
);

export default Index;
