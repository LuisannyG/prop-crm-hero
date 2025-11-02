
import PaidFeatureAlert from '@/components/PaidFeatureAlert';
import RealLearningEngineSimulator from '@/components/simulators/RealLearningEngineSimulator';
import { Button } from '@/components/ui/button';
import { Brain, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const LearningEngine = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [showPreview, setShowPreview] = useState(false);

  // Por ahora, simulamos que es una función premium pero que funciona
  // En una implementación real, verificarías el plan del usuario aquí
  const isPremiumUser = true; // Cambiar por la lógica real de verificación

  // Registrar apertura del Motor IA
  useEffect(() => {
    const trackMotorIAOpening = async () => {
      if (!showPreview || !user) return;

      try {
        // Obtener trial_group del usuario
        const { data: trialData } = await supabase
          .from('trial_experiment')
          .select('trial_group')
          .eq('email', user.email)
          .maybeSingle();

        const trialGroup = trialData?.trial_group || 'no_trial';

        // Disparar evento a GTM
        if (window.dataLayer) {
          window.dataLayer.push({
            event: 'motor_ia_opened',
            user_email: user.email,
            trial_group: trialGroup
          });
        }

        // Registrar en Supabase
        const { error } = await supabase
          .from('motor_ia_usage')
          .insert({
            user_id: user.id,
            email: user.email || '',
            trial_group: trialGroup
          });

        if (error) {
          console.error('Error registrando apertura del Motor IA:', error);
        }
      } catch (error) {
        console.error('Error en tracking del Motor IA:', error);
      }
    };

    trackMotorIAOpening();
  }, [showPreview, user]);

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
              <Brain className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold">Motor de Aprendizaje IA</h1>
                <p className="text-gray-600">Análisis predictivo basado en tus datos reales</p>
              </div>
            </div>
          </div>
          
          <RealLearningEngineSimulator />
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
              className="flex items-center gap-2 bg-blue-600 text-white"
            >
              <Brain className="w-4 h-4" />
              Abrir Motor IA
            </Button>
          )}
        </div>
        
        <PaidFeatureAlert
          title="Motor de Aprendizaje IA"
          description="Potencia tu estrategia inmobiliaria con inteligencia artificial avanzada"
          icon={<Brain className="w-10 h-10 text-white" />}
          simulatorType="learning-engine"
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
