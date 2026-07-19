import { useState, useEffect, useMemo } from "react";
import { Search, Bell, Play, Plus, Info, Download, LogOut, Tv } from "lucide-react";
import { channelGroups, getAllChannels, getPopularChannels } from "@/data/channels";
import { useM3UServers } from "@/hooks/useM3UParser";
import { useAuth } from "@/hooks/useAuth";
import ChannelRow from "@/components/ChannelRow";
import ChannelCard from "@/components/ChannelCard";
import PopularCard from "@/components/PopularCard";
import PlanBanner from "@/components/PlanBanner";
import { useNavigate } from "react-router-dom";

const CATEGORIES = ["Todos", "TV ao Vivo", "Filmes", "Séries", "Desportos", "Infantil"];

const Index = () => {
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [category, setCategory] = useState("Todos");
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const { serverChannels } = useM3UServers();
  const { signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e: any) => { e.preventDefault(); setInstallPrompt(e); };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 250);
    return () => clearTimeout(t);
  }, []);

  const allChannels = useMemo(() => [...serverChannels, ...getAllChannels()], [serverChannels]);

  const filtered = useMemo(() => {
    if (!search.trim()) return null;
    const q = search.toLowerCase();
    return allChannels.filter(
      (c) => c.name.toLowerCase().includes(q) || c.country.toLowerCase().includes(q) || c.category.toLowerCase().includes(q)
    );
  }, [search, allChannels]);

  const popular = useMemo(() => getPopularChannels().slice(0, 10), []);
  const featured = popular[0];

  const handleInstall = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    setInstallPrompt(null);
  };

  return (
    <div className="h-full flex flex-col bg-background">
      <main className="flex-1 overflow-y-auto overscroll-contain pb-20 scrollbar-hide relative">
        {/* Top nav overlay */}
        <div className="absolute top-0 left-0 right-0 z-30 safe-area-top">
          <div className="netflix-top-fade px-4 pt-3 pb-6">
            <div className="flex items-center justify-between">
              <h1 className="font-brand text-primary text-3xl leading-none tracking-wider">
                PRISMAFLY
              </h1>
              <div className="flex items-center gap-4">
                {installPrompt && (
                  <button onClick={handleInstall} aria-label="Instalar">
                    <Download size={20} className="text-white" />
                  </button>
                )}
                <button onClick={() => setShowSearch((s) => !s)} aria-label="Procurar">
                  <Search size={22} className="text-white" strokeWidth={2.2} />
                </button>
                <button aria-label="Notificações">
                  <Bell size={22} className="text-white" strokeWidth={2.2} />
                </button>
                <button onClick={signOut} aria-label="Sair">
                  <LogOut size={20} className="text-white/80" />
                </button>
              </div>
            </div>

            {/* Category chips */}
            <div className="flex gap-2 mt-3 overflow-x-auto scrollbar-hide -mx-4 px-4">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`flex-shrink-0 text-[12px] px-3 py-1 rounded-full border ${
                    category === c
                      ? "bg-white text-black border-white font-semibold"
                      : "bg-black/40 text-white border-white/40"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            {showSearch && (
              <div className="mt-3">
                <input
                  autoFocus
                  type="text"
                  placeholder="Procurar canais, países…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-md text-sm text-white placeholder:text-white/50 focus:outline-none focus:border-white"
                />
              </div>
            )}
          </div>
        </div>

        {loading ? (
          <div className="h-full flex items-center justify-center pt-40">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered ? (
          <div className="pt-32 px-4">
            <p className="text-xs text-white/60 mb-3">{filtered.length} resultados</p>
            <div className="grid grid-cols-3 gap-2">
              {filtered.map((ch, i) => <ChannelCard key={ch.id} channel={ch} index={i} />)}
            </div>
          </div>
        ) : (
          <>
            {/* HERO */}
            {featured && (
              <section className="relative h-[70vh] max-h-[560px] min-h-[420px] w-full">
                <div className="absolute inset-0 bg-gradient-to-br from-red-950 via-black to-neutral-900" />
                <div className="absolute inset-0 flex items-center justify-center">
                  {featured.logo ? (
                    <img
                      src={featured.logo}
                      alt={featured.name}
                      className="w-40 h-40 object-contain opacity-90"
                      draggable={false}
                    />
                  ) : (
                    <Tv size={80} className="text-white/60" />
                  )}
                </div>
                <div className="absolute inset-0 netflix-hero-gradient" />

                <div className="absolute bottom-6 left-0 right-0 px-4">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-[11px] font-bold text-white bg-primary px-1.5 py-0.5 rounded-sm">AO VIVO</span>
                    <span className="text-white/80 text-[11px] font-semibold uppercase tracking-wider">
                      #1 em Angola hoje
                    </span>
                  </div>
                  <h2 className="font-display text-white text-2xl text-center font-black mb-3 truncate">
                    {featured.name}
                  </h2>
                  <p className="text-white/70 text-[12px] text-center mb-4">
                    {featured.category} • {featured.country}
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => navigate(`/player/${featured.id}`)}
                      className="flex items-center justify-center gap-1.5 bg-white text-black font-bold px-5 py-2 rounded-md active:scale-95 transition"
                    >
                      <Play size={16} className="fill-black" />
                      <span className="text-sm">Assistir</span>
                    </button>
                    <button className="flex flex-col items-center px-3 py-1">
                      <Plus size={22} className="text-white" />
                      <span className="text-[10px] text-white/80 mt-0.5">Minha Lista</span>
                    </button>
                    <button
                      onClick={() => navigate(`/player/${featured.id}`)}
                      className="flex flex-col items-center px-3 py-1"
                    >
                      <Info size={22} className="text-white" />
                      <span className="text-[10px] text-white/80 mt-0.5">Info</span>
                    </button>
                  </div>
                </div>
              </section>
            )}

            <div className="pt-4">
              <PlanBanner />
            </div>

            {/* Top 10 */}
            <section className="mb-6 mt-4">
              <h2 className="font-display text-white text-[15px] font-bold px-4 mb-2">
                Top 10 em destaque hoje
              </h2>
              <div className="flex gap-1 overflow-x-auto px-4 pb-2 scrollbar-hide">
                {popular.map((ch, i) => (
                  <PopularCard key={ch.id} channel={ch} rank={i + 1} />
                ))}
              </div>
            </section>

            {/* Server Channels */}
            {serverChannels.length > 0 && (
              <section className="mb-6">
                <h2 className="font-display text-white text-[15px] font-bold px-4 mb-2">
                  Novidades dos servidores
                </h2>
                <div className="flex gap-2 overflow-x-auto px-4 pb-1 scrollbar-hide">
                  {serverChannels.map((ch, i) => <ChannelCard key={ch.id} channel={ch} index={i} />)}
                </div>
              </section>
            )}

            {channelGroups.map((group) => <ChannelRow key={group.country} group={group} />)}
          </>
        )}
      </main>
    </div>
  );
};

export default Index;
