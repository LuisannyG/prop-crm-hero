
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
      const result = await seedDatabase(user.id);
      
      if (result.success) {
        toast({
          title: "¡Datos insertados exitosamente!",
          description: `Se insertaron ${result.stats?.contacts} contactos, ${result.stats?.properties} propiedades y ${result.stats?.reminders} recordatorios`,
        });
      } else {
        toast({
          title: "Error",
          description: result.message || "Error al insertar datos",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error:', error);
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
