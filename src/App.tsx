import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";
import ScrollToTop from "./components/ScrollToTop";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { SiteContentProvider } from "@/contexts/SiteContentContext";
import { VideoControlProvider } from "@/contexts/VideoControlContext";
import { AppErrorBoundary } from "@/components/AppErrorBoundary";

const queryClient = new QueryClient();

const AppContent = () => (
  <>
    <Toaster />
    <Sonner />
    <Routes>
      <Route path="/" element={<Navigate to="/en" replace />} />
      <Route path="/en" element={<Index />} />
      <Route path="/hb" element={<Index />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AppErrorBoundary>
          <LanguageProvider>
            <SiteContentProvider>
              <VideoControlProvider>
                <ScrollToTop />
                <AppContent />
              </VideoControlProvider>
            </SiteContentProvider>
          </LanguageProvider>
        </AppErrorBoundary>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
