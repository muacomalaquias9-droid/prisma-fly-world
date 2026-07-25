import { useLocation, useNavigate } from "react-router-dom";
import Icon from "@mdi/react";
import {
  mdiHomeVariant,
  mdiMagnify,
  mdiTelevisionClassic,
  mdiDownloadCircleOutline,
  mdiAccountCircle,
  mdiCrown,
  mdiServerNetwork,
} from "@mdi/js";
import { useAuth } from "@/hooks/useAuth";
import { useTVMode } from "@/hooks/useTVMode";

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const isTV = useTVMode();

  if (isTV) return null;
  if (location.pathname.startsWith("/player")) return null;
  if (location.pathname === "/login" || location.pathname === "/signup") return null;

  const tabs = isAdmin
    ? [
        { path: "/", label: "Início", icon: mdiHomeVariant },
        { path: "/guide", label: "Guia", icon: mdiTelevisionClassic },
        { path: "/admin", label: "Admin", icon: mdiCrown },
        { path: "/servers", label: "Servidores", icon: mdiServerNetwork },
        { path: "/settings", label: "Perfil", icon: mdiAccountCircle },
      ]
    : [
        { path: "/", label: "Início", icon: mdiHomeVariant },
        { path: "/regions", label: "Novidades", icon: mdiMagnify },
        { path: "/guide", label: "Guia", icon: mdiTelevisionClassic },
        { path: "/servers", label: "Downloads", icon: mdiDownloadCircleOutline },
        { path: "/settings", label: "Perfil", icon: mdiAccountCircle },
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
              <Icon
                path={tab.icon}
                size={0.95}
                className={active ? "text-white" : "text-white/50"}
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
