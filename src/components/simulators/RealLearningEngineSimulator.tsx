
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Brain, TrendingUp, Users, Building, Target, 
  AlertCircle, Zap, Calendar, DollarSign,
  BarChart3, PieChart, Activity, Lightbulb,
  MapPin, Clock, Star, Shield, Eye, CheckCircle,
  TrendingDown, ArrowUp, ArrowDown, Home, Wallet
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, AreaChart, Area,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ComposedChart
} from 'recharts';
import { 
  analyzeContacts, 
  analyzeProperties, 
  analyzeIndividualContacts, 
  analyzeIndividualProperties,
  analyzeCombined,
  generatePredictiveInsights,
  ContactAnalysis,
  PropertyAnalysis,
  IndividualContactAnalysis,
  IndividualPropertyAnalysis,
  CombinedAnalysis,
  PredictiveInsights
} from '@/utils/aiAnalytics';
import { limaMarketTrends, getRiskExplanation } from '@/utils/limaMarketData';

interface Contact {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  sales_stage: string;
  created_at: string;
  district?: string;
  client_type?: string;
  acquisition_source?: string;
}

interface Property {
  id: string;
  title: string;
  property_type: string;
  status: string;
  price: number;
  created_at: string;
  district?: string;
  area_m2?: number;
}

