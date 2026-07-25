import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "@mdi/react";
import { mdiPlay, mdiPlusBoxOutline, mdiInformationOutline, mdiTelevisionPlay } from "@mdi/js";
import { channelGroups, getPopularChannels } from "@/data/channels";
import type { Channel } from "@/data/channels";
import { useM3UServers } from "@/hooks/useM3UParser";
import { useDpadNavigation } from "@/hooks/useTVMode";
import TVSidebar from "./TVSidebar";

const TVCard = ({ channel }: { channel: Channel }) => {
  const navigate = useNavigate();
  return (
    <button
      data-focusable
      onClick={() => navigate(`/player/${channel.id}`)}
      className="tv-card flex-shrink-0 w-[230px] text-left"
    >
      <div className="relative w-full aspect-video rounded-xl bg-neutral-900 overflow-hidden flex items-center justify-center">
        {channel.logo ? (
          <img
            src={channel.logo}
            alt={channel.name}
            className="w-[65%] h-[65%] object-contain"
            draggable={false}
            loading="lazy"
          />
        ) : (
          <Icon path={mdiTelevisionPlay} size={2} className="text-white/40" />
        )}
        <span className="absolute top-2 left-2 text-[11px] font-bold bg-primary text-white px-2 py-0.5 rounded">
          HD
        </span>
      </div>
      <p className="mt-2 text-white text-[15px] font-semibold truncate">{channel.name}</p>
      <p className="text-white/50 text-[12px] truncate">{channel.category}</p>
    </button>
  );
};

const TVRow = ({ title, channels }: { title: string; channels: Channel[] }) => (
  <section className="mb-10">
    <h2 className="text-white text-xl font-bold mb-3 px-1">{title}</h2>
    <div className="flex gap-5 overflow-x-auto scrollbar-hide pb-4 pr-10">
      {channels.map((ch) => (
        <TVCard key={`${title}-${ch.id}`} channel={ch} />
      ))}
    </div>
  </section>
);

const TVHome = () => {
  const navigate = useNavigate();
  const { serverChannels } = useM3UServers();
  useDpadNavigation(true);

  const popular = useMemo(() => getPopularChannels().slice(0, 12), []);
  const featured = popular[0];

  return (
    <div className="h-full w-full bg-black overflow-y-auto scrollbar-hide">
      <TVSidebar />

      <main className="pl-24 pr-10">
        {/* HERO Full HD */}
        {featured && (
          <section className="relative h-[58vh] min-h-[380px] flex items-center">
            <div className="absolute inset-0 -ml-24 bg-gradient-to-r from-black via-black/85 to-red-950/40" />
            <img
              src={featured.logo}
              alt=""
              aria-hidden
              className="absolute right-24 top-1/2 -translate-y-1/2 w-[320px] h-[320px] object-contain opacity-30 blur-[1px]"
              draggable={false}
            />
            <div className="relative max-w-[52%]">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs font-bold text-white bg-primary px-2 py-1 rounded">AO VIVO</span>
                <span className="text-white/70 text-sm font-semibold uppercase tracking-widest">
                  Android TV · Full HD 1080p
                </span>
              </div>
              <h1 className="text-white text-5xl font-black mb-3">{featured.name}</h1>
              <p className="text-white/70 text-lg mb-6">
                {featured.category} • {featured.country}
              </p>
              <div className="flex items-center gap-4">
                <button
                  data-focusable
                  autoFocus
                  onClick={() => navigate(`/player/${featured.id}`)}
                  className="tv-focusable flex items-center gap-2 bg-white text-black font-bold px-8 py-3 rounded-lg text-lg"
                >
                  <Icon path={mdiPlay} size={1.1} />
                  Assistir
                </button>
                <button
                  data-focusable
                  className="tv-focusable flex items-center gap-2 bg-white/15 text-white font-semibold px-6 py-3 rounded-lg text-lg"
                >
                  <Icon path={mdiPlusBoxOutline} size={1.1} />
                  Minha Lista
                </button>
                <button
                  data-focusable
                  onClick={() => navigate("/guide")}
                  className="tv-focusable flex items-center gap-2 bg-white/15 text-white font-semibold px-6 py-3 rounded-lg text-lg"
                >
                  <Icon path={mdiInformationOutline} size={1.1} />
                  Guia
                </button>
              </div>
            </div>
          </section>
        )}

        <TVRow title="Em destaque hoje" channels={popular} />
        {serverChannels.length > 0 && (
          <TVRow title="Servidores IPTV" channels={serverChannels} />
        )}
        {channelGroups.map((g) => (
          <TVRow key={g.country} title={g.country} channels={g.channels} />
        ))}
      </main>
    </div>
  );
};

export default TVHome;
