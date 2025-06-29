
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, TrendingUp, AlertTriangle, Target } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import SalesFunnelChart from './SalesFunnelChart';

const DashboardStats = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalContacts: 0,
    activeContacts: 0,
    lostContacts: 0,
    conversionRate: 0,
    stageDistribution: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      loadStats();
    }
  }, [user?.id]);

  const loadStats = async () => {
    try {
      // Obtener todos los contactos
      const { data: contacts, error } = await supabase
        .from('contacts')
        .select('sales_stage, status')
        .eq('user_id', user.id);

      if (error) throw error;

      // Calcular estadísticas
      const total = contacts.length;
      const active = contacts.filter(c => c.status === 'active').length;
      const lost = contacts.filter(c => c.sales_stage === 'no_compra' || c.status === 'inactive').length;
      const converted = contacts.filter(c => c.sales_stage === 'cliente').length;
      
      // Distribución por etapas
      const stageDistribution = contacts.reduce((acc, contact) => {
        const stage = contact.sales_stage || 'prospecto';
        acc[stage] = (acc[stage] || 0) + 1;
        return acc;
      }, {});

      const stageData = Object.entries(stageDistribution).map(([stage, count]) => ({
        stage,
        count: count as number
      }));

      setStats({
        totalContacts: total,
        activeContacts: active,
        lostContacts: lost,
        conversionRate: total > 0 ? (converted / total) * 100 : 0,
        stageDistribution: stageData
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="animate-pulse">Cargando estadísticas...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Contactos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalContacts}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contactos Activos</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeContacts}</div>
            <Badge variant="outline" className="mt-2">
              {stats.totalContacts > 0 ? ((stats.activeContacts / stats.totalContacts) * 100).toFixed(1) : 0}% del total
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">No Compraron</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.lostContacts}</div>
            <Badge variant="destructive" className="mt-2">
              {stats.totalContacts > 0 ? ((stats.lostContacts / stats.totalContacts) * 100).toFixed(1) : 0}% del total
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasa de Conversión</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.conversionRate.toFixed(1)}%</div>
          </CardContent>
        </Card>
      </div>

      <SalesFunnelChart data={stats.stageDistribution} />
    </div>
  );
};

export default DashboardStats;
