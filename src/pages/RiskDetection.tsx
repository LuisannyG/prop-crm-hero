
import PaidFeatureAlert from '@/components/PaidFeatureAlert';
import { Button } from '@/components/ui/button';
import { Shield, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

// Import the actual risk detection component
import RiskDetectionApp from '@/components/RiskDetectionApp';

const RiskDetection = () => {
  const navigate = useNavigate();
  const [showPreview, setShowPreview] = useState(false);

  // Por ahora, simulamos que es una función premium pero que funciona
  // En una implementación real, verificarías el plan del usuario aquí
  const isPremiumUser = true; // Cambiar por la lógica real de verificación

  if (isPremiumUser && showPreview) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="outline"
              onClick={() => setShowPreview(false)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver a Información
            </Button>
          </div>
          
          <div className="bg-white rounded-lg p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-8 h-8 text-red-600" />
              <div>
                <h1 className="text-2xl font-bold">Detección de Riesgo de No Compra</h1>
                <p className="text-gray-600">Sistema de IA para identificar y prevenir la pérdida de clientes</p>
              </div>
            </div>
          </div>
          
          <RiskDetectionApp />
        </div>
      </div>
    );
  }

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
          
          {isPremiumUser && (
            <Button
              onClick={() => setShowPreview(true)}
              className="flex items-center gap-2 bg-red-600 text-white"
            >
              <Shield className="w-4 h-4" />
              Abrir Detector de Riesgo
            </Button>
          )}
        </div>
        
        <PaidFeatureAlert
          title="Detección de Riesgo de No Compra"
          description="Sistema de IA avanzado para identificar y prevenir la pérdida de clientes potenciales"
          icon={<Shield className="w-10 h-10 text-white" />}
          simulatorType="risk-detection"
          features={[
            'Análisis predictivo de comportamiento de clientes con IA',
            'Identificación automática de señales de desinterés',
            'Alertas en tiempo real para clientes en riesgo crítico',
            'Estrategias de recuperación personalizadas por cliente',
            'Puntuación de riesgo basada en múltiples factores',
            'Dashboard con métricas de retención y conversión',
            'Seguimiento automático de acciones de recuperación',
            'Reportes de efectividad de estrategias aplicadas'
          ]}
        />
      </div>
    </div>
  );
};

export default RiskDetection;
