import { useState } from "react";
import { Plus, Link, Trash2, Play, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface ServerEntry {
  id: string;
  name: string;
  url: string;
}

const Servers = () => {
  const [servers, setServers] = useState<ServerEntry[]>(() => {
    const saved = localStorage.getItem("prismafly-servers");
    return saved ? JSON.parse(saved) : [];
  });
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");

  const saveServers = (list: ServerEntry[]) => {
    setServers(list);
    localStorage.setItem("prismafly-servers", JSON.stringify(list));
  };

  const addServer = () => {
    if (!url.trim()) {
      toast.error("Insira uma URL válida");
      return;
    }
    const entry: ServerEntry = {
      id: Date.now().toString(),
      name: name.trim() || "Servidor " + (servers.length + 1),
      url: url.trim(),
    };
    saveServers([...servers, entry]);
    setName("");
    setUrl("");
    setShowForm(false);
    toast.success("Servidor adicionado!");
  };

  const removeServer = (id: string) => {
    saveServers(servers.filter((s) => s.id !== id));
    toast.info("Servidor removido");
  };

  return (
    <div className="h-full flex flex-col">
      <header className="flex-shrink-0 px-4 pt-4 pb-2 flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-xl text-foreground">Servidores</h1>
          <p className="text-xs text-muted-foreground">Adicione URLs ou M3U</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground"
        >
          <Plus size={18} />
        </button>
      </header>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden px-4"
          >
            <div className="bg-card border border-border rounded-xl p-4 mb-4 space-y-3">
              <input
                type="text"
                placeholder="Nome (opcional)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <input
                type="url"
                placeholder="URL do servidor ou M3U"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <button
                onClick={addServer}
                className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold"
              >
                Adicionar
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 overflow-y-auto scrollbar-hide px-4 pb-20">
        {servers.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="w-16 h-16 rounded-full bg-card flex items-center justify-center mb-3">
              <Link size={24} className="text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">Nenhum servidor adicionado</p>
            <p className="text-xs text-muted-foreground mt-1">
              Toque no + para adicionar uma URL
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {servers.map((server) => (
              <motion.div
                key={server.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-card border border-border rounded-xl p-3 flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Play size={16} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{server.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{server.url}</p>
                </div>
                <button onClick={() => removeServer(server.id)} className="text-muted-foreground hover:text-destructive">
                  <Trash2 size={16} />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Servers;
