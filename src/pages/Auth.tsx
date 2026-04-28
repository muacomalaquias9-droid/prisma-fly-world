import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Tv, Mail, Lock, User as UserIcon, Loader2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

const schema = z.object({
  email: z.string().trim().email("Email inválido").max(255),
  password: z.string().min(6, "Mínimo 6 caracteres").max(72),
  name: z.string().trim().min(2, "Nome muito curto").max(60).optional(),
});

const AuthPage = ({ mode }: { mode: "login" | "signup" }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) navigate("/", { replace: true });
  }, [user, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ email, password, name: mode === "signup" ? name : undefined });
    if (!parsed.success) {
      toast.error(parsed.error.errors[0].message);
      return;
    }
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: { display_name: name },
          },
        });
        if (error) throw error;
        toast.success("Conta criada! A entrar...");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Bem-vindo de volta!");
      }
      navigate("/", { replace: true });
    } catch (err: any) {
      const msg = err?.message ?? "Erro";
      if (msg.includes("already registered") || msg.includes("already been registered")) {
        toast.error("Este email já está registado. Faz login.");
      } else if (msg.includes("Invalid login")) {
        toast.error("Email ou palavra-passe incorretos.");
      } else {
        toast.error(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] w-full flex flex-col bg-gradient-to-b from-[#0a0e1a] via-[#0f1730] to-[#0a0e1a] text-white overflow-y-auto">
      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-10 max-w-md mx-auto w-full">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#ff6b35] to-[#f7931e] flex items-center justify-center shadow-2xl shadow-orange-500/40 mb-4">
            <Tv className="w-10 h-10 text-white" strokeWidth={2.5} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            Prisma<span className="text-[#ff6b35]">Fly</span>
          </h1>
          <p className="text-xs text-white/50 mt-1 tracking-wider uppercase">
            Televisão ao Vivo
          </p>
        </div>

        {/* Card */}
        <div className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
          <h2 className="text-xl font-semibold mb-1">
            {mode === "login" ? "Entrar" : "Criar Conta"}
          </h2>
          <p className="text-xs text-white/50 mb-5">
            {mode === "login"
              ? "Acede aos teus canais favoritos"
              : "Junta-te à PrismaFly em segundos"}
          </p>

          <form onSubmit={submit} className="space-y-3">
            {mode === "signup" && (
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="text"
                  placeholder="Nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-3 py-3 text-sm placeholder:text-white/30 focus:outline-none focus:border-[#ff6b35] focus:bg-white/10 transition"
                  required
                />
              </div>
            )}
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-3 py-3 text-sm placeholder:text-white/30 focus:outline-none focus:border-[#ff6b35] focus:bg-white/10 transition"
                required
                autoComplete="email"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type={showPwd ? "text" : "password"}
                placeholder="Palavra-passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-10 py-3 text-sm placeholder:text-white/30 focus:outline-none focus:border-[#ff6b35] focus:bg-white/10 transition"
                required
                autoComplete={mode === "login" ? "current-password" : "new-password"}
              />
              <button
                type="button"
                onClick={() => setShowPwd((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
              >
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-gradient-to-r from-[#ff6b35] to-[#f7931e] text-white font-semibold py-3 rounded-xl shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 active:scale-[0.98] transition disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {mode === "login" ? "Entrar" : "Criar Conta"}
            </button>
          </form>

          <div className="mt-5 text-center text-xs text-white/50">
            {mode === "login" ? (
              <>
                Não tens conta?{" "}
                <Link to="/signup" className="text-[#ff6b35] font-semibold hover:underline">
                  Cria uma
                </Link>
              </>
            ) : (
              <>
                Já tens conta?{" "}
                <Link to="/login" className="text-[#ff6b35] font-semibold hover:underline">
                  Entrar
                </Link>
              </>
            )}
          </div>
        </div>

        <p className="text-[10px] text-white/30 mt-6 text-center px-4">
          Ao continuar, aceitas que o acesso aos canais premium requer um plano ativo.
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
