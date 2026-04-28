import { Home, Globe, Link, Settings, Tv, Crown } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";

const baseTabs = [
  { path: "/", label: "Início", icon: Home },
  { path: "/guide", label: "Guia", icon: Tv },
  { path: "/regions", label: "Regiões", icon: Globe },
  { path: "/servers", label: "Servidores", icon: Link },
  { path: "/settings", label: "Ajustes", icon: Settings },
];

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  if (location.pathname.startsWith("/player")) return null;
  if (location.pathname === "/login" || location.pathname === "/signup") return null;

  const tabs = isAdmin
    ? [
        { path: "/", label: "Início", icon: Home },
        { path: "/guide", label: "Guia", icon: Tv },
        { path: "/admin", label: "Admin", icon: Crown },
        { path: "/servers", label: "Servidores", icon: Link },
        { path: "/settings", label: "Ajustes", icon: Settings },
      ]
    : baseTabs;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t-2 border-double border-foreground/70 safe-area-bottom">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const active = location.pathname === tab.path;
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className="relative flex flex-col items-center gap-1 px-3 py-1.5 active:translate-y-[1px] transition-transform"
            >
              {active && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <tab.icon
                size={18}
                className={active ? "text-primary" : "text-foreground/60"}
                strokeWidth={active ? 2.5 : 1.75}
              />
              <span
                className={`text-[8px] ink-stamp ${
                  active ? "text-primary font-bold" : "text-foreground/60"
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
