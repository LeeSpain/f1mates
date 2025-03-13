
import React from 'react';

interface Testimonial {
  quote: string;
  author: string;
}

export const TestimonialSection: React.FC = () => {
  const testimonials: Testimonial[] = [
    {
      quote: "F1 Mate Racer has transformed how our friend group watches F1. The banter and competition are next level!",
      author: "Mike T., Longtime F1 Fan"
    },
    {
      quote: "The perfect mix of strategy and fun. Our office league is the highlight of every race weekend now.",
      author: "Sarah W., New F1 Enthusiast"
    },
    {
      quote: "The Group C underdog points system is genius. Nothing better than when your backmarker scores and ruins your mates' weekends!",
      author: "James R., Fantasy Sports Player"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-f1-darkBlue/50 to-black/50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">What Players Say</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="glassmorphism p-6 rounded-lg">
              <div className="text-f1-red text-5xl font-serif mb-4">"</div>
              <p className="text-gray-300 mb-4 italic">{testimonial.quote}</p>
              <p className="text-right font-medium">— {testimonial.author}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
