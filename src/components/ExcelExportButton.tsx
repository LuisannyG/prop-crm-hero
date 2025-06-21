
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Download, Loader2 } from 'lucide-react';

const ExcelExportButton = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleExportData = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "Debes estar autenticado para descargar datos",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Fetch all data
      const [contactsRes, propertiesRes, remindersRes, salesFunnelRes, noPurchaseRes, metricsRes] = await Promise.all([
        supabase.from('contacts').select('*').eq('user_id', user.id),
        supabase.from('properties').select('*').eq('user_id', user.id),
        supabase.from('reminders').select('*').eq('user_id', user.id),
        supabase.from('sales_funnel').select('*').eq('user_id', user.id),
        supabase.from('no_purchase_reasons').select('*').eq('user_id', user.id),
        supabase.from('performance_metrics').select('*').eq('user_id', user.id)
      ]);

      // Create CSV content for each table
      const createCSV = (data: any[], headers: string[]) => {
        if (!data || data.length === 0) return '';
        
        const csvHeaders = headers.join(',');
        const csvRows = data.map(row => 
          headers.map(header => {
            const value = row[header];
            // Escape commas and quotes in CSV
            if (value === null || value === undefined) return '';
            const stringValue = String(value);
            if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
              return `"${stringValue.replace(/"/g, '""')}"`;
            }
            return stringValue;
          }).join(',')
        );
        
        return [csvHeaders, ...csvRows].join('\n');
      };

      // Create workbook content
      let workbookContent = '';

      // Contacts sheet
      if (contactsRes.data && contactsRes.data.length > 0) {
        workbookContent += 'CONTACTOS\n';
        workbookContent += createCSV(contactsRes.data, ['full_name', 'email', 'phone', 'client_type', 'status', 'address', 'district', 'acquisition_source', 'notes', 'created_at']);
        workbookContent += '\n\n';
      }

      // Properties sheet
      if (propertiesRes.data && propertiesRes.data.length > 0) {
        workbookContent += 'PROPIEDADES\n';
        workbookContent += createCSV(propertiesRes.data, ['title', 'property_type', 'price', 'bedrooms', 'bathrooms', 'area_m2', 'address', 'status', 'description', 'created_at']);
        workbookContent += '\n\n';
      }

      // Reminders sheet
      if (remindersRes.data && remindersRes.data.length > 0) {
        workbookContent += 'RECORDATORIOS\n';
        workbookContent += createCSV(remindersRes.data, ['title', 'description', 'priority', 'status', 'reminder_date', 'created_at']);
        workbookContent += '\n\n';
      }

      // Sales funnel sheet
      if (salesFunnelRes.data && salesFunnelRes.data.length > 0) {
        workbookContent += 'EMBUDO DE VENTAS\n';
        workbookContent += createCSV(salesFunnelRes.data, ['contact_id', 'stage', 'stage_date', 'notes', 'created_at']);
        workbookContent += '\n\n';
      }

      // No purchase reasons sheet
      if (noPurchaseRes.data && noPurchaseRes.data.length > 0) {
        workbookContent += 'MOTIVOS DE NO COMPRA\n';
        workbookContent += createCSV(noPurchaseRes.data, ['contact_id', 'property_id', 'reason_category', 'reason_details', 'price_feedback', 'will_reconsider', 'follow_up_date', 'notes', 'created_at']);
        workbookContent += '\n\n';
      }

      // Performance metrics sheet
      if (metricsRes.data && metricsRes.data.length > 0) {
        workbookContent += 'MÉTRICAS DE RENDIMIENTO\n';
        workbookContent += createCSV(metricsRes.data, ['metric_type', 'metric_value', 'metric_date', 'channel', 'team_member_id', 'created_at']);
        workbookContent += '\n\n';
      }

      if (!workbookContent.trim()) {
        toast({
          title: "Sin datos",
          description: "No hay datos para exportar",
          variant: "destructive",
        });
        return;
      }

      // Create and download file
      const blob = new Blob([workbookContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `datos_inmobiliarios_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "¡Exportación exitosa!",
        description: "Los datos se han descargado en formato CSV",
      });
    } catch (error) {
      console.error('Error exporting data:', error);
      toast({
        title: "Error",
        description: "Error al exportar los datos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleExportData}
      disabled={loading}
      variant="outline"
      className="flex items-center gap-2"
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Download className="w-4 h-4" />
      )}
      {loading ? 'Exportando...' : 'Descargar Excel'}
    </Button>
  );
};

export default ExcelExportButton;
