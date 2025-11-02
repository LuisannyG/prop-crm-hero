import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { UserPlus, Loader2, RefreshCw } from 'lucide-react';

const CreateTrialUsersButton = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);

  const handleUpdateUsers = async () => {
    setUpdating(true);
    try {
      console.log('Actualizando usuarios de prueba...');
      
      const { data, error } = await supabase.functions.invoke('update-trial-users', {
        body: {}
      });

      if (error) {
        console.error('Error invocando función:', error);
        toast({
          title: "Error",
          description: error.message || "Error al actualizar usuarios",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "✅ Usuarios actualizados",
        description: "Los grupos de prueba han sido actualizados correctamente",
      });
    } catch (error) {
      console.error('Error inesperado:', error);
      toast({
        title: "Error",
        description: "Error inesperado al actualizar usuarios",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

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
    <div className="flex gap-2">
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
      
      <Button
        onClick={handleUpdateUsers}
        disabled={updating}
        variant="outline"
        className="flex items-center gap-2"
      >
        {updating ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <RefreshCw className="w-4 h-4" />
        )}
        {updating ? 'Actualizando...' : 'Actualizar grupos'}
      </Button>
    </div>
  );
};

export default CreateTrialUsersButton;
