import React from 'react';
import { MapPin, Compass, Heart, Shield } from 'lucide-react';

export default function LocalBranding() {
  return (
    <section className="py-12 bg-primary-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex items-center gap-4">
            <MapPin className="w-8 h-8 text-primary-600" />
            <div>
              <h3 className="font-semibold">Locally Owned</h3>
              <p className="text-sm text-gray-600">Proudly serving all JAX areas</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Compass className="w-8 h-8 text-primary-600" />
            <div>
              <h3 className="font-semibold">Service Area</h3>
              <p className="text-sm text-gray-600">All Jacksonville neighborhoods</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Heart className="w-8 h-8 text-primary-600" />
            <div>
              <h3 className="font-semibold">Community First</h3>
              <p className="text-sm text-gray-600">Supporting local shelters</p>
            </div>
          </div>
          
          {/*  <div className="flex items-center gap-4">
            <Shield className="w-8 h-8 text-primary-600" />
            <div>
              <h3 className="font-semibold">Fully Insured</h3>
              <p className="text-sm text-gray-600"> Committed to the safety of your pets</p>
            </div>
  </div> */}
        </div>
      </div>
    </section>
  );
}