
import TestimonialCard from "@/components/TestimonialCard";

interface TestimonialsSectionProps {
  testimonials: Array<{
    name: string;
    position: string;
    content: string;
    avatar: string;
  }>;
}

const TestimonialsSection = ({ testimonials }: TestimonialsSectionProps) => {
  return (
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
  );
};

export default TestimonialsSection;
