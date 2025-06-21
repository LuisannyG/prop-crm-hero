import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let result;
      if (isLogin) {
        result = await signIn(formData.email, formData.password);
        if (!result.error) {
          toast({
            title: '¡Bienvenido!',
            description: 'Has iniciado sesión correctamente',
          });
          navigate('/dashboard');
        }
      } else {
        result = await signUp(formData.email, formData.password, formData.fullName);
        if (!result.error) {
          toast({
            title: '¡Cuenta creada exitosamente!',
            description: 'Revisa tu email para confirmar tu cuenta antes de iniciar sesión',
          });
          // Cambiar al modo login después del registro exitoso
          setIsLogin(true);
          setFormData({ email: formData.email, password: '', fullName: '' });
        }
      }

      if (result.error) {
        let errorMessage = 'Ha ocurrido un error';
        
        // Manejar errores específicos con mejor detección de duplicados
        if (result.error.message?.includes('User already registered') || 
            result.error.code === 'user_already_exists' ||
            result.error.message?.includes('already been registered')) {
          errorMessage = 'Esta cuenta ya existe. Intenta iniciar sesión en su lugar.';
          // Cambiar automáticamente al modo login
          setIsLogin(true);
          setFormData(prev => ({ ...prev, password: '', fullName: '' }));
        } else if (result.error.message?.includes('Invalid login credentials')) {
          errorMessage = 'Email o contraseña incorrectos';
        } else if (result.error.message?.includes('Email not confirmed')) {
          errorMessage = 'Debes confirmar tu email antes de iniciar sesión. Revisa tu bandeja de entrada.';
        } else if (result.error.message?.includes('Password should be at least')) {
          errorMessage = 'La contraseña debe tener al menos 6 caracteres';
        } else if (result.error.message?.includes('Unable to validate email address')) {
          errorMessage = 'Email inválido';
        } else if (result.error.message) {
          errorMessage = result.error.message;
        }
        
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Ha ocurrido un error inesperado',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-between items-center mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackToHome}
              className="text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al inicio
            </Button>
          </div>
          <img 
            src="/lovable-uploads/e554c651-b04c-46c2-bb83-871da034773d.png" 
            alt="Proptor Logo" 
            className="w-48 mx-auto mb-4"
          />
          <CardTitle className="text-2xl">
            {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="fullName">Nombre completo</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  placeholder="Tu nombre completo"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="tucorreo@ejemplo.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder={isLogin ? "Tu contraseña" : "Mínimo 6 caracteres"}
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-blue-500 hover:bg-blue-600"
              disabled={isSubmitting}
            >
              {isSubmitting 
                ? (isLogin ? 'Iniciando...' : 'Creando cuenta...') 
                : (isLogin ? 'Iniciar Sesión' : 'Crear Cuenta')
              }
            </Button>
          </form>
          
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-500 hover:text-blue-600 text-sm"
            >
              {isLogin 
                ? '¿No tienes cuenta? Crear una' 
                : '¿Ya tienes cuenta? Iniciar sesión'
              }
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthForm;
