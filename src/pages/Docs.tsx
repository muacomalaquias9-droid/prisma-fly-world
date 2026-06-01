import { useNavigate } from "react-router-dom";
import { ArrowLeft, Code2, Key, Zap, Smartphone, Copy, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { vibrate } from "@/lib/device";

const API_BASE = `https://kxkiexhxlydwzwmdgfqw.supabase.co/functions/v1/api/v1`;

const CodeBlock = ({ code, lang = "bash" }: { code: string; lang?: string }) => {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(code);
    vibrate("success");
    setCopied(true);
    toast.success("Copiado");
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className="relative group">
      <pre className="bg-zinc-950 text-zinc-100 text-[11px] leading-relaxed rounded-xl p-3 overflow-x-auto border border-zinc-800">
        <code>{code}</code>
      </pre>
      <button
        onClick={copy}
        className="absolute top-2 right-2 p-1.5 bg-zinc-800 hover:bg-zinc-700 rounded text-zinc-300"
      >
        {copied ? <Check size={12} /> : <Copy size={12} />}
      </button>
    </div>
  );
};

const Section = ({ icon: Icon, title, children }: any) => (
  <section className="mb-6">
    <h2 className="flex items-center gap-2 text-base font-semibold mb-2 text-foreground">
      <Icon size={16} className="text-primary" /> {title}
    </h2>
    <div className="space-y-3 text-sm text-muted-foreground">{children}</div>
  </section>
);

const Docs = () => {
  const navigate = useNavigate();
  return (
    <div className="h-full flex flex-col bg-background overflow-hidden">
      <header className="flex-shrink-0 px-4 py-3 border-b border-border flex items-center gap-3 safe-area-top">
        <button onClick={() => { vibrate(); navigate(-1); }} className="p-1 -ml-1">
          <ArrowLeft size={20} />
        </button>
        <Code2 size={18} className="text-primary" />
        <h1 className="text-lg font-semibold">Documentação API</h1>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-4 pb-24">
        <p className="text-xs text-muted-foreground mb-6">
          API REST da PrismaFly. Use-a no teu cliente nativo (iOS/Android) para renderizar canais
          como app nativa, não como WebView.
        </p>

        <Section icon={Key} title="Autenticação">
          <p>
            Todos os pedidos precisam dos cabeçalhos <code className="text-primary">X-API-Key</code>{" "}
            e <code className="text-primary">X-API-Secret</code>. Gera as credenciais no painel
            Admin.
          </p>
          <CodeBlock
            code={`X-API-Key: pf_xxxxxxxxxxxxxxxx
X-API-Secret: sk_xxxxxxxxxxxxxxxxxxxxxxxx`}
          />
        </Section>

        <Section icon={Code2} title="Endpoints">
          <div>
            <p className="text-foreground font-medium mb-1">GET /v1/status</p>
            <CodeBlock code={`curl ${API_BASE}/status`} />
          </div>
          <div>
            <p className="text-foreground font-medium mb-1">POST /v1/auth — verifica credenciais</p>
            <CodeBlock
              code={`curl -X POST ${API_BASE}/auth \\
  -H "X-API-Key: pf_..." \\
  -H "X-API-Secret: sk_..."`}
            />
          </div>
          <div>
            <p className="text-foreground font-medium mb-1">GET /v1/channels — lista canais</p>
            <CodeBlock
              code={`curl ${API_BASE}/channels \\
  -H "X-API-Key: pf_..." \\
  -H "X-API-Secret: sk_..."`}
            />
          </div>
          <div>
            <p className="text-foreground font-medium mb-1">GET /v1/channels/:id — detalhe</p>
            <CodeBlock
              code={`curl ${API_BASE}/channels/ao-1 \\
  -H "X-API-Key: pf_..." \\
  -H "X-API-Secret: sk_..."`}
            />
          </div>
        </Section>

        <Section icon={Smartphone} title="Cliente Nativo (iOS / Android)">
          <p>Exemplo em Swift / Kotlin — consome JSON e renderiza nativamente.</p>
          <CodeBlock
            lang="swift"
            code={`// Swift
var req = URLRequest(url: URL(string: "${API_BASE}/channels")!)
req.setValue("pf_...", forHTTPHeaderField: "X-API-Key")
req.setValue("sk_...", forHTTPHeaderField: "X-API-Secret")
URLSession.shared.dataTask(with: req) { data, _, _ in
  // decode JSON e renderiza com UIKit / SwiftUI
}.resume()`}
          />
          <CodeBlock
            lang="kotlin"
            code={`// Kotlin
val req = Request.Builder()
  .url("${API_BASE}/channels")
  .addHeader("X-API-Key", "pf_...")
  .addHeader("X-API-Secret", "sk_...")
  .build()
client.newCall(req).execute()`}
          />
        </Section>

        <Section icon={Zap} title="Vibração & Rotação">
          <p>
            A app deteta automaticamente quando está empacotada como nativa
            (Capacitor/Cordova). Vibração funciona em Android via{" "}
            <code className="text-primary">navigator.vibrate</code>. A rotação está desbloqueada por
            defeito — o app pode rodar em portrait e landscape.
          </p>
          <CodeBlock
            code={`import { vibrate, lockOrientation, unlockOrientation } from "@/lib/device";
vibrate("success");
await lockOrientation("landscape");  // ex: no player
await unlockOrientation();`}
          />
        </Section>

        <p className="text-[10px] text-muted-foreground text-center mt-8">
          PrismaFly API · v1 · use com responsabilidade
        </p>
      </main>
    </div>
  );
};

export default Docs;
