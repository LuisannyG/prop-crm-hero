
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ReportsSimulator from '@/components/simulators/ReportsSimulator';
import DashboardNav from '@/components/DashboardNav';

const AutoReports = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-fixed relative"
      style={{
        backgroundImage: `url('/lovable-uploads/37f332b3-089c-47ec-bafc-0ede8b679343.png')`
      }}
    >
      <div className="absolute inset-0 bg-black/20"></div>
      
      <div className="relative z-10">
        <DashboardNav />

        <main className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <div className="flex items-center gap-4 mb-4">
              <Button
                variant="outline"
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2 bg-white/90 backdrop-blur-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                Volver al Dashboard
              </Button>
            </div>
            
            <h2 className="text-3xl font-bold text-white drop-shadow-lg mb-2">
              Reportes Automáticos
            </h2>
            <p className="text-xl text-white drop-shadow-lg">
              Visualiza estadísticas y métricas de rendimiento en tiempo real
            </p>
          </div>

          <section className="bg-white/95 backdrop-blur-sm rounded-lg shadow-sm p-6">
            <ReportsSimulator />
          </section>
        </main>
      </div>
    </div>
  );
};

export default AutoReports;
