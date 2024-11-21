import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Instagram } from 'lucide-react';
import Hero from './components/Hero';
import Services from './components/Services';
import WhyChooseUs from './components/WhyChooseUs';
import Contact from './components/Contact';
import Reviews from './components/Reviews';
import LocalBranding from './components/LocalBranding';
import AdminPanel from './components/AdminPanel';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './lib/AuthContext';
import Navigation from './components/Navigation';
import LOGO_URL from './logo.png'; 

//const LOGO_URL = 'https://lh3.googleusercontent.com/IU2u14cVt2eXMIiJABpW90MzASqpcS4o06VRR0tSfEICridpLzTgn-5RZLFvJCi1k_Q2iBCrgNhHnqciaMn16IA=w16383';

function App() {
  const { user } = useAuth();

  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Navigation user={user} logoUrl={LOGO_URL} />
        
        <Routes>
          <Route path="/login" element={user ? <Navigate to="/admin" replace /> : <Login />} />
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminPanel />
            </ProtectedRoute>
          } />
          <Route path="/" element={
            <main>
              <Hero />
              <LocalBranding />
              <Services id="services" />
              <WhyChooseUs />
              <Reviews />
              <Contact />
            </main>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        <footer className="bg-gradient-to-r from-primary-900 to-secondary-900 text-white py-12">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center justify-center gap-6">
              <div className="h-16 w-16 rounded-full border-2 border-white/20 overflow-hidden">
                <img 
                  src={LOGO_URL}
                  alt="Little Paws JAX"
                  className="h-full w-full object-cover"
                />
              </div>
              
              <div className="flex flex-col items-center gap-4">
                <div className="flex items-center gap-6">
                  <a 
                    href="https://www.instagram.com/littlepawsjax" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-white/90 hover:text-white transition-colors"
                  >
                    <Instagram className="w-8 h-8" />
                  </a>
                  <a 
                    href="https://www.tiktok.com/@littlepawsJAX" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-white/90 hover:text-white transition-colors"
                  >
                    <svg 
                      viewBox="0 0 24 24" 
                      className="w-8 h-8 fill-current"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                    </svg>
                  </a>
                </div>
                <a 
                  href="mailto:Info@LittlePawsJax.com" 
                  className="text-white/90 hover:text-white transition-colors"
                >
                  Info@LittlePawsJax.com
                </a>
              </div>

              <div className="text-center mt-4">
                <p className="text-white/90">© {new Date().getFullYear()} Little Paws Jacksonville</p>
                <p className="text-white/80 text-sm">Serving Jacksonville's Furry Friends with Love</p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;