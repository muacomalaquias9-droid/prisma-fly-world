import { Lock, Crown } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PlanGate = ({ channelName }: { channelName?: string }) => {
  const navigate = useNavigate();
  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-gradient-to-b from-[#0a0e1a] to-[#1a1530] text-white p-6">
      <div className="w-20 h-20 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center mb-5">
        <Lock size={32} className="text-primary" />
      </div>
      <h2 className="font-display text-2xl mb-2 text-center">Canal Premium</h2>
      {channelName && <p className="text-white/60 text-sm mb-1">{channelName}</p>}
      <p className="text-white/50 text-sm text-center max-w-xs mb-6">
        Para assistir este canal precisas de um plano ativo.
      </p>
      <button
        onClick={() => navigate("/plans")}
        className="bg-gradient-to-r from-[#ff6b35] to-[#f7931e] text-white font-bold px-6 py-3 rounded-xl shadow-lg shadow-orange-500/30 flex items-center gap-2"
      >
        <Crown size={16} />
        Ver Planos
      </button>
      <button
        onClick={() => navigate("/")}
        className="mt-3 text-white/50 text-xs underline"
      >
        Voltar
      </button>
    </div>
  );
};

export default PlanGate;
