import { useParams, useNavigate } from "react-router-dom";
import { getAllChannels } from "@/data/channels";
import VideoPlayer from "@/components/VideoPlayer";
import { useEffect } from "react";

const PlayerPage = () => {
  const { channelId } = useParams();
  const navigate = useNavigate();
  const channel = getAllChannels().find((c) => c.id === channelId);

  useEffect(() => {
    if (!channel) navigate("/");
  }, [channel, navigate]);

  if (!channel) return null;

  return (
    <div className="h-full w-full">
      <VideoPlayer channel={channel} />
    </div>
  );
};

export default PlayerPage;
