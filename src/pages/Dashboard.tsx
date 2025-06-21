
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
  AlertCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import DashboardNav from "@/components/DashboardNav";
import EnhancedDashboardSimulator from "@/components/simulators/EnhancedDashboardSimulator";
import NoPurchaseReasonModal from "@/components/NoPurchaseReasonModal";
import SeedDataButton from "@/components/SeedDataButton";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface Contact {
  id: string;
  full_name: string;
}

interface Property {
  id: string;
  title: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchContactsAndProperties = async () => {
      if (!user) return;

      // Fetch contacts
      const { data: contactsData } = await supabase
        .from('contacts')
        .select('id, full_name')
        .eq('user_id', user.id);

      // Fetch properties
      const { data: propertiesData } = await supabase
        .from('properties')
        .select('id, title')
        .eq('user_id', user.id);

      setContacts(contactsData || []);
      setProperties(propertiesData || []);
    };

    fetchContactsAndProperties();
  }, [user]);

  const handleReasonAdded = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Inmobiliario</h1>
            <p className="text-gray-600">Gestiona tu negocio inmobiliario de forma inteligente</p>
          </div>
          <div className="flex gap-2">
            <NoPurchaseReasonModal 
              contacts={contacts}
              properties={properties}
              onReasonAdded={handleReasonAdded}
            />
            <SeedDataButton />
          </div>
        </div>

        {/* Vista general mejorada */}
        <div className="mb-8">
          <EnhancedDashboardSimulator key={refreshKey} />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
