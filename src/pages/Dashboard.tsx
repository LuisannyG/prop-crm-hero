
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import DashboardStats from '@/components/DashboardStats';
import DashboardModules from '@/components/DashboardModules';
import { LogOut, User } from 'lucide-react';

const Dashboard = () => {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header with user info and logout */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <img 
                src="/lovable-uploads/c4d29766-05b3-4827-aa8f-04a07ab56aa9.png" 
                alt="Proptor Logo" 
                className="h-8"
              />
              <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-gray-600">
                <User className="h-4 w-4" />
                <span className="text-sm">{user?.email}</span>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleSignOut}
                className="text-gray-600 border-gray-300 hover:bg-gray-50"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            ¡Bienvenido a Proptor!
          </h2>
          <p className="text-gray-600 text-lg">
            Tu CRM inmobiliario inteligente está listo para ayudarte a gestionar tus clientes y propiedades.
          </p>
        </div>

        {/* Stats Cards */}
        <DashboardStats />

        {/* Modules Section */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            Módulos Disponibles
          </h3>
          <DashboardModules />
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Acciones Rápidas
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="bg-blue-500 hover:bg-blue-600">
              Agregar Cliente
            </Button>
            <Button className="bg-green-500 hover:bg-green-600">
              Nueva Propiedad
            </Button>
            <Button className="bg-purple-500 hover:bg-purple-600">
              Programar Cita
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