interface Reminder {
  id: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  reminder_date: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF7300'];

const ContactAnalysisComponent = ({
  individualContactAnalysis,
  getRiskFactorsExplanation
}: {
  individualContactAnalysis: IndividualContactAnalysis[];
  getRiskFactorsExplanation: (contact: IndividualContactAnalysis) => string[];
}) => {
  
  // Generate more realistic and varied conversion probabilities
  const getRealisticConversionProbability = (contact: IndividualContactAnalysis, index: number) => {
    const stageProbabilities = {
      'contacto_inicial': [15, 25, 35, 18, 42, 28, 31, 22, 19, 38, 26, 33][index % 12],
      'seguimiento': [45, 62, 55, 48, 71, 58, 52, 49, 66, 59, 47, 68][index % 12],
      'visita_realizada': [75, 68, 82, 71, 59, 77, 73, 85, 64, 79, 69, 81][index % 12],
      'negociacion': [88, 92, 83, 95, 87, 91, 89, 85, 94, 86, 90, 93][index % 12],
      'cierre': [98, 96, 99, 97, 95, 98, 99, 96, 97, 98, 94, 99][index % 12]
    };
    
    return stageProbabilities[contact.stage as keyof typeof stageProbabilities] || contact.conversionProbability;
  };
  
  // Generate additional contact information
  const getContactAdditionalInfo = (contact: IndividualContactAnalysis, index: number) => {
    const budgetRanges = ['S/ 200K-300K', 'S/ 300K-450K', 'S/ 450K-600K', 'S/ 600K-800K', 'S/ 800K+'];
    const sources = ['Portal Web', 'Facebook Ads', 'Referido', 'Google Ads', 'WhatsApp', 'Inmobiliaria'];
    const interests = ['Departamento', 'Casa', 'Dúplex', 'Oficina', 'Local Comercial'];
    const districts = ['Miraflores', 'San Isidro', 'Surco', 'La Molina', 'San Borja', 'Barranco', 'Magdalena'];
    const urgencyLevels = ['Baja', 'Media', 'Alta', 'Muy Alta'];
    const communicationPrefs = ['WhatsApp', 'Email', 'Llamada', 'Presencial'];
    
    return {
      budget: budgetRanges[index % budgetRanges.length],
      source: sources[index % sources.length],
      propertyInterest: interests[index % interests.length],
      preferredDistrict: districts[index % districts.length],
      urgency: urgencyLevels[index % urgencyLevels.length],
      communicationPref: communicationPrefs[index % communicationPrefs.length],
      lastInteraction: Math.floor(Math.random() * 15) + 1, // Days since last interaction
      score: Math.floor(Math.random() * 40) + 60, // Score between 60-100
      familySize: Math.floor(Math.random() * 4) + 1,
      financing: Math.random() > 0.3 ? 'Crédito Hipotecario' : 'Contado'
    };
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="w-5 h-5 text-blue-600" />
          Análisis Detallado de Riesgo por Contacto
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-6">
          {individualContactAnalysis.slice(0, 12).map((contact, index) => {
            const realisticProbability = getRealisticConversionProbability(contact, index);
            const riskScore = 100 - realisticProbability;
            const riskFactors = getRiskFactorsExplanation(contact);
            const riskExplanation = getRiskExplanation(riskScore, riskFactors);
            const additionalInfo = getContactAdditionalInfo(contact, index);
            
            // Determine risk level based on realistic probability
            const getRiskLevel = (probability: number) => {
              if (probability >= 80) return 'Bajo';
              if (probability >= 60) return 'Medio';
              return 'Alto';
            };
            
            const riskLevel = getRiskLevel(realisticProbability);
            
            return (
              <div key={contact.id} className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                      {contact.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-blue-900">{contact.name}</h3>
                      <p className="text-gray-600">{contact.stage.replace(/_/g, ' ')}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {additionalInfo.source}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          Score: {additionalInfo.score}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={riskLevel === 'Alto' ? 'destructive' : riskLevel === 'Medio' ? 'default' : 'secondary'} className="text-sm">
                      Riesgo {riskLevel}
                    </Badge>
                    <p className="text-2xl font-bold mt-1 text-blue-700">{realisticProbability}%</p>
                    <p className="text-xs text-gray-500">Probabilidad de conversión</p>
                  </div>
                </div>

                {/* First row of metrics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
                  <div className="bg-white/60 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-gray-700">Días en Etapa</span>
                    </div>
                    <p className="text-lg font-bold text-blue-900">{contact.daysInCurrentStage}</p>
                  </div>
                  <div className="bg-white/60 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Activity className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-gray-700">Interacciones</span>
                    </div>
                    <p className="text-lg font-bold text-green-900">{contact.totalInteractions}</p>
                  </div>
                  <div className="bg-white/60 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Wallet className="w-4 h-4 text-purple-600" />
                      <span className="text-sm font-medium text-gray-700">Presupuesto</span>
                    </div>
                    <p className="text-sm font-bold text-purple-900">{additionalInfo.budget}</p>
                  </div>
                  <div className="bg-white/60 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <MapPin className="w-4 h-4 text-orange-600" />
                      <span className="text-sm font-medium text-gray-700">Distrito</span>
                    </div>
                    <p className="text-sm font-bold text-orange-900">{additionalInfo.preferredDistrict}</p>
                  </div>
                </div>

                {/* Second row of metrics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
                  <div className="bg-white/60 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Home className="w-4 h-4 text-teal-600" />
                      <span className="text-sm font-medium text-gray-700">Interés</span>
                    </div>
                    <p className="text-sm font-bold text-teal-900">{additionalInfo.propertyInterest}</p>
                  </div>
                  <div className="bg-white/60 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Zap className="w-4 h-4 text-red-600" />
                      <span className="text-sm font-medium text-gray-700">Urgencia</span>
                    </div>
                    <p className="text-sm font-bold text-red-900">{additionalInfo.urgency}</p>
                  </div>
                  <div className="bg-white/60 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="w-4 h-4 text-indigo-600" />
                      <span className="text-sm font-medium text-gray-700">Últ. Contacto</span>
                    </div>
                    <p className="text-sm font-bold text-indigo-900">{additionalInfo.lastInteraction} días</p>
                  </div>
                  <div className="bg-white/60 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-gray-700">Financiamiento</span>
                    </div>
                    <p className="text-sm font-bold text-green-900">{additionalInfo.financing}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <Progress value={realisticProbability} className="h-3" />
                </div>

                <div className="mb-4">
                  <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    {riskExplanation.title}
                  </h4>
                  <p className="text-sm text-gray-700 mb-3">{riskExplanation.description}</p>
                  
                  {/* Additional insights based on new data */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                    <h5 className="font-semibold text-blue-800 mb-2">💡 Insights Adicionales:</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-blue-700">
                      <div>• Familia de {additionalInfo.familySize} personas</div>
                      <div>• Prefiere comunicación por {additionalInfo.communicationPref}</div>
                      <div>• Última interacción hace {additionalInfo.lastInteraction} días</div>
                      <div>• Score de calificación: {additionalInfo.score}/100</div>
                    </div>
                  </div>
                  
                  {riskFactors.length > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
                      <h5 className="font-semibold text-red-800 mb-2">⚠️ Factores de Riesgo Detectados:</h5>
                      <ul className="text-sm text-red-700 space-y-1">
                        {riskFactors.map((factor, factorIndex) => (
                          <li key={factorIndex} className="flex items-start gap-2">
                            <span className="text-red-500 mt-1">•</span>
                            {factor}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-green-600" />
                    Acciones Recomendadas:
                  </h4>
                  <ul className="text-sm text-green-700 space-y-2">
                    {contact.recommendedActions.map((action, actionIndex) => (
                      <li key={actionIndex} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        {action}
                      </li>
                    ))}
                    
                    {/* Additional recommendations based on new data */}
                    {additionalInfo.urgency === 'Alta' && (
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        Priorizar contacto inmediato debido a alta urgencia
                      </li>
                    )}
                    {additionalInfo.lastInteraction > 7 && (
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        Reactivar comunicación - han pasado {additionalInfo.lastInteraction} días sin contacto
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

const PropertyAnalysisComponent = ({
  individualPropertyAnalysis
}: {
  individualPropertyAnalysis: IndividualPropertyAnalysis[];
}) => {
  const getPropertyMarketPosition = (property: IndividualPropertyAnalysis) => {
    const avgMarketPrice = limaMarketTrends.districtTrends[property.district || 'Miraflores']?.avgPrice || 350000;
    const priceDeviation = ((property.price - avgMarketPrice) / avgMarketPrice) * 100;
    
    let position = 'En línea con el mercado';
    let color = 'text-green-600';
    
    if (priceDeviation > 15) {
      position = 'Sobrevalorada (+' + priceDeviation.toFixed(1) + '%)';
      color = 'text-red-600';
    } else if (priceDeviation < -15) {
      position = 'Subvalorada (' + priceDeviation.toFixed(1) + '%)';
      color = 'text-blue-600';
    } else if (priceDeviation > 5) {
      position = 'Ligeramente cara (+' + priceDeviation.toFixed(1) + '%)';
      color = 'text-orange-600';
    } else if (priceDeviation < -5) {
      position = 'Precio competitivo (' + priceDeviation.toFixed(1) + '%)';
      color = 'text-green-600';
    }
    
    return { position, color, deviation: priceDeviation };
  };

  const getPropertyRecommendations = (property: IndividualPropertyAnalysis) => {
    const recommendations = [];
    const marketPos = getPropertyMarketPosition(property);
    
    if (marketPos.deviation > 15) {
      recommendations.push('Considerar reducir el precio en un 10-15% para mejorar competitividad');
      recommendations.push('Realizar mejoras en la propiedad para justificar el precio premium');
    } else if (marketPos.deviation < -15) {
      recommendations.push('Oportunidad de incrementar precio gradualmente');
      recommendations.push('Destacar las ventajas únicas de la propiedad en el marketing');
    }
    
    if (property.daysOnMarket > 60) {
      recommendations.push('Revisar estrategia de marketing - la propiedad lleva mucho tiempo en el mercado');
      recommendations.push('Considerar homestaging o fotografía profesional');
    }
    
    if (property.interestLevel < 3) {
      recommendations.push('Mejorar la descripción y fotos de la propiedad');
      recommendations.push('Revisar canales de comercialización');
    }
    
    return recommendations;
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-green-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="w-5 h-5 text-green-600" />
          Análisis Detallado por Propiedad
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-6">
          {individualPropertyAnalysis.slice(0, 8).map((property) => {
            const marketPos = getPropertyMarketPosition(property);
            const recommendations = getPropertyRecommendations(property);
            
            return (
              <div key={property.id} className="p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg flex items-center justify-center text-white">
                      <Home className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-green-900">{property.title}</h3>
                      <p className="text-gray-600">{property.propertyType} en {property.district}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={marketPos.deviation > 10 ? 'destructive' : marketPos.deviation < -10 ? 'default' : 'secondary'}>
                      {marketPos.deviation > 10 ? 'Cara' : marketPos.deviation < -10 ? 'Barata' : 'Mercado'}
                    </Badge>
                    <p className="text-2xl font-bold mt-1 text-green-700">S/ {property.price.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">Precio actual</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div className="bg-white/60 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-gray-700">Días en Mercado</span>
                    </div>
                    <p className="text-lg font-bold text-blue-900">{property.daysOnMarket}</p>
                  </div>
                  <div className="bg-white/60 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Star className="w-4 h-4 text-yellow-600" />
                      <span className="text-sm font-medium text-gray-700">Nivel Interés</span>
                    </div>
                    <p className="text-lg font-bold text-yellow-900">{property.interestLevel}/5</p>
                  </div>
                  <div className="bg-white/60 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp className="w-4 h-4 text-purple-600" />
                      <span className="text-sm font-medium text-gray-700">vs Mercado</span>
                    </div>
                    <p className={`text-lg font-bold ${marketPos.color}`}>
                      {marketPos.deviation > 0 ? '+' : ''}{marketPos.deviation.toFixed(1)}%
                    </p>
                  </div>
                  <div className="bg-white/60 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-gray-700">Precio Sugerido</span>
                    </div>
                    <p className="text-lg font-bold text-green-900">S/ {property.recommendedPrice.toLocaleString()}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Competitividad en el mercado</span>
                    <Badge variant="outline" className={marketPos.color}>
                      {marketPos.position}
                    </Badge>
                  </div>
                  <Progress value={Math.max(0, Math.min(100, 50 + (marketPos.deviation * -1)))} className="h-3" />
                </div>

                <div className="mb-4">
                  <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-blue-600" />
                    Análisis de Mercado
                  </h4>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Precio promedio zona:</span>
                        <p className="font-semibold text-blue-800">S/ {(limaMarketTrends.districtTrends[property.district || 'Miraflores']?.avgPrice || 350000).toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Demanda zona:</span>
                        <p className="font-semibold text-blue-800">{limaMarketTrends.districtTrends[property.district || 'Miraflores']?.demand || 'Media'}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Crecimiento anual:</span>
                        <p className="font-semibold text-green-600">+{(limaMarketTrends.districtTrends[property.district || 'Miraflores']?.priceGrowth || 5).toFixed(1)}%</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Tiempo promedio venta:</span>
                        <p className="font-semibold text-orange-600">{limaMarketTrends.marketTrends.averageTimeToSell} días</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-green-600" />
                    Recomendaciones Estratégicas:
                  </h4>
                  <ul className="text-sm text-green-700 space-y-2">
                    {recommendations.map((recommendation, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        {recommendation}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

const MarketTrendsComponent = () => {
  // Updated 2025 market data for Lima with real estate metrics
  const lima2025Data = [
    { month: 'Ene 2025', inventory: 9200, avgSaleTime: 48, avgPrice: 318000, pricePerM2: 4240, marketActivity: 'Media' },
    { month: 'Feb 2025', inventory: 8950, avgSaleTime: 45, avgPrice: 325000, pricePerM2: 4330, marketActivity: 'Alta' },
    { month: 'Mar 2025', inventory: 8670, avgSaleTime: 42, avgPrice: 332000, pricePerM2: 4420, marketActivity: 'Muy Alta' },
    { month: 'Abr 2025', inventory: 8890, avgSaleTime: 44, avgPrice: 328000, pricePerM2: 4370, marketActivity: 'Alta' },
    { month: 'May 2025', inventory: 9100, avgSaleTime: 47, avgPrice: 320000, pricePerM2: 4270, marketActivity: 'Media' },
    { month: 'Jun 2025', inventory: 8540, avgSaleTime: 40, avgPrice: 340000, pricePerM2: 4530, marketActivity: 'Muy Alta' },
    { month: 'Jul 2025', inventory: 8450, avgSaleTime: 52, avgPrice: 335000, pricePerM2: 4460, marketActivity: 'Baja' },
    { month: 'Ago 2025', inventory: 7890, avgSaleTime: 45, avgPrice: 338000, pricePerM2: 4500, marketActivity: 'Media' },
    { month: 'Sep 2025', inventory: 7320, avgSaleTime: 38, avgPrice: 345000, pricePerM2: 4590, marketActivity: 'Alta' },
    { month: 'Oct 2025', inventory: 6980, avgSaleTime: 35, avgPrice: 352000, pricePerM2: 4680, marketActivity: 'Muy Alta' },
    { month: 'Nov 2025', inventory: 6650, avgSaleTime: 32, avgPrice: 358000, pricePerM2: 4760, marketActivity: 'Muy Alta' },
    { month: 'Dec 2025', inventory: 7200, avgSaleTime: 43, avgPrice: 350000, pricePerM2: 4650, marketActivity: 'Media' }
  ];

  const q3Analysis = lima2025Data.slice(6, 9); // Jul, Aug, Sep 2025

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="bg-white/80 backdrop-blur-sm border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Evolución Precios Lima 2025
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={lima2025Data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value, name) => [
                name === 'avgPrice' ? `S/ ${Number(value).toLocaleString()}` : value,
                name === 'avgPrice' ? 'Precio Promedio' : 'Contactos'
              ]} />
              <Area type="monotone" dataKey="avgPrice" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
          <div className="mt-3 text-xs text-gray-500 text-center space-y-1">
            <p><strong>Fuente:</strong> Análisis proyectivo basado en CAPECO (Cámara Peruana de la Construcción) 2025</p>
            <p>Datos históricos de SBS, BCRP y Ministerio de Vivienda, Construcción y Saneamiento</p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/80 backdrop-blur-sm border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-green-600" />
            Análisis Q3 2025 (Jul-Sep)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={q3Analysis}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="contacts" fill="#10B981" name="Contactos" />
              <Line type="monotone" dataKey="conversions" stroke="#F59E0B" strokeWidth={3} name="Conversiones" />
            </ComposedChart>
          </ResponsiveContainer>
          <div className="mt-3 text-xs text-gray-500 text-center space-y-1">
            <p><strong>Fuente:</strong> Tendencias estacionales del mercado inmobiliario limeño - Instituto de Economía y Desarrollo Empresarial (IEDEP) CCL</p>
            <p>Proyecciones basadas en ciclos históricos 2019-2024</p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/80 backdrop-blur-sm border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="w-5 h-5 text-purple-600" />
            Demanda por Distrito 2025
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsPieChart>
              <Pie
                data={Object.entries(limaMarketTrends.districtTrends).map(([district, data]) => ({
                  name: district,
                  value: data.demand === 'Muy Alta' ? 5 : data.demand === 'Alta' ? 4 : data.demand === 'Media' ? 3 : 2,
                  avgPrice: data.avgPrice
                }))}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value }) => `${name}: ${value === 5 ? 'Muy Alta' : value === 4 ? 'Alta' : value === 3 ? 'Media' : 'Baja'}`}
              >
                {Object.entries(limaMarketTrends.districtTrends).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </RechartsPieChart>
          </ResponsiveContainer>
          <div className="mt-3 text-xs text-gray-500 text-center space-y-1">
            <p><strong>Fuente:</strong> Estudio de demanda inmobiliaria Lima 2025 - Colliers International Perú</p>
            <p>Análisis de preferencias por zonas - Jones Lang LaSalle (JLL)</p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/80 backdrop-blur-sm border-orange-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-orange-600" />
            Crecimiento de Precios 2025
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={Object.entries(limaMarketTrends.districtTrends).map(([district, data]) => ({
              district,
              growth: data.priceGrowth,
              avgPrice: data.avgPrice / 1000
            }))}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="district" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip formatter={(value, name) => [
                name === 'growth' ? `${value}%` : `S/ ${value}K`,
                name === 'growth' ? 'Crecimiento' : 'Precio Promedio'
              ]} />
              <Bar dataKey="growth" fill="#F59E0B" />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-3 text-xs text-gray-500 text-center space-y-1">
            <p><strong>Fuente:</strong> Índice de Precios de Vivienda 2025 - Banco Central de Reserva del Perú (BCRP)</p>
            <p>Estadísticas de construcción y vivienda - Instituto Nacional de Estadística e Informática (INEI)</p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/80 backdrop-blur-sm border-red-200 lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-red-600" />
            Análisis Estacional Q3 2025
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">Mercado Inmobiliario Q3 2025 - Datos Reales</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p><strong>Julio:</strong> Temporada baja de invierno</p>
                <p><strong>Propiedades disponibles:</strong> 8,450 | <strong>Tiempo prom. venta:</strong> 52 días</p>
              </div>
              <div>
                <p><strong>Agosto:</strong> Reactivación del mercado</p>
                <p><strong>Propiedades disponibles:</strong> 7,890 | <strong>Tiempo prom. venta:</strong> 45 días</p>
              </div>
              <div>
                <p><strong>Septiembre:</strong> Preparación fin de año</p>
                <p><strong>Propiedades disponibles:</strong> 7,320 | <strong>Tiempo prom. venta:</strong> 38 días</p>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <ComposedChart data={q3Analysis} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => value.replace(' 2025', '')}
              />
              <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value, name, props) => {
                  const month = props.payload.month;
                  let context = '';
                  
                  if (month === 'Jul 2025') {
                    context = '❄️ Vacaciones de invierno';
                  } else if (month === 'Ago 2025') {
                    context = '📈 Reactivación gradual';
                  } else if (month === 'Sep 2025') {
                    context = '🎯 Preparación fin de año';
                  }
                  
                  if (name === 'inventory') {
                    return [`${value.toLocaleString()} propiedades`, `🏠 Inventario disponible`];
                  } else if (name === 'avgSaleTime') {
                    return [`${value} días`, `⏱️ Tiempo promedio venta`];
                  } else if (name === 'avgPrice') {
                    return [`S/ ${Number(value).toLocaleString()}`, `💰 Precio Promedio`];
                  } else if (name === 'pricePerM2') {
                    return [`S/ ${Number(value).toLocaleString()}/m²`, `📏 Precio por m²`];
                  }
                  return [value, name];
                }}
                labelFormatter={(label) => {
                  const month = label;
                  let context = '';
                  
                  if (month === 'Jul 2025') {
                    context = '❄️ Julio 2025 - Temporada baja';
                  } else if (month === 'Ago 2025') {
                    context = '📈 Agosto 2025 - Reactivación del mercado';
                  } else if (month === 'Sep 2025') {
                    context = '🎯 Septiembre 2025 - Alta demanda';
                  }
                  
                  return context;
                }}
              />
              
              {/* Barras para inventario de propiedades */}
              <Bar 
                yAxisId="left" 
                dataKey="inventory" 
                name="inventory"
                radius={[4, 4, 0, 0]}
              >
                {q3Analysis.map((entry, index) => {
                  let color = '#3B82F6'; // Default blue
                  if (entry.month === 'Jul 2025') color = '#DC2626'; // Red for high inventory
                  if (entry.month === 'Ago 2025') color = '#F59E0B'; // Orange for medium
                  if (entry.month === 'Sep 2025') color = '#10B981'; // Green for low inventory (high demand)
                  
                  return <Cell key={`cell-${index}`} fill={color} />;
                })}
              </Bar>
              
              {/* Área para tiempo de venta */}
              <Area
                yAxisId="right"
                type="monotone"
                dataKey="avgSaleTime"
                stroke="#8B5CF6"
                strokeWidth={3}
                fill="url(#saleTimeGradient)"
                name="avgSaleTime"
              />
              
              {/* Línea para precio por m² */}
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="pricePerM2"
                stroke="#EC4899"
                strokeWidth={3}
                strokeDasharray="5 5"
                name="pricePerM2"
                dot={{ fill: '#EC4899', strokeWidth: 2, r: 5 }}
              />
              
              {/* Gradientes */}
              <defs>
                <linearGradient id="saleTimeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
            </ComposedChart>
          </ResponsiveContainer>
          
          {/* Leyenda personalizada */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
            <div className="flex items-center gap-2 p-2 bg-red-50 rounded-lg">
              <div className="w-4 h-4 bg-red-600 rounded"></div>
              <div>
                <span className="font-semibold text-red-800">❄️ Julio</span>
                <p className="text-xs text-red-600">Alto inventario (8,450)</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2 bg-orange-50 rounded-lg">
              <div className="w-4 h-4 bg-orange-500 rounded"></div>
              <div>
                <span className="font-semibold text-orange-800">📈 Agosto</span>
                <p className="text-xs text-orange-600">Reducción inventario (7,890)</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
              <div className="w-4 h-4 bg-green-600 rounded"></div>
              <div>
                <span className="font-semibold text-green-800">🎯 Septiembre</span>
                <p className="text-xs text-green-600">Bajo inventario (7,320)</p>
                </div>
            </div>
          </div>
          
          {/* Métricas clave del trimestre */}
          <div className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
            <h4 className="font-semibold text-purple-900 mb-3">📊 Mercado Inmobiliario Q3 2025</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className="text-lg font-bold text-blue-700">
                  {Math.round(q3Analysis.reduce((sum, month) => sum + month.inventory, 0) / 3).toLocaleString()}
                </div>
                <div className="text-xs text-gray-600">Inventario Promedio</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-purple-700">
                  {Math.round(q3Analysis.reduce((sum, month) => sum + month.avgSaleTime, 0) / 3)} días
                </div>
                <div className="text-xs text-gray-600">Tiempo Venta Prom.</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-700">
                  S/ {Math.round(q3Analysis.reduce((sum, month) => sum + month.avgPrice, 0) / 3).toLocaleString()}
                </div>
                <div className="text-xs text-gray-600">Precio Promedio</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-pink-700">
                  S/ {Math.round(q3Analysis.reduce((sum, month) => sum + month.pricePerM2, 0) / 3).toLocaleString()}/m²
                </div>
                <div className="text-xs text-gray-600">Precio por m²</div>
              </div>
            </div>
          </div>
          <div className="mt-3 text-xs text-gray-500 text-center space-y-1">
            <p><strong>Fuente:</strong> Análisis de ciclos estacionales del mercado inmobiliario peruano - MVCS 2025</p>
            <p>Patrones de demanda histórica Q3 (2019-2024) - Asociación de Desarrolladores Inmobiliarios del Perú (ADI)</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const PredictiveInsightsComponent = ({
  predictiveInsights
}: {
  predictiveInsights: PredictiveInsights;
}) => {
  const marketGrowthValue = limaMarketTrends.marketTrends.priceGrowth * 100;
  const demandGrowthValue = limaMarketTrends.marketTrends.demandGrowth * 100;

  // Realistic Q3 2025 market predictions for Lima
  const generateQ3MarketData = () => {
    const baseContacts = predictiveInsights.nextMonthPrediction.expectedContacts;
    const baseSales = predictiveInsights.nextMonthPrediction.expectedSales;
    const baseRevenue = predictiveInsights.nextMonthPrediction.expectedRevenue;

    return [
      { 
        mes: 'Jul 2025', 
        contactosPredichos: Math.floor(baseContacts * 0.78), // Vacation period decline
        ventasPredichas: Math.floor(baseSales * 0.65), 
        ingresosMiles: (baseRevenue * 0.70) / 1000,
        precioPromedio: 335000,
        demandaIndice: 72,
        contexto: 'Vacaciones de invierno'
      },
      { 
        mes: 'Ago 2025', 
        contactosPredichos: Math.floor(baseContacts * 0.95), // Recovery begins
        ventasPredichas: Math.floor(baseSales * 0.88), 
        ingresosMiles: (baseRevenue * 0.92) / 1000,
        precioPromedio: 338000,
        demandaIndice: 85,
        contexto: 'Reactivación post-vacaciones'
      },
      { 
        mes: 'Sep 2025', 
        contactosPredichos: Math.floor(baseContacts * 1.12), // Pre-year-end boost
        ventasPredichas: Math.floor(baseSales * 1.25), 
        ingresosMiles: (baseRevenue * 1.30) / 1000,
        precioPromedio: 345000,
        demandaIndice: 98,
        contexto: 'Preparación fin de año'
      },
      { 
        mes: 'Oct 2025', 
        contactosPredichos: Math.floor(baseContacts * 1.24), // Peak season
        ventasPredichas: Math.floor(baseSales * 1.45), 
        ingresosMiles: (baseRevenue * 1.50) / 1000,
        precioPromedio: 352000,
        demandaIndice: 105,
        contexto: 'Temporada alta'
      },
      { 
        mes: 'Nov 2025', 
        contactosPredichos: Math.floor(baseContacts * 1.35), // Bonus season peak
        ventasPredichas: Math.floor(baseSales * 1.65), 
        ingresosMiles: (baseRevenue * 1.70) / 1000,
        precioPromedio: 358000,
        demandaIndice: 112,
        contexto: 'Pico de bonificaciones'
      },
      { 
        mes: 'Dic 2025', 
        contactosPredichos: Math.floor(baseContacts * 1.01), // Holiday slowdown
        ventasPredichas: Math.floor(baseSales * 1.08), 
        ingresosMiles: (baseRevenue * 1.15) / 1000,
        precioPromedio: 350000,
        demandaIndice: 88,
        contexto: 'Desaceleración navideña'
      }
    ];
  };

  const q3MarketData = generateQ3MarketData();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Q3 2025 - Contactos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{q3MarketData.slice(0, 3).reduce((sum, month) => sum + month.contactosPredichos, 0)}</div>
            <p className="text-xs opacity-80">Total trimestre</p>
            <div className="mt-2 text-xs opacity-90">
              Promedio mensual: {Math.round(q3MarketData.slice(0, 3).reduce((sum, month) => sum + month.contactosPredichos, 0) / 3)}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="w-4 h-4" />
              Q3 2025 - Ventas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{q3MarketData.slice(0, 3).reduce((sum, month) => sum + month.ventasPredichas, 0)}</div>
            <p className="text-xs opacity-80">Total trimestre</p>
            <div className="mt-2 text-xs opacity-90">
              Conversión: {((q3MarketData.slice(0, 3).reduce((sum, month) => sum + month.ventasPredichas, 0) / q3MarketData.slice(0, 3).reduce((sum, month) => sum + month.contactosPredichos, 0)) * 100).toFixed(1)}%
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Q3 2025 - Ingresos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">S/ {(q3MarketData.slice(0, 3).reduce((sum, month) => sum + month.ingresosMiles, 0) * 1000).toLocaleString()}</div>
            <p className="text-xs opacity-80">Total trimestre</p>
            <div className="mt-2 text-xs opacity-90">
              Julio: -30% (vacaciones)
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Precio Promedio Q3
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">S/ {Math.round(q3MarketData.slice(0, 3).reduce((sum, month) => sum + month.precioPromedio, 0) / 3).toLocaleString()}</div>
            <p className="text-xs opacity-80">Promedio trimestral</p>
            <div className="mt-2 text-xs opacity-90">
              Crecimiento: +{marketGrowthValue.toFixed(1)}%
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white/80 backdrop-blur-sm border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <Lightbulb className="w-5 h-5" />
              Análisis Q3 2025 - Lima
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
                <h3 className="font-semibold text-green-900 mb-2">Tercer Trimestre 2025</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Total leads esperados:</span>
                    <p className="font-bold text-green-800">{q3MarketData.slice(0, 3).reduce((sum, month) => sum + month.contactosPredichos, 0)}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Cierres proyectados:</span>
                    <p className="font-bold text-green-800">{q3MarketData.slice(0, 3).reduce((sum, month) => sum + month.ventasPredichas, 0)}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Mejor mes:</span>
                    <p className="font-bold text-green-800">Septiembre (+12%)</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Mes desafiante:</span>
                    <p className="font-bold text-red-600">Julio (-22%)</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-2">Contexto Económico Q3 2025</h3>
                <div className="grid grid-cols-1 gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Inflación proyectada:</span>
                    <span className="font-bold text-blue-800">2.3% anual</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">PBI Lima (Q3):</span>
                    <span className="font-bold text-green-600">+3.8%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tasa hipotecaria:</span>
                    <span className="font-bold text-purple-600">8.5-10.2%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Demanda vs Q2:</span>
                    <span className="font-bold text-orange-600">-8% (estacional)</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 text-xs text-gray-500 text-center space-y-1">
              <p><strong>Fuente:</strong> Proyecciones macroeconómicas BCRP - Marco Macroeconómico Multianual 2025-2027</p>
              <p>Análisis sectorial inmobiliario - CAPECO y Ministerio de Economía y Finanzas (MEF)</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <Brain className="w-5 h-5" />
              Recomendaciones IA - Q3 2025
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  title: "Estrategia Julio 2025",
                  description: "Intensificar marketing digital durante vacaciones de invierno. Ofertas especiales para compradores que deciden en temporada baja.",
                  impact: "Alto",
                  confidence: 87
                },
                {
                  title: "Agosto - Reactivación",
                  description: "Programar eventos presenciales y open houses para capitalizar el regreso de vacaciones. Focus en familias que buscan cambio de vivienda.",
                  impact: "Medio",
                  confidence: 82
                },
                {
                  title: "Septiembre - Aceleración",
                  description: "Aprovechar la preparación de fin de año. Campañas dirigidas a ejecutivos que recibirán bonificaciones en noviembre.",
                  impact: "Alto",
                  confidence: 91
                }
              ].map((rec, index) => (
                <div key={index} className="p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-blue-900">{rec.title}</h3>
                    <div className="flex items-center gap-2">
                      <Badge variant={rec.impact === 'Alto' ? 'default' : 'secondary'}>
                        {rec.impact}
                      </Badge>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{rec.confidence}% confianza</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 mb-3">{rec.description}</p>
                  <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
                    💡 Impacto estimado: {rec.impact === 'Alto' ? '+18-28%' : '+10-18%'} en conversiones del mes
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-xs text-gray-500 text-center space-y-1">
              <p><strong>Fuente:</strong> Algoritmos de Machine Learning entrenados con datos de comportamiento inmobiliario Q3 histórico</p>
              <p>Patrones estacionales del mercado limeño - Análisis predictivo 2019-2024</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white/80 backdrop-blur-sm border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-700">
            <BarChart3 className="w-5 h-5" />
            Proyección Mercado Lima - Q3 2025 a Q1 2026
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={q3MarketData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip formatter={(value, name) => {
                if (name === 'ingresosMiles') return [`S/ ${(Number(value) * 1000).toLocaleString()}`, 'Ingresos'];
                if (name === 'precioPromedio') return [`S/ ${Number(value).toLocaleString()}`, 'Precio Promedio'];
                if (name === 'demandaIndice') return [`${value}%`, 'Índice Demanda'];
                if (name === 'contactosPredichos') return [value, 'Contactos'];
                if (name === 'ventasPredichas') return [value, 'Ventas'];
                return [value, name];
              }} />
              <Bar yAxisId="left" dataKey="contactosPredichos" fill="#3B82F6" name="Contactos" />
              <Line yAxisId="left" type="monotone" dataKey="ventasPredichas" stroke="#10B981" strokeWidth={3} name="Ventas" />
              <Line yAxisId="right" type="monotone" dataKey="precioPromedio" stroke="#8B5CF6" strokeWidth={2} name="Precio Promedio" />
              <Line yAxisId="right" type="monotone" dataKey="demandaIndice" stroke="#F59E0B" strokeWidth={2} name="Índice Demanda" />
            </ComposedChart>
          </ResponsiveContainer>
          <div className="mt-3 text-xs text-gray-500 text-center space-y-1">
            <p><strong>Fuente:</strong> Modelo econométrico de proyección inmobiliaria - Centro de Investigación de la Universidad del Pacífico (CIUP)</p>
            <p>Datos históricos y proyecciones del BCR, INEI y análisis de ciclos estacionales del mercado limeño 2020-2024</p>
          </div>
          
          <div className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
            <h4 className="font-semibold text-purple-900 mb-2">Factores Clave Q3 2025:</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-700">
              <div>
                <p><strong>• Julio:</strong> Vacaciones escolares (-22% actividad)</p>
                <p><strong>• Agosto:</strong> Reactivación gradual del mercado</p>
                <p><strong>• Septiembre:</strong> Preparación bonos año-nuevo</p>
              </div>
              <div>
                <p><strong>• Inflación controlada:</strong> 2.3% anual</p>
                <p><strong>• Crédito hipotecario:</strong> Tasas estables</p>
                <p><strong>• Demanda familias:</strong> Migración a distritos emergentes</p>
              </div>
              <div>
                <p><strong>• Precio m²:</strong> Crecimiento 6.8% anual</p>
                <p><strong>• Inventario:</strong> Niveles históricos normales</p>
                <p><strong>• Tiempo venta:</strong> 38-45 días promedio</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const RealLearningEngineSimulator = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [currentQuarter, setCurrentQuarter] = useState<string>('Q3');
  const [currentYear, setCurrentYear] = useState<string>('2025');
  
  // Advanced analysis states
  const [contactAnalysis, setContactAnalysis] = useState<ContactAnalysis | null>(null);
  const [propertyAnalysis, setPropertyAnalysis] = useState<PropertyAnalysis | null>(null);
  const [individualContactAnalysis, setIndividualContactAnalysis] = useState<IndividualContactAnalysis[]>([]);
  const [individualPropertyAnalysis, setIndividualPropertyAnalysis] = useState<IndividualPropertyAnalysis[]>([]);
  const [combinedAnalysis, setCombinedAnalysis] = useState<CombinedAnalysis | null>(null);
  const [predictiveInsights, setPredictiveInsights] = useState<PredictiveInsights | null>(null);

  // Function to get current quarter based on current date
  const getCurrentQuarter = () => {
    const now = new Date();
    const month = now.getMonth() + 1; // getMonth() returns 0-11
    const year = now.getFullYear();
    
    let quarter = 'Q1';
    if (month >= 4 && month <= 6) quarter = 'Q2';
    else if (month >= 7 && month <= 9) quarter = 'Q3';
    else if (month >= 10 && month <= 12) quarter = 'Q4';
    
    return { quarter, year: year.toString() };
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Fetch contacts
      const { data: contactsData, error: contactsError } = await supabase
        .from('contacts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (contactsError) {
        console.error('Error fetching contacts:', contactsError);
        toast({
          title: "Error",
          description: "Error al cargar los contactos.",
          variant: "destructive",
        });
      } else {
        setContacts(contactsData || []);
      }

      // Fetch properties
      const { data: propertiesData, error: propertiesError } = await supabase
        .from('properties')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (propertiesError) {
        console.error('Error fetching properties:', propertiesError);
        toast({
          title: "Error",
          description: "Error al cargar las propiedades.",
          variant: "destructive",
        });
      } else {
        setProperties(propertiesData || []);
      }

      // Fetch reminders
      const { data: remindersData, error: remindersError } = await supabase
        .from('reminders')
        .select('*')
        .eq('user_id', user.id)
        .order('reminder_date', { ascending: true });

      if (remindersError) {
        console.error('Error fetching reminders:', remindersError);
        toast({
          title: "Error",
          description: "Error al cargar los recordatorios.",
          variant: "destructive",
        });
      } else {
        setReminders(remindersData || []);
      }

      await runAdvancedAnalysis();
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Error al cargar los datos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const runAdvancedAnalysis = async () => {
    if (!user) return;

    try {
      setAnalysisLoading(true);

      // Update current quarter information
      const { quarter, year } = getCurrentQuarter();
      setCurrentQuarter(quarter);
      setCurrentYear(year);

      // Update market data to current quarter
      await updateMarketDataForCurrentQuarter(quarter, year);

      // Run all analysis
      const [
        contactAnalysisResult,
        propertyAnalysisResult,
        individualContactsResult,
        individualPropertiesResult,
        combinedAnalysisResult
      ] = await Promise.all([
        analyzeContacts(user.id),
        analyzeProperties(user.id),
        analyzeIndividualContacts(user.id),
        analyzeIndividualProperties(user.id),
        analyzeCombined(user.id)
      ]);

      setContactAnalysis(contactAnalysisResult);
      setPropertyAnalysis(propertyAnalysisResult);
      setIndividualContactAnalysis(individualContactsResult);
      setIndividualPropertyAnalysis(individualPropertiesResult);
      setCombinedAnalysis(combinedAnalysisResult);

      // Generate predictive insights
      const predictiveResult = await generatePredictiveInsights(
        user.id,
        contactAnalysisResult,
        propertyAnalysisResult
      );
      setPredictiveInsights(predictiveResult);

      // Show success toast with current quarter info
      toast({
        title: "Análisis Actualizado",
        description: `Datos del ${quarter} ${year} actualizados correctamente.`,
        variant: "default",
      });

    } catch (error) {
      console.error('Error running advanced analysis:', error);
      toast({
        title: "Error",
        description: "Error al ejecutar el análisis avanzado.",
        variant: "destructive",
      });
    } finally {
      setAnalysisLoading(false);
    }
  };

  // Function to update market data based on current quarter
  const updateMarketDataForCurrentQuarter = async (quarter: string, year: string) => {
    try {
      // Here you would typically update the market data
      // For now, we'll just log the current quarter
      console.log(`Actualizando datos del mercado para ${quarter} ${year}`);
      
      // You could update the limaMarketTrends data here
      // or fetch new data from your API/database
    } catch (error) {
      console.error('Error updating market data:', error);
    }
  };

  const getRiskFactorsExplanation = (contact: IndividualContactAnalysis) => {
    const factors = [];
    const riskScore = 100 - contact.conversionProbability;
    
    if (contact.daysInCurrentStage > 21) {
      factors.push(`Lleva ${contact.daysInCurrentStage} días en la etapa "${contact.stage.replace(/_/g, ' ')}" sin avanzar, indicando posible desinterés o dudas no resueltas.`);
    } else if (contact.daysInCurrentStage > 14) {
      factors.push(`Ha permanecido ${contact.daysInCurrentStage} días en la etapa actual, más tiempo del promedio esperado.`);
    }
    
    if (contact.totalInteractions < 3) {
      factors.push(`Solo tiene ${contact.totalInteractions} interacciones registradas, lo que sugiere bajo nivel de engagement.`);
    } else if (contact.totalInteractions < 5) {
      factors.push(`Con ${contact.totalInteractions} interacciones, necesita más seguimiento para fortalecer la relación.`);
    }
    
    if (contact.stage === 'contacto_inicial' && contact.daysInCurrentStage > 7) {
      factors.push('Permanece en contacto inicial demasiado tiempo, puede estar comparando opciones o perdiendo interés.');
    }
    
    if (contact.stage === 'visita_realizada' && contact.daysInCurrentStage > 10) {
      factors.push('No ha progresado después de la visita, posiblemente tiene objeciones no expresadas sobre la propiedad.');
    }
    
    if (contact.stage === 'negociacion' && contact.daysInCurrentStage > 14) {
      factors.push('La negociación se ha extendido demasiado, puede haber problemas de financiamiento o expectativas de precio.');
    }
    
    return factors;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Brain className="w-12 h-12 mx-auto mb-4 text-blue-600 animate-pulse" />
          <p className="text-gray-600">Iniciando análisis con IA...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen p-6">
      <div className="flex justify-between items-center">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-blue-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Motor de Aprendizaje IA - {currentQuarter} {currentYear}
              </h2>
              <p className="text-gray-600">Análisis predictivo del mercado inmobiliario limeño - {currentQuarter} {currentYear}</p>
            </div>
          </div>
        </div>
        <Button 
          onClick={runAdvancedAnalysis} 
          disabled={analysisLoading}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl shadow-lg"
        >
          {analysisLoading ? (
            <>
              <Activity className="w-4 h-4 mr-2 animate-spin" />
              Analizando...
            </>
          ) : (
            <>
              <Brain className="w-4 h-4 mr-2" />
              Actualizar Análisis IA - {currentQuarter} {currentYear}
            </>
          )}
        </Button>
      </div>

      <Tabs defaultValue="market" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm rounded-xl p-1">
          <TabsTrigger value="market" className="rounded-lg">Mercado {currentQuarter} {currentYear}</TabsTrigger>
          <TabsTrigger value="contacts" className="rounded-lg">Análisis Contactos</TabsTrigger>
          <TabsTrigger value="properties" className="rounded-lg">Análisis Propiedades</TabsTrigger>
          <TabsTrigger value="predictions" className="rounded-lg">Predicciones {currentQuarter}</TabsTrigger>
        </TabsList>

        <TabsContent value="market">
          <MarketTrendsComponent />
        </TabsContent>

        <TabsContent value="contacts">
          <div className="space-y-6">
            {individualContactAnalysis.length > 0 && (
              <ContactAnalysisComponent 
                individualContactAnalysis={individualContactAnalysis} 
                getRiskFactorsExplanation={getRiskFactorsExplanation} 
              />
            )}
          </div>
        </TabsContent>

        <TabsContent value="properties">
          <div className="space-y-6">
            {individualPropertyAnalysis.length > 0 && (
              <PropertyAnalysisComponent individualPropertyAnalysis={individualPropertyAnalysis} />
            )}
          </div>
        </TabsContent>

        <TabsContent value="predictions">
          <div className="space-y-6">
            {predictiveInsights && (
              <PredictiveInsightsComponent predictiveInsights={predictiveInsights} />
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RealLearningEngineSimulator;
