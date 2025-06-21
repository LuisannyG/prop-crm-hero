
import PaidFeatureAlert from '@/components/PaidFeatureAlert';
import { Shield } from 'lucide-react';

const RiskDetection = () => {
  return (
    <PaidFeatureAlert
      title="Detección de Riesgo de No Compra"
      description="Identifica y previene la pérdida de clientes antes de que sea tarde"
      icon={<Shield className="w-10 h-10 text-white" />}
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
  );
};

export default RiskDetection;
