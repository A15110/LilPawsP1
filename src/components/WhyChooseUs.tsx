import React from 'react';
import { Heart, MessageSquare, Clock, Shield, Zap, Home } from 'lucide-react';

const reasons = [
  {
    icon: Heart,
    title: 'Personalized Care',
    description: 'Every pet receives individual attention tailored to their unique needs'
  },
  {
    icon: MessageSquare,
    title: 'Custom Updates',
    description: 'Regular photos and updates about your pet\'s activities'
  },
  {
    icon: Clock,
    title: 'Direct Booking',
    description: 'Easy scheduling without third-party complications'
  },
  {
    icon: Shield,
    title: 'Safe Environment',
    description: 'Fully insured and certified pet care professionals'
  },
  {
    icon: Zap,
    title: 'Emergency Available',
    description: '24/7 support for unexpected situations'
  },
  {
    icon: Home,
    title: 'Flexible Options',
    description: 'Services that adapt to your schedule and needs'
  }
];

export default function WhyChooseUs() {
  return (
    <section className="py-20 bg-purple-50">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-4">Why Choose Us</h2>
        <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
          Experience the Little Paws difference with our dedicated team of pet care professionals
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reasons.map((reason, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <reason.icon className="w-8 h-8 text-purple-600 mr-3" />
                <h3 className="text-xl font-semibold">{reason.title}</h3>
              </div>
              <p className="text-gray-600">{reason.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}