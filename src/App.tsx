import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import BottomNav from "./components/BottomNav";
import Index from "./pages/Index";
import Regions from "./pages/Regions";
import GuidePage from "./pages/GuidePage";
import Servers from "./pages/Servers";
import SettingsPage from "./pages/SettingsPage";
import PlayerPage from "./pages/PlayerPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <BrowserRouter>
        <div className="h-full flex flex-col">
          <div className="flex-1 overflow-hidden">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/guide" element={<GuidePage />} />
              <Route path="/regions" element={<Regions />} />
              <Route path="/servers" element={<Servers />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/player/:channelId" element={<PlayerPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
          <BottomNav />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
