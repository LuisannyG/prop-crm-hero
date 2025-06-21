
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import PrivateRoute from "@/components/PrivateRoute";
import Index from "./pages/Index";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Contacts from "./pages/Contacts";
import Properties from "./pages/Properties";
import Reminders from "./pages/Reminders";
import SmartAgenda from "./pages/SmartAgenda";
import PurchaseReasons from "./pages/PurchaseReasons";
import AutoReports from "./pages/AutoReports";
import LearningEngine from "./pages/LearningEngine";
import RiskDetection from "./pages/RiskDetection";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <AuthProvider>
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/landing" element={<Landing />} />
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/contacts"
                element={
                  <PrivateRoute>
                    <Contacts />
                  </PrivateRoute>
                }
              />
              <Route
                path="/properties"
                element={
                  <PrivateRoute>
                    <Properties />
                  </PrivateRoute>
                }
              />
              <Route
                path="/reminders"
                element={
                  <PrivateRoute>
                    <Reminders />
                  </PrivateRoute>
                }
              />
              <Route
                path="/smart-agenda"
                element={
                  <PrivateRoute>
                    <SmartAgenda />
                  </PrivateRoute>
                }
              />
              <Route
                path="/purchase-reasons"
                element={
                  <PrivateRoute>
                    <PurchaseReasons />
                  </PrivateRoute>
                }
              />
              <Route
                path="/auto-reports"
                element={
                  <PrivateRoute>
                    <AutoReports />
                  </PrivateRoute>
                }
              />
              <Route
                path="/learning-engine"
                element={
                  <PrivateRoute>
                    <LearningEngine />
                  </PrivateRoute>
                }
              />
              <Route
                path="/risk-detection"
                element={
                  <PrivateRoute>
                    <RiskDetection />
                  </PrivateRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
