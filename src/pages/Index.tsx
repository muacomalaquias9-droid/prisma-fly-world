import { useState, useEffect, useMemo } from "react";
import { Search, Wifi, TrendingUp, Eye, Star, Download, LogOut } from "lucide-react";
import { channelGroups, getAllChannels, getPopularChannels, getViewerCount } from "@/data/channels";
import { useM3UServers } from "@/hooks/useM3UParser";
import { useAuth } from "@/hooks/useAuth";
import ChannelRow from "@/components/ChannelRow";
import ChannelCard from "@/components/ChannelCard";
import PopularCard from "@/components/PopularCard";
import PlanBanner from "@/components/PlanBanner";
import { useNavigate } from "react-router-dom";
import type { Channel } from "@/data/channels";

const Index = () => {
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [globalViewers, setGlobalViewers] = useState(0);
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const { serverChannels, loading: serversLoading } = useM3UServers();
  const { signOut } = useAuth();
  const navigate = useNavigate();

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
      <header className="flex-shrink-0 px-4 pt-3 pb-3 border-b-2 border-double border-foreground/70 safe-area-top tv-flicker">
        <div className="flex items-center justify-between">
          <div>
            <p className="ink-stamp text-[8px] text-primary font-bold">★ Transmissão Mundial ★ Est. 1967</p>
            <h1 className="font-display font-normal text-3xl text-foreground leading-none tracking-tight">
              Prisma<span className="italic text-primary">Fly</span>
            </h1>
            <p className="text-[9px] text-muted-foreground mt-0.5 font-typewriter uppercase tracking-widest">
              — Televisão ao vivo · do mundo inteiro —
            </p>
          </div>
          <div className="flex flex-col items-end gap-1">
            {installPrompt && (
              <button
                onClick={handleInstall}
                className="flex items-center gap-1 bg-primary text-primary-foreground px-2.5 py-1 text-[10px] font-bold ink-stamp vintage-frame active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
              >
                <Download size={10} />
                Instalar
              </button>
            )}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-primary/10 border border-primary/40 px-2 py-0.5 rounded-sm">
                <Eye size={9} className="text-primary" />
                <span className="text-primary text-[9px] font-bold font-typewriter">{globalViewers}</span>
              </div>
              <div className="flex items-center gap-1 bg-accent/30 border border-accent/60 px-2 py-0.5 rounded-sm">
                <span className="live-indicator w-1.5 h-1.5 rounded-full bg-primary inline-block" />
                <span className="text-foreground text-[8px] font-bold ink-stamp">No Ar</span>
              </div>
              <button onClick={signOut} className="p-1 hover:bg-secondary rounded" aria-label="Sair">
                <LogOut size={12} className="text-foreground/70" />
              </button>
            </div>
          </div>
        </div>

        <PlanBanner />

        <div className="mt-3 relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground" />
          <input
            type="text"
            placeholder="Procurar canais, países…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-card border-2 border-foreground/70 text-sm font-typewriter text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
            style={{ boxShadow: "2px 2px 0 0 hsl(var(--foreground))" }}
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
