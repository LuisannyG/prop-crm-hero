
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    agentType: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "¡Gracias por tu interés!",
        description: "Te hemos añadido a nuestra lista de espera. Te contactaremos pronto.",
      });
      setFormData({ name: "", email: "", agentType: "" });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre completo</Label>
            <Input 
              id="name" 
              name="name"
              placeholder="Tu nombre"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          
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
            <Label htmlFor="agentType">Tipo de agente</Label>
            <select 
              id="agentType"
              name="agentType"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={formData.agentType}
              onChange={handleChange}
              required
            >
              <option value="">Seleccionar...</option>
              <option value="independiente">Agente Independiente</option>
              <option value="inmobiliaria">Pequeña Inmobiliaria</option>
              <option value="otro">Otro</option>
            </select>
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-blue-500 hover:bg-blue-600"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Enviando..." : "Quiero usar Proptor"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ContactForm;
