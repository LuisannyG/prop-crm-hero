import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import FeaturesTabSection from '@/components/FeaturesTabSection';
import DashboardNav from '@/components/DashboardNav';

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
      <div className="absolute inset-0 bg-black/20"></div>
      
      <div className="relative z-10">
        <DashboardNav />

        <main className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-center mb-4 text-white drop-shadow-lg">Bienvenido a Proptor</h2>
            <p className="text-xl text-white text-center drop-shadow-lg">
              Tu CRM inmobiliario inteligente para Perú
            </p>
          </div>

          <section className="bg-white/95 backdrop-blur-sm rounded-lg shadow-sm p-8">
            <FeaturesTabSection />
          </section>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
