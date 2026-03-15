import { Home, Globe, Link, Settings, Tv } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const tabs = [
  { path: "/", label: "Início", icon: Home },
  { path: "/guide", label: "Guia", icon: Tv },
  { path: "/regions", label: "Regiões", icon: Globe },
  { path: "/servers", label: "Servidores", icon: Link },
  { path: "/settings", label: "Ajustes", icon: Settings },
];

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  if (location.pathname.startsWith("/player")) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-2xl border-t border-border/50 safe-area-bottom">
      <div className="flex items-center justify-around h-14 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const active = location.pathname === tab.path;
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className="relative flex flex-col items-center gap-0.5 px-4 py-1.5 active:scale-90 transition-transform"
            >
              {active && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full bg-primary"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <tab.icon
                size={18}
                className={active ? "text-primary" : "text-muted-foreground"}
                strokeWidth={active ? 2.5 : 1.5}
              />
              <span
                className={`text-[9px] font-medium ${
                  active ? "text-primary font-semibold" : "text-muted-foreground"
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
