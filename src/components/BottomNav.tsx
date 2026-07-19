import { Home, Search, Tv, Download, User, Crown, Link as LinkIcon } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

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
        { path: "/servers", label: "Servidores", icon: LinkIcon },
        { path: "/settings", label: "Perfil", icon: User },
      ]
    : [
        { path: "/", label: "Início", icon: Home },
        { path: "/regions", label: "Novidades", icon: Search },
        { path: "/guide", label: "Guia", icon: Tv },
        { path: "/servers", label: "Downloads", icon: Download },
        { path: "/settings", label: "Perfil", icon: User },
      ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-black/95 backdrop-blur border-t border-white/5 safe-area-bottom">
      <div className="flex items-center justify-around h-14 max-w-lg mx-auto px-1">
        {tabs.map((tab) => {
          const active = location.pathname === tab.path;
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className="flex flex-col items-center gap-0.5 px-3 py-1.5 active:scale-90 transition-transform"
            >
              <tab.icon
                size={22}
                className={active ? "text-white" : "text-white/50"}
                strokeWidth={active ? 2.4 : 1.8}
              />
              <span
                className={`text-[10px] ${active ? "text-white font-semibold" : "text-white/50 font-normal"}`}
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
