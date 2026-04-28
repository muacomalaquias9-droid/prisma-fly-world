import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session, User } from "@supabase/supabase-js";

interface ActivePlan {
  id: string;
  plan_name: string;
  expires_at: string;
  duration_days: number;
}

interface AuthCtx {
  session: Session | null;
  user: User | null;
  isAdmin: boolean;
  activePlan: ActivePlan | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
}

const Ctx = createContext<AuthCtx | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activePlan, setActivePlan] = useState<ActivePlan | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async (uid: string) => {
    const [{ data: roleData }, { data: subData }] = await Promise.all([
      supabase.from("user_roles").select("role").eq("user_id", uid).eq("role", "admin").maybeSingle(),
      supabase
        .from("subscriptions")
        .select("id, expires_at, plans(name, duration_days)")
        .eq("user_id", uid)
        .eq("status", "active")
        .gt("expires_at", new Date().toISOString())
        .order("expires_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
    ]);
    setIsAdmin(!!roleData);
    if (subData && (subData as any).plans) {
      setActivePlan({
        id: subData.id,
        plan_name: (subData as any).plans.name,
        duration_days: (subData as any).plans.duration_days,
        expires_at: subData.expires_at,
      });
    } else {
      setActivePlan(null);
    }
  };

  const refresh = async () => {
    if (user) await fetchUserData(user.id);
  };

  useEffect(() => {
    // Listener PRIMEIRO
    const { data: sub } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess);
      setUser(sess?.user ?? null);
      if (sess?.user) {
        setTimeout(() => fetchUserData(sess.user.id), 0);
      } else {
        setIsAdmin(false);
        setActivePlan(null);
      }
    });

    // Depois lê sessão atual
    supabase.auth.getSession().then(({ data: { session: sess } }) => {
      setSession(sess);
      setUser(sess?.user ?? null);
      if (sess?.user) fetchUserData(sess.user.id).finally(() => setLoading(false));
      else setLoading(false);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
    setIsAdmin(false);
    setActivePlan(null);
  };

  return (
    <Ctx.Provider value={{ session, user, isAdmin, activePlan, loading, signOut, refresh }}>
      {children}
    </Ctx.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

// IDs dos canais grátis (acesso sem plano)
export const FREE_CHANNEL_IDS = new Set<string>([
  "ao-1",   // TV Zimbo
  "ao-12",  // TPA Internacional
  "pt-1",   // primeiro de Portugal (RTP)
]);

export const isChannelFree = (id: string) => FREE_CHANNEL_IDS.has(id);
