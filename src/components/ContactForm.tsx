
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "+51 ",
    agentType: "",
    willingToPay: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Ensure phone always starts with +51
    if (name === "phone") {
      if (!value.startsWith("+51")) {
        setFormData(prev => ({ ...prev, [name]: "+51 " + value.replace("+51", "").trim() }));
        return;
      }
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRadioChange = (value: string) => {
    setFormData(prev => ({ ...prev, willingToPay: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .insert([
          {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            agent_type: formData.agentType,
            willing_to_pay: formData.willingToPay === "yes",
          }
        ]);

      if (error) {
        console.error('Error saving contact submission:', error);
        toast({
          title: "Error",
          description: "Hubo un problema al enviar tu solicitud. Por favor, inténtalo de nuevo.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "¡Gracias por tu interés!",
          description: "Te hemos añadido a nuestra lista de espera. Te contactaremos pronto.",
        });
        setFormData({ name: "", email: "", phone: "+51 ", agentType: "", willingToPay: "" });
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Error",
        description: "Hubo un problema al enviar tu solicitud. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
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
            <Label htmlFor="phone">Número de teléfono</Label>
            <Input 
              id="phone" 
              name="phone"
              type="tel"
              placeholder="+51 987 654 321"
              value={formData.phone}
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
              <option value="independiente">Agentes Inmobiliarios Independientes</option>
              <option value="pequena_empresa">Pequeñas Empresas Inmobiliarias</option>
            </select>
          </div>
          
          <div className="space-y-3">
            <Label>¿Estarías dispuesto a pagar por funcionalidades avanzadas?</Label>
            <RadioGroup value={formData.willingToPay} onValueChange={handleRadioChange}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="yes" />
                <Label htmlFor="yes">Sí</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="no" />
                <Label htmlFor="no">No</Label>
              </div>
            </RadioGroup>
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
