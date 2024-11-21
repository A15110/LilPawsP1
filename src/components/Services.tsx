import React, { useState } from 'react';
import { DogIcon, HomeIcon, Clock, CalendarDays, SunMedium, ShieldCheck, DollarSignIcon, CameraIcon, Percent } from 'lucide-react';

const services = [
  {
    icon: DogIcon,
    title: 'Dog Walking',
    basePrice: 19,
    description: 'Professional, attentive walks tailored to your dog\'s needs'
  },
  {
    icon: HomeIcon,
    title: 'Pet Boarding',
    basePrice: 40,
    description: 'Cozy, home-like environment for overnight stays'
  },
  {
    icon: Clock,
    title: 'House Sitting',
    basePrice: 50,
    description: 'Dedicated care in your pet\'s familiar environment'
  },
  {
    icon: CalendarDays,
    title: 'Drop-in Visits',
    basePrice: 22,
    description: '30-min ($22) or 1-hour ($35) visits for feeding and play'
  },
  {
    icon: SunMedium,
    title: 'Pet Day Care',
    basePrice: 35,
    description: 'Full day of supervised fun and socialization'
  },
  {
    icon: CameraIcon,
    title: 'Photo Updates',
    basePrice: 'Free',
    description: 'Photos of your best friend are included for free',
    customPrice: true
  },
  {
    icon: ShieldCheck,
    title: 'Emergency Care',
    basePrice: 0,
    description: '24/7 availability for unexpected situations',
    customPrice: true
  },
  {
    icon: DollarSignIcon,
    title: 'Holiday And Disaster',
    basePrice: 8,
    description: 'Increased price for Holiday rates',
    customPrice: true
  },
  {
    icon: Percent,
    title: 'Booking Deposit',
    basePrice: '50%',
    description: 'Help secure your spot on the calandar',
    customPrice: true
  }

  
];

export default function Services() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <section id="services" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-4">Our Services</h2>
        <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
          Comprehensive pet care services tailored to your furry friend's needs
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <service.icon className="w-12 h-12 text-purple-600 mb-4" />
              <h3 className="text-xl font-bold mb-2">{service.title}</h3>
              <p className="text-purple-600 font-bold text-2xl mb-3">
                {service.customPrice ? 'Custom rates' : `$${service.basePrice}/service`}
              </p>
              <p className="text-gray-600">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}