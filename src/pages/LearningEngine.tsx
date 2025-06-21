
import PaidFeatureAlert from '@/components/PaidFeatureAlert';
import { Button } from '@/components/ui/button';
import { Brain, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LearningEngine = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al Dashboard
          </Button>
        </div>
        
        <PaidFeatureAlert
          title="Motor de Aprendizaje IA"
          description="Potencia tu estrategia inmobiliaria con inteligencia artificial avanzada"
          icon={<Brain className="w-10 h-10 text-white" />}
          previewImage="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80"
          features={[
            'Análisis predictivo de mercado inmobiliario en tiempo real',
            'Recomendaciones personalizadas de precios basadas en IA',
            'Identificación automática de oportunidades de negocio',
            'Análisis de comportamiento de clientes y patrones de compra',
            'Predicción de tendencias del mercado local',
            'Optimización automática de estrategias de marketing',
            'Reportes inteligentes con insights accionables',
            'Integración con bases de datos inmobiliarias nacionales'
          ]}
        />
      </div>
    </div>
  );
};

export default LearningEngine;
