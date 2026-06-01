// PrismaFly Public API — autenticação por X-API-Key + X-API-Secret
// Endpoints:
//   GET  /api/v1/status
//   POST /api/v1/auth          (valida credenciais)
//   GET  /api/v1/channels      (lista canais)
//   GET  /api/v1/channels/:id  (detalhe + URL do stream)
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-api-key, x-api-secret",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

// Dataset compacto (extensível). Pode ser sincronizado com src/data/channels.ts.
const CHANNELS = [
  { id: "ao-1", name: "TV Zimbo", country: "Angola", category: "Notícias", url: "https://edge.tvzimbo.co.ao/zimbotv/zimbotv.m3u8" },
  { id: "ao-12", name: "TPA Internacional", country: "Angola", category: "Generalista", url: "" },
  { id: "pt-1", name: "RTP1", country: "Portugal", category: "Generalista", url: "" },
  { id: "kids-1", name: "Miraculous Ladybug", country: "Internacional", category: "Bonecos", url: "" },
  { id: "sports-1", name: "Sport TV PT", country: "Portugal", category: "Desporto", url: "" },
];

async function verify(req: Request): Promise<boolean> {
  const apiKey = req.headers.get("x-api-key");
  const secret = req.headers.get("x-api-secret");
  if (!apiKey || !secret) return false;
  const { data, error } = await supabase.rpc("verify_api_key", {
    _api_key: apiKey,
    _secret: secret,
  });
  if (error) return false;
  return data === true;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const url = new URL(req.url);
  // path estilo /api/v1/...  (remove o prefixo da function)
  const path = url.pathname.replace(/^.*?\/api/, "/api").replace(/\/+$/, "");

  try {
    if (path === "/api/v1/status" || path === "" || path === "/") {
      return json({ ok: true, service: "PrismaFly API", version: "v1", time: new Date().toISOString() });
    }

    if (path === "/api/v1/auth" && req.method === "POST") {
      const ok = await verify(req);
      return json({ authenticated: ok }, ok ? 200 : 401);
    }

    if (!(await verify(req))) {
      return json({ error: "Unauthorized", hint: "Envie X-API-Key e X-API-Secret" }, 401);
    }

    if (path === "/api/v1/channels" && req.method === "GET") {
      return json({ data: CHANNELS, total: CHANNELS.length });
    }

    const detail = path.match(/^\/api\/v1\/channels\/([\w-]+)$/);
    if (detail && req.method === "GET") {
      const ch = CHANNELS.find((c) => c.id === detail[1]);
      if (!ch) return json({ error: "Channel not found" }, 404);
      return json({ data: ch });
    }

    return json({ error: "Not found", path }, 404);
  } catch (e) {
    return json({ error: "Internal error", message: String((e as Error).message ?? e) }, 500);
  }
});
