export interface Channel {
  id: string;
  name: string;
  logo: string;
  url: string;
  country: string;
  category: string;
}

export interface ChannelGroup {
  country: string;
  flag: string;
  channels: Channel[];
}

// Real free-to-air IPTV streams from iptv-org database
export const channelGroups: ChannelGroup[] = [
  {
    country: "Brasil",
    flag: "🇧🇷",
    channels: [
      { id: "br-1", name: "TV Cultura", logo: "https://i.imgur.com/0RSVFhB.png", url: "https://cdn-8.nimo.tv/live/tv-cultura/playlist.m3u8", country: "Brasil", category: "Generalista" },
      { id: "br-2", name: "TV Brasil", logo: "https://i.imgur.com/Ql5gR8x.png", url: "https://cdn.jmvstream.com/w/LVW-9912/LVW9912_wlBArfKSfM/playlist.m3u8", country: "Brasil", category: "Generalista" },
      { id: "br-3", name: "Band News", logo: "https://i.imgur.com/4WFhLQi.png", url: "https://evpp.mm.uol.com.br/geob_band/bandnewstv/playlist.m3u8", country: "Brasil", category: "Notícias" },
      { id: "br-4", name: "TV Câmara", logo: "https://i.imgur.com/2KJTbxL.png", url: "https://stream-node1.cameras.canal.leg.br/tv2/ngrp:tv2_all/playlist.m3u8", country: "Brasil", category: "Governo" },
      { id: "br-5", name: "TV Senado", logo: "https://i.imgur.com/GlLvJ3V.png", url: "https://stream-node1.cameras.canal.leg.br/tv1/ngrp:tv1_all/playlist.m3u8", country: "Brasil", category: "Governo" },
      { id: "br-6", name: "Canal Rural", logo: "https://i.imgur.com/u8jkU5B.png", url: "https://livestream.canalrural.com.br/hls/canalrural/index.m3u8", country: "Brasil", category: "Entretenimento" },
      { id: "br-7", name: "Rede Vida", logo: "https://i.imgur.com/kY9epYb.png", url: "https://cdn.jmvstream.com/w/LVW-5765/LVW5765_TdSfOTMdgE/playlist.m3u8", country: "Brasil", category: "Religioso" },
      { id: "br-8", name: "BandSports", logo: "https://i.imgur.com/q6M7Rsi.png", url: "https://evpp.mm.uol.com.br/geob_band/bandsports/playlist.m3u8", country: "Brasil", category: "Esportes" },
    ],
  },
  {
    country: "Angola",
    flag: "🇦🇴",
    channels: [
      { id: "ao-1", name: "TPA 1", logo: "https://i.imgur.com/sHJYjfZ.png", url: "https://tpastream1.tpa.co.ao/hls/tpa1_720p/index.m3u8", country: "Angola", category: "Generalista" },
      { id: "ao-2", name: "TPA 2", logo: "https://i.imgur.com/sHJYjfZ.png", url: "https://tpastream1.tpa.co.ao/hls/tpa2_720p/index.m3u8", country: "Angola", category: "Generalista" },
      { id: "ao-3", name: "TPA Internacional", logo: "https://i.imgur.com/sHJYjfZ.png", url: "https://tpastream1.tpa.co.ao/hls/tpai_720p/index.m3u8", country: "Angola", category: "Internacional" },
      { id: "ao-4", name: "TV Zimbo", logo: "https://i.imgur.com/UcEp2dP.png", url: "https://zimbo.sfrfrg.com/stream/hls/zimbo/playlist.m3u8", country: "Angola", category: "Generalista" },
    ],
  },
  {
    country: "Portugal",
    flag: "🇵🇹",
    channels: [
      { id: "pt-1", name: "RTP 1", logo: "https://i.imgur.com/JlZHWtI.png", url: "https://streaming-live.rtp.pt/livereplay/rtp1HD.smil/playlist.m3u8", country: "Portugal", category: "Generalista" },
      { id: "pt-2", name: "RTP 2", logo: "https://i.imgur.com/YZfYaIh.png", url: "https://streaming-live.rtp.pt/livereplay/rtp2HD.smil/playlist.m3u8", country: "Portugal", category: "Generalista" },
      { id: "pt-3", name: "RTP 3", logo: "https://i.imgur.com/r7VHTXP.png", url: "https://streaming-live.rtp.pt/livereplay/rtp3HD.smil/playlist.m3u8", country: "Portugal", category: "Notícias" },
      { id: "pt-4", name: "RTP Memória", logo: "https://i.imgur.com/1qwM5cC.png", url: "https://streaming-live.rtp.pt/livereplay/rtpmemoria.smil/playlist.m3u8", country: "Portugal", category: "Entretenimento" },
      { id: "pt-5", name: "RTP África", logo: "https://i.imgur.com/9gHyCVf.png", url: "https://streaming-live.rtp.pt/livereplay/rtpafricaHD.smil/playlist.m3u8", country: "Portugal", category: "Internacional" },
      { id: "pt-6", name: "SIC Notícias", logo: "https://i.imgur.com/bMDR5Yj.png", url: "https://d1zg6t562dhkem.cloudfront.net/out/v1/2b49a24afec74536bf09e1e2370b3b60/manifest.m3u8", country: "Portugal", category: "Notícias" },
    ],
  },
  {
    country: "USA",
    flag: "🇺🇸",
    channels: [
      { id: "us-1", name: "ABC News", logo: "https://i.imgur.com/XwmSmgQ.png", url: "https://content.uplynk.com/channel/3324f2467c414329b3b0cc5cd987b6be.m3u8", country: "USA", category: "News" },
      { id: "us-2", name: "NBC News NOW", logo: "https://i.imgur.com/WaC27Ig.png", url: "https://dai2.xumo.com/amagi_hls_data_xumo1212A-redboxnbcnewsnow/CDN/playlist.m3u8", country: "USA", category: "News" },
      { id: "us-3", name: "CBS News", logo: "https://i.imgur.com/484z7Si.png", url: "https://dai.google.com/linear/hls/event/TxSbNMu4R5WRncIhGkY84g/master.m3u8", country: "USA", category: "News" },
      { id: "us-4", name: "Bloomberg TV", logo: "https://i.imgur.com/TZbz3sT.png", url: "https://www.bloomberg.com/media-manifest/streams/us.m3u8", country: "USA", category: "Business" },
      { id: "us-5", name: "Comet TV", logo: "https://i.imgur.com/e2M7BfS.png", url: "https://lnc-comet.tubi.video/playlist.m3u8", country: "USA", category: "Entertainment" },
      { id: "us-6", name: "Pluto TV Movies", logo: "https://i.imgur.com/AEkBr26.png", url: "https://service-stitcher.clusters.pluto.tv/v1/stitch/embed/hls/channel/5ca673a2c4af2a7d1937c00d/master.m3u8", country: "USA", category: "Movies" },
    ],
  },
  {
    country: "França",
    flag: "🇫🇷",
    channels: [
      { id: "fr-1", name: "France 24", logo: "https://i.imgur.com/fbHzcQy.png", url: "https://stream.france24.com/live/hls/fren/index.m3u8", country: "França", category: "Notícias" },
      { id: "fr-2", name: "TV5 Monde", logo: "https://i.imgur.com/I7ihHDw.png", url: "https://ott.tv5monde.com/Content/HLS/Live/channel(info)/variant.m3u8", country: "França", category: "Internacional" },
      { id: "fr-3", name: "BFM TV", logo: "https://i.imgur.com/tLJBkvN.png", url: "https://ncdn-live-bfm.pfd.sfr.net/shls/LIVE$BFM_TV/index.m3u8", country: "França", category: "Notícias" },
    ],
  },
  {
    country: "Espanha",
    flag: "🇪🇸",
    channels: [
      { id: "es-1", name: "RTVE 24h", logo: "https://i.imgur.com/XQfSwqA.png", url: "https://rtvelivestream.akamaized.net/rtvesec/24h/24h_main_dvr.m3u8", country: "Espanha", category: "Notícias" },
      { id: "es-2", name: "La 1", logo: "https://i.imgur.com/JBCqJpC.png", url: "https://rtvelivestream.akamaized.net/rtvesec/la1/la1_main_dvr.m3u8", country: "Espanha", category: "Generalista" },
      { id: "es-3", name: "Teledeporte", logo: "https://i.imgur.com/sNrR6sH.png", url: "https://rtvelivestream.akamaized.net/rtvesec/tdp/tdp_main_dvr.m3u8", country: "Espanha", category: "Esportes" },
    ],
  },
  {
    country: "Moçambique",
    flag: "🇲🇿",
    channels: [
      { id: "mz-1", name: "TVM", logo: "https://i.imgur.com/VJ8bV4R.png", url: "https://live.tvm.co.mz/hls/tvm.m3u8", country: "Moçambique", category: "Generalista" },
      { id: "mz-2", name: "TVM Internacional", logo: "https://i.imgur.com/VJ8bV4R.png", url: "https://live.tvm.co.mz/hls/tvm-internacional.m3u8", country: "Moçambique", category: "Internacional" },
    ],
  },
  {
    country: "Cabo Verde",
    flag: "🇨🇻",
    channels: [
      { id: "cv-1", name: "RTC", logo: "https://i.imgur.com/oHZMdZq.png", url: "https://live.rtc.cv/hls/rtctv.m3u8", country: "Cabo Verde", category: "Generalista" },
    ],
  },
];

export const getAllChannels = (): Channel[] => {
  return channelGroups.flatMap((g) => g.channels);
};

export const getChannelsByCountry = (country: string): Channel[] => {
  return channelGroups.find((g) => g.country === country)?.channels ?? [];
};
