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
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border safe-area-bottom">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
        {tabs.map((tab) => {
          const active = location.pathname === tab.path;
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className="relative flex flex-col items-center gap-1 px-3 py-1.5 active:scale-95 transition-transform"
            >
              {active && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute -top-[1px] left-1/2 -translate-x-1/2 w-8 h-[3px] rounded-full bg-primary"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <tab.icon
                size={20}
                className={active ? "text-primary" : "text-foreground/50"}
                strokeWidth={active ? 2.5 : 2}
              />
              <span
                className={`text-[10px] font-semibold ${
                  active ? "text-primary" : "text-foreground/50"
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
