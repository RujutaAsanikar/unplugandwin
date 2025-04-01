
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AuthProvider } from "@/lib/auth";
import Index from "./pages/Index";
import ChallengePage from "./pages/ChallengePage";
import AdminPage from "./pages/AdminPage";
import RewardsPage from "./pages/RewardsPage";
import HomePage from "./pages/HomePage";
import SurveyPage from "./pages/SurveyPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/challenges" element={<ChallengePage />} />
              <Route path="/rewards" element={<RewardsPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/survey" element={<SurveyPage />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AnimatePresence>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
