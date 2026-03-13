import { useState, useMemo, memo } from "react";
import { Play, Clock, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { channelGroups, getAllChannels } from "@/data/channels";
import { generateEPG, getCurrentProgram, getNextProgram } from "@/data/epg";
import type { Channel } from "@/data/channels";

const GuidePage = () => {
  const navigate = useNavigate();
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const channels = selectedCountry
    ? channelGroups.find((g) => g.country === selectedCountry)?.channels ?? []
    : getAllChannels();

  return (
    <div className="h-full flex flex-col">
      <header className="flex-shrink-0 px-4 pt-4 pb-2">
        <h1 className="font-display font-bold text-xl text-foreground">Guia de Programação</h1>
        <p className="text-xs text-muted-foreground">Programação em tempo real</p>
      </header>

      <div className="flex-shrink-0 flex gap-2 overflow-x-auto overscroll-x-contain scrollbar-hide px-4 py-3">
        <button
          onClick={() => setSelectedCountry(null)}
          className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            !selectedCountry
              ? "bg-primary text-primary-foreground"
              : "bg-card text-foreground border border-border"
          }`}
        >
          Todos
        </button>
        {channelGroups.map((g) => (
          <button
            key={g.country}
            onClick={() => setSelectedCountry(g.country)}
            className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCountry === g.country
                ? "bg-primary text-primary-foreground"
                : "bg-card text-foreground border border-border"
            }`}
          >
            <img src={g.flag} alt={g.country} className="w-5 h-3.5 object-cover rounded-sm" />
            {g.country}
          </button>
        ))}
      </div>

      <main className="flex-1 overflow-y-auto overscroll-contain scrollbar-hide px-4 pb-20">
        <div className="space-y-2.5">
          {channels.map((channel, i) => (
            <EPGChannelCard key={channel.id} channel={channel} />
          ))}
        </div>
      </main>
    </div>
  );
};

const EPGChannelCard = memo(({ channel }: { channel: Channel }) => {
  const navigate = useNavigate();
  const programs = useMemo(() => generateEPG(channel.id, channel.category), [channel.id, channel.category]);
  const current = getCurrentProgram(programs);
  const next = getNextProgram(programs);

  const formatTime = (date: Date) =>
    date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

  const progress = useMemo(() => {
    if (!current) return 0;
    const now = Date.now();
    const start = current.startTime.getTime();
    const end = current.endTime.getTime();
    return Math.min(100, Math.max(0, ((now - start) / (end - start)) * 100));
  }, [current]);

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <button
        onClick={() => navigate(`/player/${channel.id}`)}
        className="w-full flex items-center gap-3 p-3 hover:bg-accent/50 transition-colors"
      >
        <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center flex-shrink-0 border border-border">
          <img
            src={channel.logo}
            alt={channel.name}
            className="w-7 h-7 object-contain"
            loading="lazy"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
        </div>
        <div className="flex-1 min-w-0 text-left">
          <h3 className="font-display font-semibold text-sm text-foreground truncate">{channel.name}</h3>
          <p className="text-[10px] text-muted-foreground">{channel.country} · {channel.category}</p>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <span className="live-indicator w-2 h-2 rounded-full bg-red-500 inline-block" />
          <span className="text-red-500 text-[10px] font-semibold uppercase">AO VIVO</span>
        </div>
        <Play size={18} className="text-primary flex-shrink-0" fill="currentColor" />
      </button>

      <div className="px-3 pb-3 space-y-2">
        {current && (
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Clock size={12} className="text-primary flex-shrink-0" />
              <span className="text-[10px] text-primary font-semibold">AGORA</span>
              <span className="text-[10px] text-muted-foreground">
                {formatTime(current.startTime)} - {formatTime(current.endTime)}
              </span>
            </div>
            <p className="text-xs font-medium text-foreground pl-5">{current.title}</p>
            <div className="ml-5 h-1 bg-border rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}
        {next && (
          <div className="flex items-center gap-2 pl-5 opacity-60">
            <ChevronRight size={12} className="text-muted-foreground flex-shrink-0" />
            <span className="text-[10px] text-muted-foreground">{formatTime(next.startTime)}</span>
            <span className="text-xs text-muted-foreground truncate">{next.title}</span>
          </div>
        )}
      </div>
    </div>
  );
});

EPGChannelCard.displayName = "EPGChannelCard";

export default GuidePage;
