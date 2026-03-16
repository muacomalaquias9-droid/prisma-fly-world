import { useState } from "react";
import { Plus, Link, Loader2, Tv } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useM3UServers } from "@/hooks/useM3UParser";

const Servers = () => {
  const { servers, loading } = useM3UServers();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const addServer = async () => {
    if (!url.trim()) {
      toast.error("Insira uma URL válida");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("shared_servers").insert({
      name: name.trim() || "Servidor " + (servers.length + 1),
      url: url.trim(),
    });
    if (error) {
      toast.error("Erro ao adicionar servidor");
      console.error(error);
    } else {
      toast.success("Servidor adicionado para todos os usuários!");
      setName("");
      setUrl("");
      setShowForm(false);
    }
    setSubmitting(false);
  };

  return (
    <div className="h-full flex flex-col bg-background">
      <header className="flex-shrink-0 px-4 pt-4 pb-2 flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-xl text-foreground">Servidores</h1>
          <p className="text-xs text-muted-foreground">URLs M3U compartilhadas em nuvem</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-lg active:scale-90 transition-transform"
        >
          <Plus size={20} />
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
            <div className="bg-card border border-border rounded-2xl p-4 mb-4 space-y-3">
              <input
                type="text"
                placeholder="Nome (opcional)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <input
                type="url"
                placeholder="URL do servidor ou M3U"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <button
                onClick={addServer}
                disabled={submitting}
                className="w-full py-3 bg-primary text-primary-foreground rounded-xl text-sm font-semibold flex items-center justify-center gap-2 active:scale-95 transition-transform disabled:opacity-50"
              >
                {submitting ? <Loader2 size={16} className="animate-spin" /> : null}
                Adicionar para Todos
              </button>
              <p className="text-[10px] text-muted-foreground text-center">
                ⚡ Servidores ficam salvos na nuvem e aparecem para todos os usuários
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 overflow-y-auto scrollbar-hide px-4 pb-20">
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <Loader2 size={24} className="text-primary animate-spin" />
          </div>
        ) : servers.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="w-16 h-16 rounded-full bg-card flex items-center justify-center mb-3 border border-border">
              <Link size={24} className="text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">Nenhum servidor adicionado</p>
            <p className="text-xs text-muted-foreground mt-1">
              Toque no + para adicionar uma URL M3U
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {servers.map((server) => (
              <motion.div
                key={server.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card border border-border rounded-2xl p-3.5 flex items-center gap-3 active:scale-[0.98] transition-transform"
              >
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Tv size={18} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{server.name}</p>
                  <p className="text-[10px] text-muted-foreground truncate">{server.url}</p>
                </div>
                <div className="flex items-center gap-1 bg-green-500/10 px-2 py-1 rounded-full flex-shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  <span className="text-green-600 text-[9px] font-semibold">Ativo</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Servers;
