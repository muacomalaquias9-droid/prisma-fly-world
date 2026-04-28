import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { ArrowLeft, Check, Crown, Loader2, Copy } from "lucide-react";
import { toast } from "sonner";

interface Plan {
  id: string;
  name: string;
  price_kz: number;
  duration_days: number;
  description: string | null;
  sort_order: number;
}

const Plans = () => {
  const navigate = useNavigate();
  const { user, activePlan, refresh } = useAuth();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selected, setSelected] = useState<Plan | null>(null);
  const [reference, setReference] = useState("");
  const [method, setMethod] = useState("Multicaixa Express");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    supabase
      .from("plans")
      .select("*")
      .eq("active", true)
      .order("sort_order")
      .then(({ data }) => setPlans((data as Plan[]) ?? []));
  }, []);

  const submit = async () => {
    if (!user || !selected) return;
    if (reference.trim().length < 4) {
      toast.error("Insere a referência do pagamento");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("subscriptions").insert({
      user_id: user.id,
      plan_id: selected.id,
      status: "pending",
      payment_method: method,
      payment_reference: reference.trim(),
    });
    setSubmitting(false);
    if (error) {
      toast.error("Erro ao enviar pedido");
      return;
    }
    toast.success("Pedido enviado! O admin irá ativar em breve.");
    setSelected(null);
    setReference("");
    refresh();
  };

  const formatKz = (n: number) =>
    new Intl.NumberFormat("pt-AO").format(n) + " Kz";

  const copy = (txt: string) => {
    navigator.clipboard.writeText(txt);
    toast.success("Copiado");
  };

  return (
    <div className="h-full flex flex-col bg-background">
      <header className="flex-shrink-0 px-4 py-3 border-b border-border flex items-center gap-3 safe-area-top">
        <button onClick={() => navigate(-1)} className="p-1 -ml-1">
          <ArrowLeft size={20} />
        </button>
        <h1 className="font-display text-xl">Planos</h1>
      </header>

      <main className="flex-1 overflow-y-auto pb-24 px-4 pt-4">
        {activePlan && (
          <div className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/30 flex items-center gap-2">
            <Crown size={16} className="text-green-600" />
            <div className="text-xs">
              <p className="font-semibold text-green-700">Plano ativo: {activePlan.plan_name}</p>
              <p className="text-green-600/80">Expira em {new Date(activePlan.expires_at).toLocaleString("pt-AO")}</p>
            </div>
          </div>
        )}

        <p className="text-xs text-muted-foreground mb-3 ink-stamp">
          Escolhe um plano · Paga · Envia comprovativo · Admin ativa
        </p>

        <div className="space-y-3">
          {plans.map((p) => {
            const isPicked = selected?.id === p.id;
            const isPopular = p.duration_days === 30;
            return (
              <button
                key={p.id}
                onClick={() => setSelected(p)}
                className={`w-full text-left vintage-card p-4 transition relative ${
                  isPicked ? "ring-2 ring-primary" : ""
                }`}
              >
                {isPopular && (
                  <span className="absolute -top-2 right-3 bg-primary text-primary-foreground text-[9px] font-bold px-2 py-0.5 ink-stamp">
                    Mais popular
                  </span>
                )}
                <div className="flex items-baseline justify-between">
                  <h3 className="font-display text-lg">{p.name}</h3>
                  <span className="font-typewriter font-bold text-primary text-lg">
                    {formatKz(p.price_kz)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{p.description}</p>
                <div className="mt-2 flex items-center gap-3 text-[11px]">
                  <span className="flex items-center gap-1">
                    <Check size={12} className="text-primary" /> {p.duration_days}{" "}
                    {p.duration_days === 1 ? "dia" : "dias"}
                  </span>
                  <span className="flex items-center gap-1">
                    <Check size={12} className="text-primary" /> Todos os canais
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {selected && (
          <div className="mt-5 vintage-card p-4">
            <h3 className="font-display text-base mb-2">Pagamento — {selected.name}</h3>
            <p className="text-xs text-muted-foreground mb-3">
              Faz o pagamento de <strong>{formatKz(selected.price_kz)}</strong> e envia a referência.
            </p>

            <div className="space-y-2 text-xs mb-3">
              <div className="flex items-center justify-between bg-secondary/50 p-2 rounded">
                <div>
                  <p className="ink-stamp text-[9px] text-muted-foreground">Multicaixa Express</p>
                  <p className="font-typewriter font-bold">923 456 789</p>
                </div>
                <button onClick={() => copy("923456789")}>
                  <Copy size={14} />
                </button>
              </div>
              <div className="flex items-center justify-between bg-secondary/50 p-2 rounded">
                <div>
                  <p className="ink-stamp text-[9px] text-muted-foreground">IBAN BAI</p>
                  <p className="font-typewriter font-bold">AO06 0040 0000 1234 5678 9012 3</p>
                </div>
                <button onClick={() => copy("AO0600400000123456789012 3")}>
                  <Copy size={14} />
                </button>
              </div>
            </div>

            <label className="text-xs ink-stamp text-muted-foreground">Método</label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="w-full mb-2 px-3 py-2 bg-card border border-border text-sm font-typewriter"
            >
              <option>Multicaixa Express</option>
              <option>Transferência IBAN</option>
              <option>Depósito</option>
            </select>

            <label className="text-xs ink-stamp text-muted-foreground">
              Referência / Nº do comprovativo
            </label>
            <input
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="Ex: MCX123456 ou últimos 4 dígitos"
              className="w-full mb-3 px-3 py-2 bg-card border border-border text-sm font-typewriter"
            />

            <button
              onClick={submit}
              disabled={submitting}
              className="w-full bg-primary text-primary-foreground font-bold py-3 ink-stamp disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {submitting && <Loader2 size={14} className="animate-spin" />}
              Enviar pedido
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Plans;
