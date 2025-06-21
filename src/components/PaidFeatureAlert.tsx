
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, Star, TrendingUp, Zap } from 'lucide-react';

interface PaidFeatureAlertProps {
  title: string;
  description: string;
  features: string[];
  icon?: React.ReactNode;
  previewImage?: string;
}

const PaidFeatureAlert = ({ title, description, features, icon, previewImage }: PaidFeatureAlertProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 flex items-center justify-center">
      <Card className="max-w-4xl w-full border-2 border-gradient-to-r from-blue-500 to-purple-600 shadow-2xl">
        <CardContent className="p-8">
          {/* Preview Image Section */}
          {previewImage && (
            <div className="mb-8">
              <img 
                src={previewImage} 
                alt={`Vista previa de ${title}`}
                className="w-full h-64 object-cover rounded-lg shadow-lg"
              />
              <div className="text-center mt-4">
                <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                  ✨ Vista previa de la funcionalidad
                </span>
              </div>
            </div>
          )}

          <div className="text-center mb-6">
            <div className="mx-auto w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
              {icon || <Lock className="w-10 h-10 text-white" />}
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
            <p className="text-lg text-gray-600">{description}</p>
          </div>

          <div className="bg-white rounded-lg p-6 mb-6 border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center justify-center">
              <Star className="w-5 h-5 text-yellow-500 mr-2" />
              Características Premium
            </h3>
            <ul className="space-y-3 text-left">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center text-gray-700">
                  <Zap className="w-4 h-4 text-blue-500 mr-3 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg p-6 mb-6">
            <h3 className="text-xl font-bold mb-2">🚀 ¡Impulsa tu negocio inmobiliario!</h3>
            <p className="text-blue-100 mb-4">
              Únete a más de 1,000+ agentes que ya están aumentando sus ventas con Proptor Premium
            </p>
            <div className="flex items-center justify-center space-x-4 text-sm">
              <div className="flex items-center">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span>+40% más ventas</span>
              </div>
              <div className="text-blue-200">•</div>
              <div className="flex items-center">
                <Star className="w-4 h-4 mr-1" />
                <span>Soporte 24/7</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Button 
              size="lg" 
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-4 px-8 text-lg shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              🔥 Actualizar a Premium - Solo S/60/mes
            </Button>
            
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-2">
                ✅ 7 días de prueba gratis • ✅ Sin compromiso • ✅ Cancela cuando quieras
              </p>
              <Button variant="outline" className="text-blue-600 border-blue-600 hover:bg-blue-50">
                Ver todos los planes
              </Button>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              💡 Tip: Los agentes Premium cierran 3x más ventas que los usuarios gratuitos
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaidFeatureAlert;
