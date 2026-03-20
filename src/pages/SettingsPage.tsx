import { useState, useEffect } from "react";
import { Monitor, Info, Globe, Check } from "lucide-react";

const APP_LANGUAGES = [
  { code: "pt", label: "Português", flag: "https://flagcdn.com/w20/br.png" },
  { code: "en", label: "English", flag: "https://flagcdn.com/w20/us.png" },
  { code: "fr", label: "Français", flag: "https://flagcdn.com/w20/fr.png" },
  { code: "es", label: "Español", flag: "https://flagcdn.com/w20/es.png" },
  { code: "ar", label: "العربية", flag: "https://flagcdn.com/w20/sa.png" },
  { code: "zh", label: "中文", flag: "https://flagcdn.com/w20/cn.png" },
  { code: "de", label: "Deutsch", flag: "https://flagcdn.com/w20/de.png" },
  { code: "sw", label: "Kiswahili", flag: "https://flagcdn.com/w20/ke.png" },
  { code: "ko", label: "한국어", flag: "https://flagcdn.com/w20/kr.png" },
  { code: "ja", label: "日本語", flag: "https://flagcdn.com/w20/jp.png" },
  { code: "hi", label: "हिन्दी", flag: "https://flagcdn.com/w20/in.png" },
  { code: "ru", label: "Русский", flag: "https://flagcdn.com/w20/ru.png" },
  { code: "it", label: "Italiano", flag: "https://flagcdn.com/w20/it.png" },
  { code: "tr", label: "Türkçe", flag: "https://flagcdn.com/w20/tr.png" },
];

const getCookie = (name: string) => {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
};

const setCookie = (name: string, val: string, days = 365) => {
  const d = new Date();
  d.setTime(d.getTime() + days * 86400000);
  document.cookie = `${name}=${encodeURIComponent(val)};expires=${d.toUTCString()};path=/;SameSite=Lax`;
};

const SettingsPage = () => {
  const [showLangs, setShowLangs] = useState(false);
  const [lang, setLang] = useState(() => {
    return getCookie("prismafly_lang") || localStorage.getItem("prismafly_lang") || "pt";
  });

  useEffect(() => {
    setCookie("prismafly_lang", lang);
    localStorage.setItem("prismafly_lang", lang);
  }, [lang]);

  const currentLang = APP_LANGUAGES.find((l) => l.code === lang) || APP_LANGUAGES[0];

  return (
    <div className="h-full flex flex-col">
      <header className="flex-shrink-0 px-4 pt-4 pb-2">
        <h1 className="font-display font-bold text-xl text-foreground">Ajustes</h1>
      </header>

      <main className="flex-1 overflow-y-auto scrollbar-hide px-4 pb-20 pt-2">
        <div className="bg-card border border-border rounded-xl overflow-hidden divide-y divide-border">
          <div className="flex items-center gap-3 p-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Monitor size={18} className="text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Qualidade de Vídeo</p>
              <p className="text-xs text-muted-foreground">Auto · até 8K Ultra HD</p>
            </div>
          </div>

          <button
            onClick={() => setShowLangs(!showLangs)}
            className="flex items-center gap-3 p-4 w-full text-left active:bg-muted/30 transition-colors"
          >
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Globe size={18} className="text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">Idioma</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <img src={currentLang.flag} alt="" className="w-4 h-3 rounded-sm object-cover" />
                <p className="text-xs text-muted-foreground">{currentLang.label}</p>
              </div>
            </div>
          </button>

          {showLangs && (
            <div className="bg-muted/20 max-h-60 overflow-y-auto">
              {APP_LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  onClick={() => { setLang(l.code); setShowLangs(false); }}
                  className={`flex items-center gap-3 px-6 py-2.5 w-full text-left active:scale-95 transition-transform ${
                    lang === l.code ? "bg-primary/10" : ""
                  }`}
                >
                  <img src={l.flag} alt="" className="w-5 h-3.5 rounded-sm object-cover" />
                  <span className="text-sm text-foreground flex-1">{l.label}</span>
                  {lang === l.code && <Check size={16} className="text-primary" />}
                </button>
              ))}
            </div>
          )}

          <div className="flex items-center gap-3 p-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Info size={18} className="text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Sobre</p>
              <p className="text-xs text-muted-foreground">PrismaFly v2.6.1</p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="font-display font-bold text-lg text-foreground">
            Prisma<span className="text-primary">Fly</span>
          </p>
          <p className="text-xs text-muted-foreground mt-1">TV ao vivo, sem fronteiras</p>
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;
