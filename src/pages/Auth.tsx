
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';
import Hero from '@/components/Hero';
import BenefitsSection from '@/components/BenefitsSection';
import PricingSection from '@/components/PricingSection';
import FAQsSection from '@/components/FAQsSection';
import Footer from '@/components/Footer';
import { benefits, plans, faqs } from '@/data/proptorData';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [agentType, setAgentType] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          toast({
            title: 'Error al iniciar sesión',
            description: error.message,
            variant: 'destructive'
          });
        } else {
          toast({
            title: '¡Bienvenido!',
            description: 'Has iniciado sesión correctamente'
          });
        }
      } else {
        if (!fullName || !agentType) {
          toast({
            title: 'Error',
            description: 'Por favor completa todos los campos',
            variant: 'destructive'
          });
          return;
        }
        
        const { error } = await signUp(email, password, fullName, agentType);
        if (error) {
          toast({
            title: 'Error al registrarse',
            description: error.message,
            variant: 'destructive'
          });
        } else {
          toast({
            title: '¡Registro exitoso!',
            description: 'Revisa tu email para confirmar tu cuenta'
          });
        }
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Algo salió mal. Inténtalo de nuevo.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCtaClick = () => {
    setIsLogin(false);
    // Scroll to auth form
    const authSection = document.getElementById('auth-form');
    if (authSection) {
      authSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 flex items-center justify-center overflow-hidden">
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="mb-8">
            <img 
              src="/lovable-uploads/c4d29766-05b3-4827-aa8f-04a07ab56aa9.png" 
              alt="Proptor Logo" 
              className="w-96 md:w-[600px] lg:w-[700px] mx-auto"
            />
          </div>
          <p className="text-2xl md:text-3xl text-white mb-6">
            Tu CRM inmobiliario inteligente para Perú
          </p>
          <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Organiza, da seguimiento y convierte más clientes con menos esfuerzo.
            <span className="block text-blue-200 mt-4 font-semibold">Ahorra hasta 5 horas semanales en seguimiento de clientes.</span>
          </p>
          
          <div className="mt-20 bg-white/10 backdrop-blur-sm rounded-lg p-6 max-w-xl mx-auto">
            <h3 className="text-white text-xl font-bold mb-4">¿Qué hace diferente a Proptor?</h3>
            <p className="text-blue-100">
              Proptor es el único CRM que analiza el comportamiento de tus clientes potenciales para avisarte 
              cuándo y cómo debes darles seguimiento, ayudándote a aumentar tus cierres. Ideal para el mercado peruano.
            </p>
          </div>
        </div>
      </section>
      
      {/* Auth Form Section */}
      <section id="auth-form" className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900">
        <div className="container mx-auto px-4 flex justify-center">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">
                {isLogin ? 'Iniciar Sesión' : 'Conoce la Experiencia'}
              </h2>
              <p className="text-blue-200">
                {isLogin ? 'Accede a tu cuenta' : 'Únete a miles de agentes inmobiliarios'}
              </p>
            </div>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white text-center">
                  {isLogin ? 'Bienvenido de vuelta' : 'Comienza hoy'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {!isLogin && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="fullName" className="text-white">Nombre completo</Label>
                        <Input
                          id="fullName"
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          required={!isLogin}
                          className="bg-white/20 border-white/30 text-white placeholder:text-gray-300"
                          placeholder="Tu nombre completo"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="agentType" className="text-white">Tipo de agente</Label>
                        <Select value={agentType} onValueChange={setAgentType} required={!isLogin}>
                          <SelectTrigger className="bg-white/20 border-white/30 text-white">
                            <SelectValue placeholder="Selecciona tu tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="independiente">Agente Independiente</SelectItem>
                            <SelectItem value="inmobiliaria">Inmobiliaria</SelectItem>
                            <SelectItem value="corredor">Corredor</SelectItem>
                            <SelectItem value="desarrollador">Desarrollador</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="bg-white/20 border-white/30 text-white placeholder:text-gray-300"
                      placeholder="tu@email.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-white">Contraseña</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="bg-white/20 border-white/30 text-white placeholder:text-gray-300"
                      placeholder="••••••••"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                    disabled={loading}
                  >
                    {loading ? 'Cargando...' : (isLogin ? 'Iniciar Sesión' : 'Conoce la Experiencia')}
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <button
                    type="button"
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-blue-200 hover:text-white transition-colors"
                  >
                    {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <BenefitsSection benefits={benefits} />
      
      {/* Pricing Section */}
      <PricingSection plans={plans} onCtaClick={handleCtaClick} />
      
      {/* FAQ Section */}
      <FAQsSection faqs={faqs} />
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Auth;
