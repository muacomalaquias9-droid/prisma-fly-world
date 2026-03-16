import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Channel } from "@/data/channels";

interface ServerEntry {
  id: string;
  name: string;
  url: string;
  created_at: string;
}

function parseM3U(content: string, serverId: string): Channel[] {
  const lines = content.split("\n").map((l) => l.trim()).filter(Boolean);
  const channels: Channel[] = [];
  let currentName = "";
  let currentLogo = "";
  let idx = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith("#EXTINF")) {
      // Extract name (last comma-separated value)
      const commaIdx = line.lastIndexOf(",");
      currentName = commaIdx > -1 ? line.substring(commaIdx + 1).trim() : `Canal ${idx + 1}`;
      // Clean color tags
      currentName = currentName.replace(/\[COLOR.*?\]/gi, "").replace(/\[\/COLOR\]/gi, "").trim();
      // Extract logo
      const logoMatch = line.match(/tvg-logo="([^"]+)"/i);
      currentLogo = logoMatch ? logoMatch[1] : "";
    } else if (line.startsWith("#")) {
      continue;
    } else if (line.startsWith("http")) {
      // This is a URL
      if (currentName && !currentName.includes("INFORMAÇ") && !currentName.includes("DOAÇÃO") && !currentName.includes("LINK OFF")) {
        channels.push({
          id: `m3u-${serverId}-${idx}`,
          name: currentName || `Canal ${idx + 1}`,
          logo: currentLogo || "https://i.imgur.com/FxYhME9.png",
          url: line,
          country: "Servidor",
          category: "M3U",
        });
        idx++;
      }
      currentName = "";
      currentLogo = "";
    }
  }
  return channels;
}

export function useM3UServers() {
  const [servers, setServers] = useState<ServerEntry[]>([]);
  const [serverChannels, setServerChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch servers from DB
  useEffect(() => {
    const fetchServers = async () => {
      const { data, error } = await supabase
        .from("shared_servers")
        .select("*")
        .order("created_at", { ascending: false });

      if (data) {
        setServers(data);
        // Map each server as a single channel (direct URL play)
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

    // Realtime subscription
    const channel = supabase
      .channel("m3u_servers_realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "shared_servers" },
        (payload) => {
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
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { servers, serverChannels, loading };
}
