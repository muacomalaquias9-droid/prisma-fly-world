import { useEffect, useState } from "react";
import { Navigate, useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import {
  ArrowLeft, Check, X, Crown, Users, Clock, RefreshCw,
  Key, Plus, Trash2, Copy, BookOpen, Power,
} from "lucide-react";
import { toast } from "sonner";
import { vibrate } from "@/lib/device";

interface SubRow {
  id: string;
  user_id: string;
  status: string;
  payment_reference: string | null;
  payment_method: string | null;
  expires_at: string | null;
  activated_at: string | null;
  created_at: string;
  plans: { name: string; price_kz: number; duration_days: number };
  profiles: { email: string; display_name: string | null } | null;
}

interface ApiKey {
  id: string;
  name: string;
  api_key: string;
  active: boolean;
  last_used_at: string | null;
  created_at: string;
}

type Tab = "pending" | "active" | "all" | "keys";

const Admin = () => {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [subs, setSubs] = useState<SubRow[]>([]);
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [tab, setTab] = useState<Tab>("pending");
  const [refreshing, setRefreshing] = useState(false);
  const [newSecret, setNewSecret] = useState<{ key: string; secret: string } | null>(null);
  const [newKeyName, setNewKeyName] = useState("");

  const fetchSubs = async () => {
    setRefreshing(true);
    const { data: rawSubs } = await supabase
      .from("subscriptions")
      .select("*, plans(name, price_kz, duration_days)")
      .order("created_at", { ascending: false });
    if (!rawSubs) return setRefreshing(false);
    const userIds = [...new Set(rawSubs.map((s: any) => s.user_id))];
    const { data: profs } = await supabase
      .from("profiles").select("user_id, email, display_name").in("user_id", userIds);
    const profMap = new Map((profs ?? []).map((p: any) => [p.user_id, p]));
    setSubs(rawSubs.map((s: any) => ({ ...s, profiles: profMap.get(s.user_id) ?? null })) as SubRow[]);
    setRefreshing(false);
  };

  const fetchKeys = async () => {
    const { data } = await supabase
      .from("api_keys")
      .select("id, name, api_key, active, last_used_at, created_at")
      .order("created_at", { ascending: false });
    setKeys((data ?? []) as ApiKey[]);
  };

  useEffect(() => {
    if (isAdmin) { fetchSubs(); fetchKeys(); }
  }, [isAdmin]);

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;

  const activate = async (sub: SubRow, customDays?: number) => {
    const days = customDays ?? sub.plans.duration_days;
    const expires = new Date(Date.now() + days * 86400000).toISOString();
    const { error } = await supabase.from("subscriptions").update({
      status: "active",
      activated_at: new Date().toISOString(),
      expires_at: expires,
      activated_by: user!.id,
    }).eq("id", sub.id);
    if (error) return toast.error("Erro ao ativar");
    vibrate("success");
    toast.success(`Plano ativado · ${days} dias`);
    fetchSubs();
  };

  const reject = async (sub: SubRow) => {
    const { error } = await supabase.from("subscriptions").update({ status: "rejected" }).eq("id", sub.id);
    if (error) return toast.error("Erro");
    vibrate("medium");
    toast.success("Pedido rejeitado");
    fetchSubs();
  };

  const createKey = async () => {
    if (!newKeyName.trim()) return toast.error("Indica um nome");
    const { data, error } = await supabase.rpc("create_api_key", { _name: newKeyName.trim() });
    if (error || !data || !data[0]) return toast.error("Erro ao criar");
    vibrate("success");
    setNewSecret({ key: data[0].api_key, secret: data[0].secret });
    setNewKeyName("");
    fetchKeys();
  };

  const toggleKey = async (k: ApiKey) => {
    await supabase.from("api_keys").update({ active: !k.active }).eq("id", k.id);
    vibrate();
    fetchKeys();
  };

  const deleteKey = async (k: ApiKey) => {
    if (!confirm(`Apagar a chave "${k.name}"?`)) return;
    await supabase.from("api_keys").delete().eq("id", k.id);
    vibrate("heavy");
    toast.success("Apagada");
    fetchKeys();
  };

  const copyText = (t: string) => {
    navigator.clipboard.writeText(t);
    vibrate("success");
    toast.success("Copiado");
  };

  const filtered = subs.filter((s) => {
    if (tab === "pending") return s.status === "pending";
    if (tab === "active") return s.status === "active" && s.expires_at && new Date(s.expires_at) > new Date();
    if (tab === "all") return true;
    return false;
  });

  const counts = {
    pending: subs.filter((s) => s.status === "pending").length,
    active: subs.filter((s) => s.status === "active" && s.expires_at && new Date(s.expires_at) > new Date()).length,
    total: subs.length,
  };

  return (
    <div className="h-full flex flex-col bg-background">
      <header className="flex-shrink-0 px-4 py-3 border-b border-border flex items-center gap-3 safe-area-top">
        <button onClick={() => { vibrate(); navigate("/"); }} className="p-1 -ml-1">
          <ArrowLeft size={20} />
        </button>
        <Crown size={18} className="text-primary" />
        <h1 className="text-lg font-semibold">Painel Admin</h1>
        <Link to="/docs" className="ml-auto p-1.5 hover:bg-secondary rounded text-muted-foreground" title="Docs">
          <BookOpen size={16} />
        </Link>
        <button
          onClick={() => { fetchSubs(); fetchKeys(); vibrate(); }}
          className="p-1.5 hover:bg-secondary rounded"
          disabled={refreshing}
        >
          <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
        </button>
      </header>

      <div className="px-4 py-3 grid grid-cols-4 gap-2 border-b border-border">
        <Stat label="Pendentes" value={counts.pending} active={tab === "pending"} onClick={() => { setTab("pending"); vibrate(); }} />
        <Stat label="Ativos" value={counts.active} active={tab === "active"} onClick={() => { setTab("active"); vibrate(); }} />
        <Stat label="Todos" value={counts.total} active={tab === "all"} onClick={() => { setTab("all"); vibrate(); }} />
        <Stat label="API" value={keys.length} active={tab === "keys"} onClick={() => { setTab("keys"); vibrate(); }} icon={Key} />
      </div>

      <main className="flex-1 overflow-y-auto pb-20 px-4 pt-3">
        {tab === "keys" ? (
          <>
            {newSecret && (
              <div className="mb-3 p-3 rounded-xl border border-amber-400/40 bg-amber-50 dark:bg-amber-950/30">
                <p className="text-xs font-semibold text-amber-700 dark:text-amber-300 mb-2">
                  Guarda agora — o segredo não voltará a aparecer
                </p>
                <Field label="API Key" value={newSecret.key} onCopy={copyText} />
                <Field label="Secret" value={newSecret.secret} onCopy={copyText} />
                <button
                  onClick={() => setNewSecret(null)}
                  className="mt-2 text-xs text-amber-700 dark:text-amber-300 underline"
                >
                  Fechar
                </button>
              </div>
            )}

            <div className="mb-3 flex gap-2">
              <input
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                placeholder="Nome (ex: App iOS)"
                className="flex-1 bg-secondary/50 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
              />
              <button
                onClick={createKey}
                className="bg-primary text-primary-foreground rounded-lg px-3 text-sm font-semibold flex items-center gap-1"
              >
                <Plus size={14} /> Criar
              </button>
            </div>

            {keys.length === 0 && (
              <div className="text-center py-12 text-muted-foreground text-sm">
                <Key size={28} className="mx-auto mb-2 opacity-40" />
                Sem API Keys
              </div>
            )}
            <div className="space-y-2">
              {keys.map((k) => (
                <div key={k.id} className="rounded-xl border border-border bg-card p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">{k.name}</p>
                      <p className="text-[11px] text-muted-foreground font-mono truncate">{k.api_key}</p>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                      k.active ? "bg-green-500/15 text-green-600" : "bg-zinc-500/15 text-zinc-500"
                    }`}>
                      {k.active ? "ativa" : "desativa"}
                    </span>
                  </div>
                  <p className="mt-1 text-[10px] text-muted-foreground">
                    {k.last_used_at ? `Último uso: ${new Date(k.last_used_at).toLocaleString("pt-PT")}` : "Nunca usada"}
                  </p>
                  <div className="mt-2 flex gap-2">
                    <button onClick={() => copyText(k.api_key)} className="flex-1 text-xs bg-secondary py-1.5 rounded-lg flex items-center justify-center gap-1">
                      <Copy size={12} /> Copiar
                    </button>
                    <button onClick={() => toggleKey(k)} className="px-3 text-xs bg-secondary py-1.5 rounded-lg">
                      <Power size={12} />
                    </button>
                    <button onClick={() => deleteKey(k)} className="px-3 text-xs bg-red-500/15 text-red-600 py-1.5 rounded-lg">
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            {filtered.length === 0 && (
              <div className="text-center py-12 text-muted-foreground text-sm">
                <Users size={32} className="mx-auto mb-2 opacity-40" />
                Nenhum pedido nesta categoria
              </div>
            )}
            <div className="space-y-2">
              {filtered.map((s) => {
                const remainingMs = s.expires_at ? new Date(s.expires_at).getTime() - Date.now() : 0;
                const remainingDays = Math.max(0, Math.floor(remainingMs / 86400000));
                const remainingHours = Math.max(0, Math.floor(remainingMs / 3600000));
                return (
                  <div key={s.id} className="rounded-xl border border-border bg-card p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">
                          {s.profiles?.display_name ?? "Sem nome"}
                        </p>
                        <p className="text-[11px] text-muted-foreground truncate">{s.profiles?.email}</p>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                        s.status === "pending" ? "bg-amber-500/15 text-amber-600"
                          : s.status === "active" ? "bg-green-500/15 text-green-600"
                          : s.status === "rejected" ? "bg-red-500/15 text-red-600"
                          : "bg-zinc-500/15 text-zinc-500"
                      }`}>
                        {s.status}
                      </span>
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-2 text-[11px]">
                      <Info label="Plano" value={s.plans.name} />
                      <Info label="Valor" value={`${s.plans.price_kz.toLocaleString("pt-AO")} Kz`} />
                      <Info label="Método" value={s.payment_method ?? "—"} />
                      <Info label="Ref." value={s.payment_reference ?? "—"} />
                    </div>
                    {s.status === "active" && s.expires_at && (
                      <div className="mt-2 flex items-center gap-1.5 bg-green-500/10 px-2 py-1 rounded text-[11px] text-green-600">
                        <Clock size={11} />
                        {remainingDays > 0 ? `${remainingDays} dias restantes` : `${remainingHours}h restantes`}
                      </div>
                    )}
                    {s.status === "pending" && (
                      <div className="mt-3 flex gap-2">
                        <button onClick={() => activate(s)} className="flex-1 bg-green-600 text-white text-xs font-semibold py-2 rounded-lg flex items-center justify-center gap-1">
                          <Check size={12} /> Ativar {s.plans.duration_days}d
                        </button>
                        <button onClick={() => {
                          const d = prompt("Dias personalizados:", String(s.plans.duration_days));
                          if (d && !isNaN(Number(d))) activate(s, Number(d));
                        }} className="px-3 bg-secondary text-foreground text-xs font-semibold py-2 rounded-lg">✎</button>
                        <button onClick={() => reject(s)} className="px-3 bg-red-600 text-white text-xs font-semibold py-2 rounded-lg">
                          <X size={12} />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

const Stat = ({ label, value, active, onClick, icon: Icon }: any) => (
  <button
    onClick={onClick}
    className={`p-2 text-center rounded-lg border transition ${
      active ? "border-primary bg-primary/10" : "border-border bg-card"
    }`}
  >
    <p className="text-lg font-bold flex items-center justify-center gap-1">
      {Icon && <Icon size={14} />}{value}
    </p>
    <p className="text-[9px] uppercase tracking-wide text-muted-foreground">{label}</p>
  </button>
);

const Info = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="text-[9px] uppercase tracking-wide text-muted-foreground">{label}</p>
    <p className="font-medium truncate">{value}</p>
  </div>
);

const Field = ({ label, value, onCopy }: { label: string; value: string; onCopy: (v: string) => void }) => (
  <div className="mb-1.5">
    <p className="text-[10px] uppercase text-muted-foreground">{label}</p>
    <div className="flex gap-1 items-center">
      <code className="flex-1 text-[11px] font-mono bg-background border border-border rounded px-2 py-1 truncate">{value}</code>
      <button onClick={() => onCopy(value)} className="p-1.5 bg-secondary rounded">
        <Copy size={12} />
      </button>
    </div>
  </div>
);

export default Admin;
