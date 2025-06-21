
import PaidFeatureAlert from '@/components/PaidFeatureAlert';
import { Button } from '@/components/ui/button';
import { Shield, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RiskDetection = () => {
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
          title="Detección de Riesgo de No Compra"
          description="Identifica y previene la pérdida de clientes antes de que sea tarde"
          icon={<Shield className="w-10 h-10 text-white" />}
          simulatorType="risk-detection"
          features={[
            'Algoritmo predictivo que identifica clientes en riesgo de cancelar',
            'Alertas automáticas cuando un cliente muestra señales de desinterés',
            'Análisis de patrones de comunicación y engagement',
            'Recomendaciones específicas para retener cada cliente',
            'Scoring de probabilidad de compra en tiempo real',
            'Seguimiento de indicadores tempranos de abandono',
            'Estrategias personalizadas de recuperación de clientes',
            'Dashboard con métricas de retención y conversión'
          ]}
        />
      </div>
    </div>
  );
};

export default RiskDetection;
