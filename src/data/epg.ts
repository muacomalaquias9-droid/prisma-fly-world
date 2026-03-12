export interface EPGProgram {
  title: string;
  startTime: Date;
  endTime: Date;
  category: string;
  description?: string;
}

// Simulated EPG data generator based on channel category and current time
const programTemplates: Record<string, string[][]> = {
  Notícias: [
    ["Jornal da Manhã", "Notícias ao Vivo", "Edição Especial", "Debate Aberto", "Panorama"],
    ["Repórter em Ação", "Flash Informativo", "Análise do Dia", "Telejornal", "Notícias 24h"],
  ],
  News: [
    ["Morning Report", "Breaking News Live", "World Tonight", "Special Edition", "Headlines"],
    ["News Update", "In Depth Analysis", "Evening Report", "World News Now", "Late Edition"],
  ],
  Generalista: [
    ["Bom Dia", "Magazine da Manhã", "Sessão da Tarde", "Telenovela", "Jornal Nacional"],
    ["Programa da Manhã", "Culinária & Cia", "Documentário", "Série Especial", "Noite de Cinema"],
  ],
  Esportes: [
    ["SportCenter", "Gols da Rodada", "Arena Esportiva", "Futebol ao Vivo", "Análise Tática"],
    ["Destaque Esportivo", "Copa ao Vivo", "Bastidores", "Top 10 Semana", "Esporte Noturno"],
  ],
  Sports: [
    ["SportCenter", "Game Day", "Top Plays", "Match of the Day", "Sports Tonight"],
    ["Highlight Reel", "Pre-Game Show", "Live Coverage", "Analysis Desk", "Late Night Sports"],
  ],
  Entretenimento: [
    ["Show da Manhã", "Reality Show", "Música ao Vivo", "Talk Show", "Cinema em Casa"],
    ["Variedades", "Humor Total", "Festival de Talentos", "Noite de Estrelas", "Late Show"],
  ],
  Entertainment: [
    ["Morning Show", "Reality Rewind", "Live Music", "Talk Tonight", "Movie Night"],
    ["Variety Hour", "Comedy Club", "Talent Search", "Star Spotlight", "Late Night"],
  ],
  Religioso: [
    ["Oração da Manhã", "Palavra de Fé", "Culto ao Vivo", "Testemunhos", "Reflexão Noturna"],
    ["Louvor & Adoração", "Escola Bíblica", "Pregação Especial", "Comunidade de Fé", "Meditação"],
  ],
  Educação: [
    ["Aula de Ciências", "Matemática Fácil", "História do Brasil", "Língua Portuguesa", "Geografia"],
    ["Física na Prática", "Literatura", "Química para Todos", "Educação Digital", "Revisão"],
  ],
  Governo: [
    ["Sessão Plenária", "Câmara Debate", "Comissão Especial", "Audiência Pública", "Votação ao Vivo"],
    ["Pronunciamento", "Mesa Redonda", "Legislação em Pauta", "Fiscalização", "Ordem do Dia"],
  ],
  Música: [
    ["Playlist da Manhã", "Top Hits", "Clássicos Eternos", "Show ao Vivo", "Festival"],
    ["Novo Som", "Ritmos do Mundo", "Acústico Especial", "DJ Set", "Noite Musical"],
  ],
  Documentário: [
    ["Mundo Natural", "Civilizações", "Ciência Hoje", "Viagem Pelo Mundo", "Exploradores"],
    ["Planeta Terra", "História Oculta", "Tecnologia do Futuro", "Oceanos", "Universo"],
  ],
  default: [
    ["Programa da Manhã", "Especial do Dia", "Magazine", "Entretenimento Total", "Noite Especial"],
    ["Bom Dia", "Destaque", "Variedades", "Série", "Cinema"],
  ],
};

export function generateEPG(channelId: string, category: string): EPGProgram[] {
  const templates = programTemplates[category] || programTemplates.default;
  const programs: EPGProgram[] = [];
  const now = new Date();
  const startOfDay = new Date(now);
  startOfDay.setHours(5, 0, 0, 0); // Programs start at 5 AM

  // Use channel ID as seed for consistent-ish randomization
  const seed = channelId.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);

  const durations = [30, 60, 45, 90, 120, 60, 30, 60, 45, 90, 60, 120, 60, 30];
  let currentTime = new Date(startOfDay);

  for (let i = 0; i < 14; i++) {
    const templateSet = templates[(seed + i) % templates.length];
    const title = templateSet[(seed + i) % templateSet.length];
    const duration = durations[(seed + i) % durations.length];

    const endTime = new Date(currentTime);
    endTime.setMinutes(endTime.getMinutes() + duration);

    programs.push({
      title,
      startTime: new Date(currentTime),
      endTime,
      category,
    });

    currentTime = endTime;
  }

  return programs;
}

export function getCurrentProgram(programs: EPGProgram[]): EPGProgram | null {
  const now = new Date();
  return programs.find((p) => now >= p.startTime && now < p.endTime) || null;
}

export function getNextProgram(programs: EPGProgram[]): EPGProgram | null {
  const now = new Date();
  return programs.find((p) => p.startTime > now) || null;
}
