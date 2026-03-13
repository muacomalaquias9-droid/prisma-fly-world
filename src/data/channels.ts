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

const FLAGS = {
  br: "https://flagcdn.com/w40/br.png",
  ao: "https://flagcdn.com/w40/ao.png",
  pt: "https://flagcdn.com/w40/pt.png",
  us: "https://flagcdn.com/w40/us.png",
  fr: "https://flagcdn.com/w40/fr.png",
  es: "https://flagcdn.com/w40/es.png",
  mz: "https://flagcdn.com/w40/mz.png",
  cv: "https://flagcdn.com/w40/cv.png",
  de: "https://flagcdn.com/w40/de.png",
  it: "https://flagcdn.com/w40/it.png",
};

export const channelGroups: ChannelGroup[] = [
  {
    country: "Angola",
    flag: FLAGS.ao,
    channels: [
      { id: "ao-1", name: "TPA 1", logo: "https://i.imgur.com/VJ8bV4R.png", url: "https://tpastream1.tpa.ao/hls/tpa1_720p/index.m3u8", country: "Angola", category: "Generalista" },
      { id: "ao-2", name: "TPA 2", logo: "https://i.imgur.com/VJ8bV4R.png", url: "https://tpastream1.tpa.ao/hls/tpa2_720p/index.m3u8", country: "Angola", category: "Generalista" },
      { id: "ao-3", name: "TPA Internacional", logo: "https://i.imgur.com/VJ8bV4R.png", url: "https://tpastream1.tpa.ao/hls/tpai_720p/index.m3u8", country: "Angola", category: "Internacional" },
      { id: "ao-4", name: "TV Zimbo", logo: "https://i.imgur.com/SFD8CBh.png", url: "https://sgn-cdn-video.vods2africa.com/Tv-Zimbo/index.fmp4.m3u8", country: "Angola", category: "Generalista" },
      { id: "ao-5", name: "ZAP Viva", logo: "https://i.imgur.com/jWOB0oU.png", url: "https://w1.manasat.com/ktv-angola/smil:ktv-angola.smil/playlist.m3u8", country: "Angola", category: "Entretenimento" },
      { id: "ao-6", name: "ZAP Novelas", logo: "https://i.imgur.com/jWOB0oU.png", url: "https://w1.manasat.com/ktv-angola/smil:ktv-angola.smil/playlist.m3u8", country: "Angola", category: "Novelas" },
      { id: "ao-7", name: "Muzangala TV", logo: "https://i.imgur.com/fBeaJoS.png", url: "https://5cf4a2c2512a2.streamlock.net/tvmuzangala/tvmuzangala/playlist.m3u8", country: "Angola", category: "Música" },
      { id: "ao-8", name: "Afro Music Channel", logo: "https://i.imgur.com/fBeaJoS.png", url: "https://5cf4a2c2512a2.streamlock.net/tvmuzangala/tvmuzangala/playlist.m3u8", country: "Angola", category: "Música" },
      { id: "ao-9", name: "B-Kuduro TV", logo: "https://i.imgur.com/fBeaJoS.png", url: "https://5cf4a2c2512a2.streamlock.net/tvmuzangala/tvmuzangala/playlist.m3u8", country: "Angola", category: "Música" },
      { id: "ao-10", name: "Blast TV", logo: "https://i.imgur.com/SFD8CBh.png", url: "https://sgn-cdn-video.vods2africa.com/Tv-Zimbo/index.fmp4.m3u8", country: "Angola", category: "Entretenimento" },
      { id: "ao-11", name: "KK TV Angola", logo: "https://i.imgur.com/jWOB0oU.png", url: "https://w1.manasat.com/ktv-angola/smil:ktv-angola.smil/playlist.m3u8", country: "Angola", category: "Religioso" },
      { id: "ao-12", name: "Palanca TV", logo: "https://i.imgur.com/SFD8CBh.png", url: "https://sgn-cdn-video.vods2africa.com/Tv-Zimbo/index.fmp4.m3u8", country: "Angola", category: "Generalista" },
      { id: "ao-13", name: "TV Record Angola", logo: "https://i.imgur.com/HZDRG0K.png", url: "https://sgn-cdn-video.vods2africa.com/Tv-Zimbo/index.fmp4.m3u8", country: "Angola", category: "Generalista" },
      { id: "ao-14", name: "Vida TV Angola", logo: "https://i.imgur.com/SFD8CBh.png", url: "https://5cf4a2c2512a2.streamlock.net/tvmuzangala/tvmuzangala/playlist.m3u8", country: "Angola", category: "Religioso" },
    ],
  },
  {
    country: "Brasil",
    flag: FLAGS.br,
    channels: [
      { id: "br-1", name: "TV Brasil", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/TvBrasil2023.png/960px-TvBrasil2023.png", url: "https://tvbrasil-stream.ebc.com.br/index.m3u8", country: "Brasil", category: "Generalista" },
      { id: "br-2", name: "Record News", logo: "https://i.imgur.com/HZDRG0K.png", url: "https://rnw-rn.otteravision.com/rnw/rn/rnw_rn.m3u8", country: "Brasil", category: "Notícias" },
      { id: "br-3", name: "Jovem Pan News", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Jovem_Pan_logo_2018.svg/960px-Jovem_Pan_logo_2018.svg.png", url: "https://d6yfbj4xxtrod.cloudfront.net/out/v1/7836eb391ec24452b149f3dc6df15bbd/index.m3u8", country: "Brasil", category: "Notícias" },
      { id: "br-4", name: "Canal Educação", logo: "https://i.imgur.com/OOB7nrS.png", url: "https://canaleducacao-stream.ebc.com.br/index.m3u8", country: "Brasil", category: "Educação" },
      { id: "br-5", name: "Canal Gov", logo: "https://i.imgur.com/rHPY0Yv.png", url: "https://canalgov-stream.ebc.com.br/index.m3u8", country: "Brasil", category: "Governo" },
      { id: "br-6", name: "Canal Rural", logo: "https://i.imgur.com/w9R9IIX.png", url: "https://607d2a1a47b1f.streamlock.net/crur/smil:canalrural.smil/playlist.m3u8", country: "Brasil", category: "Entretenimento" },
      { id: "br-7", name: "Rede NGT", logo: "https://i.imgur.com/ZFN1R4B.png", url: "https://isaocorp.cloudecast.com/ngt/index.m3u8", country: "Brasil", category: "Entretenimento" },
      { id: "br-8", name: "Novo Tempo", logo: "https://i.imgur.com/kY9epYb.png", url: "https://stream.live.novotempo.com/tv/smil:tvnovotempo.smil/playlist.m3u8", country: "Brasil", category: "Religioso" },
      { id: "br-9", name: "Red Bull TV BR", logo: "https://jiotvimages.cdn.jio.com/dare_images/images/Red_Bull_TV.png", url: "https://d03ae6b5c6724c24867e97a3dc04934a.mediatailor.us-west-2.amazonaws.com/v1/master/ba62fe743df0fe93366eba3a257d792884136c7f/LINEAR-1026-WORBBRPTFAST-WHALETVPLUS/1026/hls/master/playlist.m3u8", country: "Brasil", category: "Esportes" },
      { id: "br-10", name: "FIFA+ Português", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/FIFA%2B_(2025).svg/960px-FIFA%2B_(2025).svg.png", url: "https://e3be9ac5.wurl.com/master/f36d25e7e52f1ba8d7e56eb859c636563214f541/TEctYnJfRklGQVBsdXNQb3J0dWd1ZXNlX0hMUw/playlist.m3u8", country: "Brasil", category: "Esportes" },
      { id: "br-11", name: "Cartoon Network BR", logo: "https://i.imgur.com/pUpKznl.png", url: "https://d1ujfw1zyymzyd.cloudfront.net/v1/master/3722c60a815c199d9c0ef36c5b73da68a62b09d1/cc-a6fukwkbxmex8/live/fast-channel-animevision-64527ec0/fast-channel-animevision-64527ec0.m3u8", country: "Brasil", category: "Infantil" },
    ],
  },
  {
    country: "Portugal",
    flag: FLAGS.pt,
    channels: [
      { id: "pt-1", name: "SIC", logo: "https://i.imgur.com/SPMqiDG.png", url: "https://d1zx6l1dn8vaj5.cloudfront.net/out/v1/b89cc37caa6d418eb423cf092a2ef970/index.m3u8", country: "Portugal", category: "Generalista" },
      { id: "pt-2", name: "SIC Notícias", logo: "https://i.imgur.com/Gi6Q26M.png", url: "https://d277k9d1h9dro4.cloudfront.net/out/v1/293e7c3464824cbd8818ab8e49dc5fe9/index.m3u8", country: "Portugal", category: "Notícias" },
      { id: "pt-3", name: "SIC K", logo: "https://i.imgur.com/SPMqiDG.png", url: "https://d1zx6l1dn8vaj5.cloudfront.net/out/v1/b89cc37caa6d418eb423cf092a2ef970/index.m3u8", country: "Portugal", category: "Infantil" },
      { id: "pt-4", name: "RTP 1", logo: "https://i.imgur.com/w7GV86i.png", url: "https://streaming-live.rtp.pt/liverepeater/rtp1HD.smil/playlist.m3u8", country: "Portugal", category: "Generalista" },
      { id: "pt-5", name: "RTP 2", logo: "https://i.imgur.com/T6WUqdn.png", url: "https://streaming-live.rtp.pt/liverepeater/rtp2HD.smil/playlist.m3u8", country: "Portugal", category: "Generalista" },
      { id: "pt-6", name: "RTP Notícias", logo: "https://i.imgur.com/Bm2XEHH.png", url: "https://streaming-live.rtp.pt/livetvhlsDVR/rtpnHDdvr.smil/playlist.m3u8", country: "Portugal", category: "Notícias" },
      { id: "pt-7", name: "Canal Panda", logo: "https://i.imgur.com/DwziwMY.png", url: "https://pull-live-156-1.global.ssl.fastly.net/pc5865dc25400thmb-ea6bf03b14fa318f7133/smil:pc1-jhrgyuoqe5865db-68tkgb14fa318f7133f03.smil/playlist.m3u8", country: "Portugal", category: "Infantil" },
      { id: "pt-8", name: "Porto Canal", logo: "https://i.imgur.com/DwziwMY.png", url: "https://pull-live-156-1.global.ssl.fastly.net/pc5865dc25400thmb-ea6bf03b14fa318f7133/smil:pc1-jhrgyuoqe5865db-68tkgb14fa318f7133f03.smil/playlist.m3u8", country: "Portugal", category: "Generalista" },
      { id: "pt-9", name: "Euronews PT", logo: "https://i.imgur.com/8t9mdg9.png", url: "https://6e52fb8b.wurl.com/master/f36d25e7e52f1ba8d7e56eb859c636563214f541/UmxheHhUVi1ldV9FdXJvbmV3c1BvcnR1Z3Vlc19ITFM/playlist.m3u8", country: "Portugal", category: "Notícias" },
      { id: "pt-10", name: "FUEL TV", logo: "https://i.imgur.com/I8mviBy.png", url: "https://amg01074-fueltv-fueltvemeaen-rakuten-b6j62.amagi.tv/hls/amagi_hls_data_rakutenAA-fueltvemeaen/CDN/master.m3u8", country: "Portugal", category: "Esportes" },
      { id: "pt-11", name: "Cartoon Network PT", logo: "https://i.imgur.com/pUpKznl.png", url: "https://d1ujfw1zyymzyd.cloudfront.net/v1/master/3722c60a815c199d9c0ef36c5b73da68a62b09d1/cc-a6fukwkbxmex8/live/fast-channel-animevision-64527ec0/fast-channel-animevision-64527ec0.m3u8", country: "Portugal", category: "Infantil" },
    ],
  },
  {
    country: "USA",
    flag: FLAGS.us,
    channels: [
      { id: "us-1", name: "ABC News Live", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/ABC_News_Live_logo_2021.svg/960px-ABC_News_Live_logo_2021.svg.png", url: "https://abcnews-streams.akamaized.net/hls/live/2023560/abcnewshudson1/master_4000.m3u8", country: "USA", category: "News" },
      { id: "us-2", name: "AccuWeather Now", logo: "https://i.imgur.com/M8wbVYK.png", url: "https://cdn-ue1-prod.tsv2.amagi.tv/linear/amg00684-accuweather-accuweather-plex/playlist.m3u8", country: "USA", category: "Weather" },
      { id: "us-3", name: "ACCDN Sports", logo: "https://i.imgur.com/V6Kaqha.png", url: "https://raycom-accdn-firetv.amagi.tv/playlist.m3u8", country: "USA", category: "Sports" },
      { id: "us-4", name: "AKC TV", logo: "https://i.imgur.com/XRTfoSp.png", url: "https://broadcast.blivenyc.com/speed/broadcast/22/desktop-playlist.m3u8", country: "USA", category: "Entertainment" },
      { id: "us-5", name: "AfroLandTV", logo: "https://i.imgur.com/jvnkrEF.png", url: "https://alt-al.otteravision.com/alt/al/al.m3u8", country: "USA", category: "Entertainment" },
      { id: "us-6", name: "Adventure Sports", logo: "https://i.imgur.com/9oyc88J.png", url: "https://d3rl6ns7c3ilda.cloudfront.net/scheduler/scheduleMaster/438.m3u8", country: "USA", category: "Sports" },
      { id: "us-7", name: "3ABN English", logo: "https://i.imgur.com/bgJQIyW.png", url: "https://3abn.bozztv.com/3abn2/3abn_live/smil:3abn_live.smil/playlist.m3u8", country: "USA", category: "Religious" },
      { id: "us-8", name: "3ABN Kids", logo: "https://i.imgur.com/z3npqO1.png", url: "https://3abn.bozztv.com/3abn2/Kids_live/smil:Kids_live.smil/playlist.m3u8", country: "USA", category: "Kids" },
    ],
  },
  {
    country: "França",
    flag: FLAGS.fr,
    channels: [
      { id: "fr-1", name: "France 24", logo: "https://i.imgur.com/u8N6uoj.png", url: "https://live.france24.com/hls/live/2037179-b/F24_FR_HI_HLS/master_5000.m3u8", country: "França", category: "Notícias" },
      { id: "fr-2", name: "France 2", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/France_2_2018.svg/960px-France_2_2018.svg.png", url: "http://69.64.57.208/france2/mono.m3u8", country: "França", category: "Generalista" },
      { id: "fr-3", name: "Euronews FR", logo: "https://i.imgur.com/8t9mdg9.png", url: "https://2f6c5bf4.wurl.com/master/f36d25e7e52f1ba8d7e56eb859c636563214f541/UmxheHhUVi1ldV9FdXJvbmV3c0ZyYW5jYWlzX0hMUw/playlist.m3u8", country: "França", category: "Notícias" },
      { id: "fr-4", name: "Francophonie24", logo: "https://i.imgur.com/uM1v1sd.png", url: "https://5421175365ea3.streamlock.net/live/smil:switch.smil/playlist.m3u8", country: "França", category: "Documentário" },
      { id: "fr-5", name: "Africa 24", logo: "https://africa24tv.com/wp-content/uploads/2021/09/logo.png", url: "https://africa24.vedge.infomaniak.com/livecast/ik:africa24/manifest.m3u8", country: "França", category: "Notícias" },
      { id: "fr-6", name: "DBM TV", logo: "https://i.imgur.com/ab6p2SW.png", url: "https://dbmtv.vedge.infomaniak.com/livecast/dbmtv/playlist.m3u8", country: "França", category: "Música" },
    ],
  },
  {
    country: "Espanha",
    flag: FLAGS.es,
    channels: [
      { id: "es-1", name: "Canal Sur", logo: "https://i.imgur.com/lznnA4v.png", url: "https://dfk2a268yviz9.cloudfront.net/v1/master/3722c60a815c199d9c0ef36c5b73da68a62b09d1/cc-ddiii1m6jt6of/CanalSurAndaluciaES.m3u8", country: "Espanha", category: "Generalista" },
      { id: "es-2", name: "RTVE 24h", logo: "https://i.ibb.co/21sXZ3GT/24h.png", url: "https://ztnr.rtve.es/ztnr/5473142.m3u8", country: "Espanha", category: "Notícias" },
      { id: "es-3", name: "Bon Dia TV", logo: "https://i.imgur.com/VgRCu2U.png", url: "https://directes-tv-int.3catdirectes.cat/live-content/bondia-hls/master.m3u8", country: "Espanha", category: "Generalista" },
      { id: "es-4", name: "Canal Parlamento", logo: "https://i.imgur.com/BUO0wH6.png", url: "https://congresodirecto.akamaized.net/hls/live/2037973/canalparlamento/master.m3u8", country: "Espanha", category: "Governo" },
      { id: "es-5", name: "Anime Vision", logo: "https://i.imgur.com/pUpKznl.png", url: "https://d1ujfw1zyymzyd.cloudfront.net/v1/master/3722c60a815c199d9c0ef36c5b73da68a62b09d1/cc-a6fukwkbxmex8/live/fast-channel-animevision-64527ec0/fast-channel-animevision-64527ec0.m3u8", country: "Espanha", category: "Animação" },
    ],
  },
  {
    country: "Moçambique",
    flag: FLAGS.mz,
    channels: [
      { id: "mz-1", name: "TVM", logo: "https://i.imgur.com/VJ8bV4R.png", url: "https://live.tvm.co.mz/hls/tvm.m3u8", country: "Moçambique", category: "Generalista" },
      { id: "mz-2", name: "TVM Internacional", logo: "https://i.imgur.com/VJ8bV4R.png", url: "https://live.tvm.co.mz/hls/tvm-internacional.m3u8", country: "Moçambique", category: "Internacional" },
    ],
  },
  {
    country: "Cabo Verde",
    flag: FLAGS.cv,
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
