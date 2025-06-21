
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Users, 
  Building, 
  Bell, 
  Brain, 
  Shield,
  LogOut,
  User
} from 'lucide-react';

const DashboardNav = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const navItems = [
    { path: '/contacts', icon: Users, label: 'Contactos', color: 'text-green-600' },
    { path: '/properties', icon: Building, label: 'Propiedades', color: 'text-purple-600' },
    { path: '/reminders', icon: Bell, label: 'Recordatorios', color: 'text-orange-600' },
    { path: '/learning-engine', icon: Brain, label: 'Motor IA', color: 'text-pink-600', isPaid: true },
    { path: '/risk-detection', icon: Shield, label: 'Detección Riesgo', color: 'text-red-600', isPaid: true },
  ];

  return (
    <div className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-8">
            <div className="flex items-center">
              <img 
                src="/lovable-uploads/bf2605cc-bd63-49db-9eb1-655d60adffc4.png" 
                alt="Proptor Logo" 
                className="h-8 cursor-pointer"
                onClick={() => navigate('/dashboard')}
              />
            </div>
            
            <nav className="flex space-x-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                
                return (
                  <Button
                    key={item.path}
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    onClick={() => navigate(item.path)}
                    className={`relative ${isActive ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`}
                  >
                    <Icon className={`w-4 h-4 mr-2 ${isActive ? 'text-white' : item.color}`} />
                    {item.label}
                    {item.isPaid && (
                      <span className="absolute -top-1 -right-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                        ✨
                      </span>
                    )}
                  </Button>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-gray-600">
              <User className="w-4 h-4" />
              <span className="text-sm">
                {user?.user_metadata?.full_name || user?.email}
              </span>
            </div>
            <Button 
              onClick={handleSignOut}
              variant="outline"
              size="sm"
              className="text-gray-600 hover:text-gray-800"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Salir
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardNav;
