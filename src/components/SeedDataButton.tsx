
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { seedDatabase } from '@/utils/seedData';
import { Database, Loader2 } from 'lucide-react';

const SeedDataButton = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSeedData = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "Debes estar autenticado para insertar datos",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      console.log('Iniciando inserción de datos para usuario:', user.id);
      const result = await seedDatabase(user.id);
      
      if (result.success) {
        toast({
          title: "¡Datos insertados exitosamente!",
          description: `Se insertaron ${result.stats?.contacts} contactos, ${result.stats?.properties} propiedades y ${result.stats?.reminders} recordatorios`,
        });
        
        // Recargar la página para mostrar los nuevos datos
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        console.error('Error en seedDatabase:', result.error);
        toast({
          title: "Error",
          description: result.message || "Error al insertar datos",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error inesperado:', error);
      toast({
        title: "Error",
        description: "Error inesperado al insertar datos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleSeedData}
      disabled={loading}
      variant="outline"
      className="flex items-center gap-2"
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Database className="w-4 h-4" />
      )}
      {loading ? 'Insertando datos...' : 'Llenar con datos de Lima'}
    </Button>
  );
};

export default SeedDataButton;
