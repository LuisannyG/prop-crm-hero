
const AuthHeroSection = () => {
  return (
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
  );
};

export default AuthHeroSection;
