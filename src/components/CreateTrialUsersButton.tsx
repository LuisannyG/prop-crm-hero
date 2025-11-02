import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { UserPlus, Loader2 } from 'lucide-react';

const CreateTrialUsersButton = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleCreateUsers = async () => {
    setLoading(true);
    try {
      console.log('Iniciando creación de usuarios de prueba...');
      
      const { data, error } = await supabase.functions.invoke('create-trial-users', {
        body: {}
      });

      if (error) {
        console.error('Error invocando función:', error);
        toast({
          title: "Error",
          description: error.message || "Error al crear usuarios de prueba",
          variant: "destructive",
        });
        return;
      }

      console.log('Respuesta de función:', data);

      if (data.success) {
        const createdCount = data.results.filter((r: any) => r.status === 'created').length;
        const existingCount = data.results.filter((r: any) => r.status === 'already_exists').length;
        
        toast({
          title: "✅ Usuarios creados exitosamente",
          description: `${createdCount} usuarios nuevos creados. ${existingCount} ya existían.`,
        });
      } else {
        toast({
          title: "Error",
          description: data.error || "Error al crear usuarios",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error inesperado:', error);
      toast({
        title: "Error",
        description: "Error inesperado al crear usuarios de prueba",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleCreateUsers}
      disabled={loading}
      variant="outline"
      className="flex items-center gap-2"
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <UserPlus className="w-4 h-4" />
      )}
      {loading ? 'Creando usuarios...' : 'Crear usuarios de prueba'}
    </Button>
  );
};

export default CreateTrialUsersButton;
