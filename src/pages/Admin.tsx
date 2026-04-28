import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { ArrowLeft, Check, X, Crown, Users, Clock, RefreshCw } from "lucide-react";
import { toast } from "sonner";

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

const Admin = () => {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [subs, setSubs] = useState<SubRow[]>([]);
  const [tab, setTab] = useState<"pending" | "active" | "all">("pending");
  const [refreshing, setRefreshing] = useState(false);

  const fetchSubs = async () => {
    setRefreshing(true);
    // Buscar subs com plano
    const { data: rawSubs } = await supabase
      .from("subscriptions")
      .select("*, plans(name, price_kz, duration_days)")
      .order("created_at", { ascending: false });

    if (!rawSubs) {
      setRefreshing(false);
      return;
    }

    // Buscar perfis em batch
    const userIds = [...new Set(rawSubs.map((s: any) => s.user_id))];
    const { data: profs } = await supabase
      .from("profiles")
      .select("user_id, email, display_name")
      .in("user_id", userIds);

    const profMap = new Map((profs ?? []).map((p: any) => [p.user_id, p]));
    const merged = rawSubs.map((s: any) => ({
      ...s,
      profiles: profMap.get(s.user_id) ?? null,
    }));
    setSubs(merged as SubRow[]);
    setRefreshing(false);
  };

  useEffect(() => {
    if (isAdmin) fetchSubs();
  }, [isAdmin]);

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;

  const activate = async (sub: SubRow, customDays?: number) => {
    const days = customDays ?? sub.plans.duration_days;
    const expires = new Date(Date.now() + days * 86400000).toISOString();
    const { error } = await supabase
      .from("subscriptions")
      .update({
        status: "active",
        activated_at: new Date().toISOString(),
        expires_at: expires,
        activated_by: user!.id,
      })
      .eq("id", sub.id);
    if (error) return toast.error("Erro ao ativar");
    toast.success(`Plano ativado · ${days} dias`);
    fetchSubs();
  };

  const reject = async (sub: SubRow) => {
    const { error } = await supabase
      .from("subscriptions")
      .update({ status: "rejected" })
      .eq("id", sub.id);
    if (error) return toast.error("Erro");
    toast.success("Pedido rejeitado");
    fetchSubs();
  };

  const filtered = subs.filter((s) => {
    if (tab === "pending") return s.status === "pending";
    if (tab === "active") return s.status === "active" && s.expires_at && new Date(s.expires_at) > new Date();
    return true;
  });

  const counts = {
    pending: subs.filter((s) => s.status === "pending").length,
    active: subs.filter((s) => s.status === "active" && s.expires_at && new Date(s.expires_at) > new Date()).length,
    total: subs.length,
  };

  return (
    <div className="h-full flex flex-col bg-background">
      <header className="flex-shrink-0 px-4 py-3 border-b border-border flex items-center gap-3 safe-area-top">
        <button onClick={() => navigate("/")} className="p-1 -ml-1">
          <ArrowLeft size={20} />
        </button>
        <Crown size={18} className="text-primary" />
        <h1 className="font-display text-xl">Painel Admin</h1>
        <button
          onClick={fetchSubs}
          className="ml-auto p-1.5 hover:bg-secondary rounded"
          disabled={refreshing}
        >
          <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
        </button>
      </header>

      <div className="px-4 py-3 grid grid-cols-3 gap-2 border-b border-border">
        <Stat label="Pendentes" value={counts.pending} active={tab === "pending"} onClick={() => setTab("pending")} />
        <Stat label="Ativos" value={counts.active} active={tab === "active"} onClick={() => setTab("active")} />
        <Stat label="Todos" value={counts.total} active={tab === "all"} onClick={() => setTab("all")} />
      </div>

      <main className="flex-1 overflow-y-auto pb-20 px-4 pt-3">
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
              <div key={s.id} className="vintage-card p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">
                      {s.profiles?.display_name ?? "Sem nome"}
                    </p>
                    <p className="text-[11px] text-muted-foreground truncate">{s.profiles?.email}</p>
                  </div>
                  <span
                    className={`text-[9px] px-2 py-0.5 ink-stamp font-bold ${
                      s.status === "pending"
                        ? "bg-amber-500/20 text-amber-700"
                        : s.status === "active"
                        ? "bg-green-500/20 text-green-700"
                        : s.status === "rejected"
                        ? "bg-red-500/20 text-red-700"
                        : "bg-gray-500/20 text-gray-700"
                    }`}
                  >
                    {s.status}
                  </span>
                </div>

                <div className="mt-2 grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <p className="ink-stamp text-[9px] text-muted-foreground">Plano</p>
                    <p className="font-bold">{s.plans.name}</p>
                  </div>
                  <div>
                    <p className="ink-stamp text-[9px] text-muted-foreground">Valor</p>
                    <p className="font-typewriter">{s.plans.price_kz.toLocaleString("pt-AO")} Kz</p>
                  </div>
                  <div>
                    <p className="ink-stamp text-[9px] text-muted-foreground">Método</p>
                    <p>{s.payment_method ?? "—"}</p>
                  </div>
                  <div>
                    <p className="ink-stamp text-[9px] text-muted-foreground">Ref.</p>
                    <p className="font-typewriter truncate">{s.payment_reference ?? "—"}</p>
                  </div>
                </div>

                {s.status === "active" && s.expires_at && (
                  <div className="mt-2 flex items-center gap-1.5 bg-green-500/10 px-2 py-1 rounded text-[11px] text-green-700">
                    <Clock size={11} />
                    {remainingDays > 0
                      ? `${remainingDays} dias restantes`
                      : `${remainingHours}h restantes`}
                  </div>
                )}

                {s.status === "pending" && (
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => activate(s)}
                      className="flex-1 bg-green-600 text-white text-xs font-bold py-2 ink-stamp flex items-center justify-center gap-1"
                    >
                      <Check size={12} /> Ativar {s.plans.duration_days}d
                    </button>
                    <button
                      onClick={() => {
                        const d = prompt("Dias personalizados:", String(s.plans.duration_days));
                        if (d && !isNaN(Number(d))) activate(s, Number(d));
                      }}
                      className="px-3 bg-secondary text-foreground text-xs font-bold py-2 ink-stamp"
                    >
                      ✎
                    </button>
                    <button
                      onClick={() => reject(s)}
                      className="px-3 bg-red-600 text-white text-xs font-bold py-2 ink-stamp"
                    >
                      <X size={12} />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

const Stat = ({ label, value, active, onClick }: any) => (
  <button
    onClick={onClick}
    className={`p-2 text-center border ${
      active ? "border-primary bg-primary/10" : "border-border bg-card"
    }`}
  >
    <p className="text-lg font-display font-bold">{value}</p>
    <p className="text-[9px] ink-stamp text-muted-foreground">{label}</p>
  </button>
);

export default Admin;
