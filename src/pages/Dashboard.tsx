
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import FeaturesTabSection from '@/components/FeaturesTabSection';

const Dashboard = () => {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-fixed relative"
      style={{
        backgroundImage: `url('/lovable-uploads/37f332b3-089c-47ec-bafc-0ede8b679343.png')`
      }}
    >
      {/* Overlay for better readability */}
      <div className="absolute inset-0 bg-black/20"></div>
      
      <div className="relative z-10">
        {/* Header */}
        <header className="bg-white/95 backdrop-blur-sm shadow-sm border-b">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <img 
                src="/lovable-uploads/bf2605cc-bd63-49db-9eb1-655d60adffc4.png" 
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
            <h2 className="text-3xl font-bold text-center mb-4 text-white drop-shadow-lg">Bienvenido a Proptor</h2>
            <p className="text-xl text-white text-center drop-shadow-lg">
              Tu CRM inmobiliario inteligente para Perú
            </p>
          </div>

          {/* Features Section */}
          <section className="bg-white/95 backdrop-blur-sm rounded-lg shadow-sm p-8">
            <FeaturesTabSection />
          </section>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
