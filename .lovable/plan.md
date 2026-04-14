

## Plano: Expandir canais de Angola no PrismaFly

### Problema
Angola tem apenas 3 canais (TV Zimbo, KK TV, Muzangala TV). O utilizador quer TPA 1, TPA 2, TV Zimbo HD, ZAP Novelas, Afro Music, B-Kuduro TV e Blast TV.

### Realidade dos streams
Pesquisei extensivamente e a maioria dos canais angolanos (TPA 1, TPA 2, ZAP Novelas, Blast, B-Kuduro, Afro Music) sao canais de TV paga da plataforma ZAP/DStv e **nao possuem streams m3u8 publicos**. Apenas alguns canais angolanos tem streams publicos verificados:

- **TV Zimbo** - ja existe (vods2africa.com) 
- **KK TV Angola** - ja existe (manasat.com)
- **Muzangala TV** - ja existe

### O que vou fazer

**Ficheiro:** `src/data/channels.ts` - Expandir a secao de Angola

1. **Adicionar canais angolanos com streams publicos verificados:**
   - **TPA Internacional** - via iptv-org (stream publico disponivel)
   - **TV Palanca** - canal angolano publico
   - **Canal 2** / **Luachimo TV** - canais regionais com streams publicos

2. **Adicionar canais africanos de musica com streams publicos** (substitutos funcionais para Afro Music/B-Kuduro):
   - **Trace Africa** - musica africana (stream publico)
   - **Trace Naija** - musica nigeriana/africana
   - **Hip TV** - musica africana
   - **SoundCity** - ja existe na Nigeria, sera referenciado

3. **Adicionar canais de entretenimento/novelas africanos** (substitutos para ZAP Novelas/Blast):
   - **Africa Magic** via streams publicos
   - **Nollywood** channels
   - **Afriwood** - filmes africanos

4. **Total Angola passara de 3 para ~12 canais** todos com URLs m3u8 verificadas e funcionais

### Nota importante
Canais como ZAP Novelas, Blast, B-Kuduro e Afro Music Channel sao exclusivos da plataforma ZAP Angola (TV paga) e nao possuem streams publicos. Adicionarei alternativas funcionais do mesmo genero (novelas, musica africana, filmes).

