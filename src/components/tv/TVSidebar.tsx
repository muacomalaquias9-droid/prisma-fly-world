import { useNavigate, useLocation } from "react-router-dom";
import Icon from "@mdi/react";
import {
  mdiHomeVariant,
  mdiTelevisionClassic,
  mdiMagnify,
  mdiViewGridOutline,
  mdiServerNetwork,
  mdiAccountCircle,
  mdiCrown,
} from "@mdi/js";
import { useAuth } from "@/hooks/useAuth";

const TVSidebar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { isAdmin } = useAuth();

  const items = [
    { path: "/", label: "Início", icon: mdiHomeVariant },
    { path: "/regions", label: "Regiões", icon: mdiViewGridOutline },
    { path: "/guide", label: "Guia", icon: mdiTelevisionClassic },
    { path: "/servers", label: "Servidores", icon: mdiServerNetwork },
    { path: "/settings", label: "Perfil", icon: mdiAccountCircle },
    ...(isAdmin ? [{ path: "/admin", label: "Admin", icon: mdiCrown }] : []),
  ];

  return (
    <aside className="group/side fixed left-0 top-0 bottom-0 z-40 w-20 hover:w-60 focus-within:w-60 transition-all duration-200 bg-gradient-to-r from-black via-black/95 to-black/40 hover:bg-black hover:bg-none focus-within:bg-black focus-within:bg-none flex flex-col py-8">
      <div className="px-5 mb-10 flex items-center gap-3">
        <span className="font-brand text-primary text-4xl leading-none">P</span>
        <span className="font-brand text-primary text-3xl leading-none opacity-0 group-hover/side:opacity-100 group-focus-within/side:opacity-100 transition-opacity whitespace-nowrap">
          RISMAFLY
        </span>
      </div>

      <button
        data-focusable
        onClick={() => navigate("/regions")}
        className="tv-focusable flex items-center gap-4 px-5 py-3 text-white/70 mb-2"
      >
        <Icon path={mdiMagnify} size={1.2} />
        <span className="text-lg opacity-0 group-hover/side:opacity-100 group-focus-within/side:opacity-100 transition-opacity whitespace-nowrap">
          Procurar
        </span>
      </button>

      {items.map((it) => {
        const active = pathname === it.path;
        return (
          <button
            key={it.path}
            data-focusable
            onClick={() => navigate(it.path)}
            className={`tv-focusable flex items-center gap-4 px-5 py-3 ${
              active ? "text-white" : "text-white/60"
            }`}
          >
            <Icon path={it.icon} size={1.2} />
            <span className="text-lg opacity-0 group-hover/side:opacity-100 group-focus-within/side:opacity-100 transition-opacity whitespace-nowrap">
              {it.label}
            </span>
          </button>
        );
      })}
    </aside>
  );
};

export default TVSidebar;
