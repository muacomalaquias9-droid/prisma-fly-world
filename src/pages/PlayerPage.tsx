import { useParams, useNavigate } from "react-router-dom";
import { getAllChannels } from "@/data/channels";
import { supabase } from "@/integrations/supabase/client";
import VideoPlayer from "@/components/VideoPlayer";
import PlanGate from "@/components/PlanGate";
import { useAuth, isChannelFree } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import type { Channel } from "@/data/channels";

const PlayerPage = () => {
  const { channelId } = useParams();
  const navigate = useNavigate();
  const { activePlan, isAdmin } = useAuth();
  const [channel, setChannel] = useState<Channel | null>(null);

  useEffect(() => {
    const staticChannel = getAllChannels().find((c) => c.id === channelId);
    if (staticChannel) {
      setChannel(staticChannel);
      return;
    }
    if (channelId?.startsWith("srv-")) {
      const uuid = channelId.replace("srv-", "");
      supabase
        .from("shared_servers")
        .select("*")
        .eq("id", uuid)
        .single()
        .then(({ data }) => {
          if (data) {
            setChannel({
              id: channelId,
              name: data.name,
              logo: "https://i.imgur.com/FxYhME9.png",
              url: data.url,
              country: "Servidor",
              category: "M3U",
            });
          } else {
            navigate("/");
          }
        });
    } else {
      navigate("/");
    }
  }, [channelId, navigate]);

  if (!channel) return null;

  // Verificação de plano: admin sempre passa, canais grátis passam, resto exige plano
  const allowed = isAdmin || activePlan || isChannelFree(channel.id);
  if (!allowed) return <PlanGate channelName={channel.name} />;

  return (
    <div className="h-full w-full">
      <VideoPlayer channel={channel} />
    </div>
  );
};

export default PlayerPage;
