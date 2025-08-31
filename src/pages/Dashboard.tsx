
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  Users, 
  Building, 
  Calendar, 
  TrendingUp, 
  Phone, 
  FileText, 
  Brain,
  Shield,
  Settings,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import DashboardNav from "@/components/DashboardNav";
import EnhancedDashboardSimulator from "@/components/simulators/EnhancedDashboardSimulator";
import ExcelExportButton from "@/components/ExcelExportButton";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";


const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();


  return (
    <div className="min-h-screen bg-white/90">
      <DashboardNav />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Inmobiliario</h1>
            <p className="text-gray-600">Gestiona tu negocio inmobiliario de forma inteligente</p>
          </div>
          <div className="flex gap-2">
            <ExcelExportButton />
          </div>
        </div>

        {/* Vista general mejorada */}
        <div className="mb-8">
          <EnhancedDashboardSimulator />
        </div>
      </main>

    </div>
  );
};

export default Dashboard;
