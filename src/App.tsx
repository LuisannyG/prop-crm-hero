import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import NotFound from "./pages/NotFound";
import Contacts from "./pages/Contacts";
import Properties from "./pages/Properties";
import Reminders from "./pages/Reminders";
import LearningEngine from "./pages/LearningEngine";
import RiskDetection from "./pages/RiskDetection";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
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

export default App;
