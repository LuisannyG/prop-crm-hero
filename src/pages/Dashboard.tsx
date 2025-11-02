
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
import CreateTrialUsersButton from "@/components/CreateTrialUsersButton";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";


const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // 🔐 Tracking de usuarios de prueba para Google Tag Manager
  useEffect(() => {
    const trackTrialUser = async () => {
      if (!user || !user.email) return;

      // ✅ Lista de usuarios de prueba
      const pruebaUsers = [
        "usuario1@gmail.com",
        "usuario2@gmail.com",
        "usuario3@gmail.com",
        "usuario4@gmail.com",
        "usuario5@gmail.com",
        "usuario6@gmail.com"
      ];

      // Verificar si el usuario actual está en la lista de prueba
      if (pruebaUsers.includes(user.email)) {
        try {
          // 🧪 Obtener el grupo de prueba desde Supabase
          const { data, error } = await supabase
            .from('trial_experiment')
            .select('plan_trial')
            .eq('email', user.email)
            .single();

          if (error) {
            console.error('Error obteniendo trial_group:', error);
            return;
          }

          if (data && data.plan_trial) {
            // 📦 Mapear plan_trial a trial_group
            const trialGroupMap: Record<string, string> = {
              '1d': '1-dia',
              '3d': '3-dias'
            };
            
            const trialGroup = trialGroupMap[data.plan_trial] || data.plan_trial;
            
            // 📦 Enviar el evento personalizado al dataLayer de Google Tag Manager
            (window as any).dataLayer = (window as any).dataLayer || [];
            (window as any).dataLayer.push({
              event: "prueba_suscripcion",
              trial_group: trialGroup,
              user_email: user.email
            });

            console.log('✅ Evento GTM enviado:', {
              event: "prueba_suscripcion",
              trial_group: trialGroup
            });
          }
        } catch (err) {
          console.error('Error en tracking de usuario de prueba:', err);
        }
      }
    };

    trackTrialUser();
  }, [user]);


  return (
    <div className="min-h-screen">
      <DashboardNav />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between bg-white/90 backdrop-blur-sm rounded-lg p-6 shadow-lg">
          <div>
            <h1 className="text-3xl font-bold text-primary mb-2">Dashboard Inmobiliario</h1>
            <p className="text-secondary">Gestiona tu negocio inmobiliario de forma inteligente</p>
          </div>
          <div className="flex gap-2">
            <CreateTrialUsersButton />
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
