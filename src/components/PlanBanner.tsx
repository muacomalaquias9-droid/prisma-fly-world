import { useEffect, useState } from "react";
import { Crown, Clock, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const PlanBanner = () => {
  const { activePlan, user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [, tick] = useState(0);

  useEffect(() => {
    const iv = setInterval(() => tick((t) => t + 1), 60000);
    return () => clearInterval(iv);
  }, []);

  if (!user) return null;

  if (isAdmin) {
    return (
      <button
        onClick={() => navigate("/admin")}
        className="w-full mt-3 flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-amber-600/10 border border-amber-500/40 px-3 py-2 rounded-md"
      >
        <Crown size={14} className="text-amber-600" />
        <span className="text-xs font-bold text-amber-700">Modo Admin · gerir planos</span>
      </button>
    );
  }

  if (!activePlan) {
    return (
      <button
        onClick={() => navigate("/plans")}
        className="w-full mt-3 flex items-center gap-2 bg-primary/10 border border-primary/40 px-3 py-2 rounded-md"
      >
        <Lock size={14} className="text-primary" />
        <span className="text-xs font-bold text-primary">Sem plano ativo · ver planos</span>
      </button>
    );
  }

  const ms = new Date(activePlan.expires_at).getTime() - Date.now();
  const days = Math.floor(ms / 86400000);
  const hours = Math.floor((ms % 86400000) / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);

  let timeText = "";
  if (days >= 1) timeText = `${days} ${days === 1 ? "dia" : "dias"}`;
  else if (hours >= 1) timeText = `${hours}h ${minutes}m`;
  else timeText = `${minutes} min`;

  const expiringSoon = ms < 86400000;

  return (
    <button
      onClick={() => navigate("/plans")}
      className={`w-full mt-3 flex items-center gap-2 px-3 py-2 rounded-md border ${
        expiringSoon
          ? "bg-red-500/10 border-red-500/40"
          : "bg-green-500/10 border-green-500/40"
      }`}
    >
      <Clock size={14} className={expiringSoon ? "text-red-600" : "text-green-600"} />
      <span className={`text-xs font-bold ${expiringSoon ? "text-red-700" : "text-green-700"}`}>
        Plano {activePlan.plan_name} · {timeText} restantes
      </span>
    </button>
  );
};

export default PlanBanner;
