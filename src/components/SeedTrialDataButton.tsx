import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { DatabaseZap, Loader2 } from 'lucide-react';

const SeedTrialDataButton = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSeed = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('seed-trial-data', { body: {} });
      if (error) {
        console.error('Error invocando seed-trial-data:', error);
        toast({ title: 'Error', description: error.message || 'No se pudo sembrar datos', variant: 'destructive' });
        return;
      }
      if (data?.success) {
        const totalContacts = data.results?.reduce((a: number, r: any) => a + (r.contacts || 0), 0) || 0;
        const totalProperties = data.results?.reduce((a: number, r: any) => a + (r.properties || 0), 0) || 0;
        const totalReminders = data.results?.reduce((a: number, r: any) => a + (r.reminders || 0), 0) || 0;
        toast({ title: 'Datos sembrados', description: `Contactos: ${totalContacts}, Propiedades: ${totalProperties}, Recordatorios: ${totalReminders}` });
      } else {
        toast({ title: 'Error', description: data?.error || 'No se pudo sembrar datos', variant: 'destructive' });
      }
    } catch (err: any) {
      console.error('Error inesperado:', err);
      toast({ title: 'Error', description: 'Error inesperado al sembrar datos', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleSeed} disabled={loading} variant="outline" className="flex items-center gap-2">
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <DatabaseZap className="w-4 h-4" />}
      {loading ? 'Sembrando datos...' : 'Sembrar datos usuarios prueba'}
    </Button>
  );
};

export default SeedTrialDataButton;