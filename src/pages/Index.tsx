
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, ChartBar, FileText, FileUser, Brain, BadgeDollarSign, BadgeInfo, Users } from "lucide-react";
import Hero from "@/components/Hero";
import FeatureCard from "@/components/FeatureCard";
import BenefitCard from "@/components/BenefitCard";
import PricingCard from "@/components/PricingCard";
import TestimonialCard from "@/components/TestimonialCard";
import ContactForm from "@/components/ContactForm";
import FAQSection from "@/components/FAQSection";

const Index = () => {
  const [showBetaMessage, setShowBetaMessage] = useState(false);
  
  const features = [
    {
      title: "Agenda Inteligente",
      icon: Calendar,
      description: "Recordatorios automáticos para dar seguimiento a tus leads. Notificaciones según prioridad, tiempo sin contacto y etapa del proceso."
    },
    {
      title: "Panel de Control",
      icon: ChartBar,
      description: "Segmentación de clientes por tipo. Clasificación por nivel de intención de compra. Visualización por etapa del embudo."
    },
    {
      title: "Registro de Motivos de No Compra",
      icon: FileText,
      description: "Formulario interno con opciones seleccionables y campo de texto libre. Documenta razones de pérdida."
    },
    {
      title: "Reportes Automáticos",
      icon: ChartBar,
      description: "Para pequeñas inmobiliarias: desempeño del equipo. Para agentes independientes: rendimiento por canal."
    },
    {
      title: "Ficha de Cliente Integrada",
      icon: FileUser,
      description: "Datos básicos: nombre, contacto, tipo de propiedad buscada. Subida de archivos: DNI, ficha técnica, imágenes."
    },
    {
      title: "Motor de Aprendizaje",
      icon: Brain,
      description: "La app analiza datos históricos para detectar patrones de comportamiento. Aprende con cada registro y mejora sus predicciones."
    },
    {
      title: "Detección de Riesgo de No Compra",
      icon: BadgeInfo,
      description: "Considera interacción previa, tiempo sin respuesta y etapa actual en el proceso de venta."
    }
  ];

  const benefits = [
    {
      title: "Aumenta la tasa de cierre",
      description: "Mejora tus resultados con seguimiento constante y organizado."
    },
    {
      title: "Menos olvidos, más oportunidades",
      description: "Nunca pierdas una oportunidad de venta por falta de seguimiento."
    },
    {
      title: "Todo tu proceso organizado",
      description: "Centraliza toda tu información de ventas en un solo lugar."
    }
  ];

  const plans = [
    {
      name: "Plan Gratuito",
      price: "0€",
      features: ["Ficha de cliente", "Panel básico", "Agenda básica"],
      buttonText: "Empieza ahora",
      highlighted: false
    },
    {
      name: "Plan Premium",
      price: "29€",
      features: ["Todo lo del plan gratuito", "Reportes automáticos", "Motor de aprendizaje", "Detección de riesgo"],
      buttonText: "Ver precios",
      highlighted: true
    }
  ];

  const testimonials = [
    {
      name: "María Rodríguez",
      position: "Agente Independiente",
      content: "Desde que uso Proptor he aumentado mis ventas en un 30%. La agenda inteligente me permite dar seguimiento a más clientes sin olvidar ninguno.",
      avatar: "/placeholder.svg"
    },
    {
      name: "Carlos Méndez",
      position: "Director de Inmobiliaria",
      content: "Proptor ha transformado cómo gestionamos nuestros leads. El panel de control nos da visibilidad total sobre nuestro pipeline.",
      avatar: "/placeholder.svg"
    },
    {
      name: "Laura Sánchez",
      position: "Agente Senior",
      content: "Los reportes automáticos me permiten identificar qué canales me traen los mejores clientes. Una herramienta imprescindible.",
      avatar: "/placeholder.svg"
    }
  ];

  const faqs = [
    {
      question: "¿Qué es Proptor?",
      answer: "Proptor es un CRM diseñado específicamente para agentes inmobiliarios y pequeñas inmobiliarias que facilita la gestión de clientes, seguimiento y cierre de ventas."
    },
    {
      question: "¿Necesito conocimientos técnicos para usar Proptor?",
      answer: "No, Proptor está diseñado para ser intuitivo y fácil de usar. No requiere conocimientos técnicos especiales."
    },
    {
      question: "¿Puedo probar Proptor antes de pagar?",
      answer: "Sí, ofrecemos un plan gratuito con funcionalidades básicas para que puedas probar la plataforma sin compromiso."
    },
    {
      question: "¿Cómo puedo solicitar una demo?",
      answer: "Puedes solicitar una demo personalizada a través de nuestro formulario de contacto o haciendo clic en 'Solicita una demo'."
    },
    {
      question: "¿Puedo migrar mis datos desde otro CRM?",
      answer: "Sí, ofrecemos asistencia para migrar tus datos desde otros sistemas al contratar el plan premium."
    }
  ];

  const handleCtaClick = () => {
    setShowBetaMessage(true);
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth"
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <Hero onCtaClick={handleCtaClick} />

      {/* Feature Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Funcionalidades de Proptor</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard 
                key={index}
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Beneficios de usar Proptor</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <BenefitCard 
                key={index}
                title={benefit.title}
                description={benefit.description}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Planes y Precios</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {plans.map((plan, index) => (
              <PricingCard 
                key={index}
                name={plan.name}
                price={plan.price}
                features={plan.features}
                buttonText={plan.buttonText}
                highlighted={plan.highlighted}
                onCtaClick={handleCtaClick}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Lo que dicen nuestros usuarios</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard 
                key={index}
                name={testimonial.name}
                position={testimonial.position}
                content={testimonial.content}
                avatar={testimonial.avatar}
              />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Preguntas Frecuentes</h2>
          <FAQSection faqs={faqs} />
        </div>
      </section>

      {/* Contact Form with Beta Message */}
      <section id="contact" className="py-20">
        <div className="container mx-auto px-4 max-w-lg">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">¡Únete a Proptor!</h2>
          
          {showBetaMessage && (
            <Card className="mb-8 border-blue-500">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-center mb-4 text-blue-700">Proptor está actualmente en fase Beta</h3>
                <p className="text-center mb-4">Estamos trabajando duro para lanzar pronto. Regístrate en nuestra lista de espera para ser de los primeros en probar Proptor.</p>
              </CardContent>
            </Card>
          )}
          
          <ContactForm />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h2 className="text-2xl font-bold">Proptor</h2>
              <p className="text-slate-300 mt-2">Tu CRM inmobiliario inteligente</p>
            </div>
            <div className="flex space-x-8">
              <div>
                <h3 className="font-semibold mb-2">Producto</h3>
                <ul className="space-y-2">
                  <li><a href="#features" className="text-slate-300 hover:text-white transition">Funcionalidades</a></li>
                  <li><a href="#pricing" className="text-slate-300 hover:text-white transition">Precios</a></li>
                  <li><a href="#faq" className="text-slate-300 hover:text-white transition">FAQ</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Contacto</h3>
                <ul className="space-y-2">
                  <li><a href="mailto:info@proptor.com" className="text-slate-300 hover:text-white transition">info@proptor.com</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 text-center">
            <p className="text-slate-400">© {new Date().getFullYear()} Proptor. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
