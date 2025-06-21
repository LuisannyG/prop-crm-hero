
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import FeaturesTabSection from '@/components/FeaturesTabSection';

const Dashboard = () => {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <img 
              src="/lovable-uploads/94f300e7-f28f-4112-b26a-35b332c36ccf.png" 
              alt="Proptor Logo" 
              className="h-10"
            />
            <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">Hola, {user?.user_metadata?.full_name || user?.email}</span>
            <Button 
              onClick={handleSignOut}
              variant="outline"
              size="sm"
            >
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-center mb-4">Bienvenido a Proptor</h2>
          <p className="text-xl text-gray-600 text-center">
            Tu CRM inmobiliario inteligente para Perú
          </p>
        </div>

        {/* Features Section */}
        <section className="bg-white rounded-lg shadow-sm p-8">
          <FeaturesTabSection />
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
