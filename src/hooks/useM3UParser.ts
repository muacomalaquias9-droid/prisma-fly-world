import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Channel } from "@/data/channels";

interface ServerEntry {
  id: string;
  name: string;
  url: string;
  created_at: string;
}

export function useM3UServers() {
  const [servers, setServers] = useState<ServerEntry[]>([]);
  const [serverChannels, setServerChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);

  const deleteServer = async (id: string) => {
    const { error } = await supabase
      .from("shared_servers")
      .delete()
      .eq("id", id);
    if (!error) {
      setServers((prev) => prev.filter((s) => s.id !== id));
      setServerChannels((prev) => prev.filter((c) => !c.id.includes(id)));
    }
    return !error;
  };

  useEffect(() => {
    const fetchServers = async () => {
      const { data, error } = await supabase
        .from("shared_servers")
        .select("*")
        .order("created_at", { ascending: false });

      if (data) {
        setServers(data);
        const mapped: Channel[] = data.map((s: any, i: number) => ({
          id: `srv-${s.id}`,
          name: s.name,
          logo: "https://i.imgur.com/FxYhME9.png",
          url: s.url,
          country: "Servidor",
          category: "M3U",
          popular: i < 3,
        }));
        setServerChannels(mapped);
      }
      if (error) console.error(error);
      setLoading(false);
    };
    fetchServers();

    const channel = supabase
      .channel("m3u_servers_realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "shared_servers" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            const s = payload.new as any;
            setServers((prev) => [s, ...prev]);
            setServerChannels((prev) => [
              {
                id: `srv-${s.id}`,
                name: s.name,
                logo: "https://i.imgur.com/FxYhME9.png",
                url: s.url,
                country: "Servidor",
                category: "M3U",
                popular: true,
              },
              ...prev,
            ]);
          } else if (payload.eventType === "DELETE") {
            const old = payload.old as any;
            setServers((prev) => prev.filter((s) => s.id !== old.id));
            setServerChannels((prev) => prev.filter((c) => c.id !== `srv-${old.id}`));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { servers, serverChannels, loading, deleteServer };
}
