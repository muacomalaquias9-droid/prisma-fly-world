import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Tv, Mail, Lock, User as UserIcon, Loader2, Eye, EyeOff, ArrowRight } from "lucide-react";
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
    <div className="min-h-[100dvh] w-full flex flex-col bg-background text-foreground overflow-y-auto safe-area-top">
      <div className="flex-1 flex flex-col px-6 pt-14 pb-8 max-w-md mx-auto w-full">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/25 mb-4">
            <Tv className="w-8 h-8 text-primary-foreground" strokeWidth={2.5} />
          </div>
          <h1 className="text-3xl font-display font-bold tracking-tight text-foreground">
            Prisma<span className="text-primary">Fly</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-1">Televisão ao vivo</p>
        </div>

        {/* Title */}
        <div className="mb-6">
          <h2 className="text-2xl font-display font-bold text-foreground">
            {mode === "login" ? "Bem-vindo de volta 👋" : "Criar conta"}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {mode === "login"
              ? "Entra para veres os teus canais."
              : "Regista-te em poucos segundos."}
          </p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          {mode === "signup" && (
            <Field icon={<UserIcon size={16} />} label="Nome">
              <input
                type="text"
                placeholder="O teu nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
                required
              />
            </Field>
          )}
          <Field icon={<Mail size={16} />} label="Email">
            <input
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
              required
              autoComplete="email"
            />
          </Field>
          <Field icon={<Lock size={16} />} label="Palavra-passe">
            <input
              type={showPwd ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
              required
              autoComplete={mode === "login" ? "current-password" : "new-password"}
            />
            <button
              type="button"
              onClick={() => setShowPwd((v) => !v)}
              className="text-muted-foreground hover:text-foreground"
            >
              {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </Field>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-primary text-primary-foreground font-semibold py-4 rounded-2xl shadow-lg shadow-primary/25 active:scale-[0.98] transition disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>
              {mode === "login" ? "Entrar" : "Criar conta"}
              <ArrowRight size={16} />
            </>}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          {mode === "login" ? (
            <>
              Não tens conta?{" "}
              <Link to="/signup" className="text-primary font-semibold">
                Cria uma
              </Link>
            </>
          ) : (
            <>
              Já tens conta?{" "}
              <Link to="/login" className="text-primary font-semibold">
                Entrar
              </Link>
            </>
          )}
        </div>

        <p className="text-[11px] text-muted-foreground/70 mt-8 text-center px-4">
          Ao continuar aceitas que o acesso a canais premium requer um plano ativo.
        </p>
      </div>
    </div>
  );
};

const Field = ({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) => (
  <label className="block">
    <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider ml-1">
      {label}
    </span>
    <div className="mt-1 flex items-center gap-3 bg-secondary border border-border rounded-2xl px-4 py-3.5 focus-within:border-primary focus-within:bg-background transition">
      <span className="text-muted-foreground">{icon}</span>
      {children}
    </div>
  </label>
);

export default AuthPage;
