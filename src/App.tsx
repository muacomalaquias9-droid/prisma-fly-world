import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import BottomNav from "./components/BottomNav";
import Index from "./pages/Index";
import Regions from "./pages/Regions";
import GuidePage from "./pages/GuidePage";
import Servers from "./pages/Servers";
import SettingsPage from "./pages/SettingsPage";
import PlayerPage from "./pages/PlayerPage";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Plans from "./pages/Plans";
import Admin from "./pages/Admin";

const queryClient = new QueryClient();

const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

const Shell = () => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-hidden">
        <Routes>
          <Route path="/login" element={<Auth mode="login" />} />
          <Route path="/signup" element={<Auth mode="signup" />} />
          <Route path="/" element={<RequireAuth><Index /></RequireAuth>} />
          <Route path="/guide" element={<RequireAuth><GuidePage /></RequireAuth>} />
          <Route path="/regions" element={<RequireAuth><Regions /></RequireAuth>} />
          <Route path="/servers" element={<RequireAuth><Servers /></RequireAuth>} />
          <Route path="/settings" element={<RequireAuth><SettingsPage /></RequireAuth>} />
          <Route path="/plans" element={<RequireAuth><Plans /></RequireAuth>} />
          <Route path="/admin" element={<RequireAuth><Admin /></RequireAuth>} />
          <Route path="/player/:channelId" element={<RequireAuth><PlayerPage /></RequireAuth>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      {user && <BottomNav />}
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Shell />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
