
const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <h2 className="text-2xl font-bold">Proptor</h2>
            <p className="text-slate-300 mt-2">Tu CRM inmobiliario inteligente para Perú</p>
          </div>
          <div className="flex space-x-8">
            <div>
              <h3 className="font-semibold mb-2">Producto</h3>
              <ul className="space-y-2">
                <li><a href="#features" className="text-slate-300 hover:text-white transition">Funcionalidades</a></li>
                <li><a href="#pricing" className="text-slate-300 hover:text-white transition">Precios</a></li>
                <li><a href="#faq" className="text-slate-300 hover:text-white transition">Preguntas frecuentes</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Contacto</h3>
              <ul className="space-y-2">
                <li><a href="mailto:info@proptor.com.pe" className="text-slate-300 hover:text-white transition">info@proptor.com.pe</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="border-t border-slate-800 mt-8 pt-8 text-center">
          <p className="text-slate-400">© {new Date().getFullYear()} Proptor. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
