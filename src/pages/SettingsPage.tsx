import { Monitor, Info, Globe } from "lucide-react";

const SettingsPage = () => {
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
              <p className="text-xs text-muted-foreground">Automático (recomendado)</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Globe size={18} className="text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Idioma</p>
              <p className="text-xs text-muted-foreground">Português</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Info size={18} className="text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Sobre</p>
              <p className="text-xs text-muted-foreground">PrismaFly v1.0.0</p>
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
