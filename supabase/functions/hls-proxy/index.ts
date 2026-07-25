// PrismaFly HLS Proxy — permite tocar streams HTTP (mixed content) e sem CORS
// GET /hls-proxy?u=<url encoded>
const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, range",
  "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
  "Access-Control-Expose-Headers": "content-length, content-range, accept-ranges",
};

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36";

const selfUrl = (req: Request) => {
  const base = Deno.env.get("SUPABASE_URL");
  if (base) return `${base}/functions/v1/hls-proxy`;
  const u = new URL(req.url);
  return `https://${u.host}${u.pathname}`;
};

const rewrite = (body: string, base: string, self: string) => {
  const abs = (raw: string) => {
    try {
      return `${self}?u=${encodeURIComponent(new URL(raw, base).toString())}`;
    } catch {
      return raw;
    }
  };
  return body
    .split("\n")
    .map((line) => {
      const t = line.trim();
      if (!t) return line;
      if (t.startsWith("#")) {
        return line.replace(/URI="([^"]+)"/g, (_m, p1) => `URI="${abs(p1)}"`);
      }
      return abs(t);
    })
    .join("\n");
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });

  const target = new URL(req.url).searchParams.get("u");
  if (!target) return new Response("missing u", { status: 400, headers: cors });

  let upstream: Response;
  try {
    const headers: Record<string, string> = { "User-Agent": UA, Accept: "*/*" };
    const range = req.headers.get("range");
    if (range) headers.Range = range;
    upstream = await fetch(target, { headers, redirect: "follow" });
  } catch (_e) {
    return new Response("upstream error", { status: 502, headers: cors });
  }

  const ct = upstream.headers.get("content-type") || "";
  const isPlaylist =
    /mpegurl/i.test(ct) || /\.m3u8(\?|$)/i.test(new URL(target).pathname + new URL(target).search);

  if (isPlaylist && upstream.ok) {
    const text = await upstream.text();
    if (text.includes("#EXTM3U")) {
      return new Response(rewrite(text, upstream.url || target, selfUrl(req)), {
        status: 200,
        headers: {
          ...cors,
          "Content-Type": "application/vnd.apple.mpegurl",
          "Cache-Control": "no-cache",
        },
      });
    }
    return new Response(text, {
      status: upstream.status,
      headers: { ...cors, "Content-Type": ct || "text/plain" },
    });
  }

  const h = new Headers(cors);
  for (const k of ["content-type", "content-length", "content-range", "accept-ranges"]) {
    const v = upstream.headers.get(k);
    if (v) h.set(k, v);
  }
  h.set("Cache-Control", "public, max-age=10");
  return new Response(upstream.body, { status: upstream.status, headers: h });
});
