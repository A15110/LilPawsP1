import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Calendar, MessageCircle, ShieldCheck, LogIn, LogOut, PawPrint } from 'lucide-react';
import { User } from '@supabase/auth-helpers-react';
import { useAuth } from '../lib/AuthContext';
import LOGO_URL from './logo.png'; 

interface NavigationProps {
  user: User | null;
}

//const LOGO_URL = 'https://lh4.googleusercontent.com/6i7_lML-JG9kSgzWJAk7xBSAhTq4lVPb0g1XUDTxCay-D5DjNXCEKdPyW3lRrAUqyb01mYqbMlR18TkNx-39Zw=w1280';

export default function Navigation({ user }: NavigationProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [logoError, setLogoError] = useState(false);

  const navLinks = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/services', icon: Calendar, label: 'Services' },
    { to: '/contact', icon: MessageCircle, label: 'Contact' }
  ];

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="fixed w-full bg-gradient-to-r from-primary-600 to-secondary-600 z-50 shadow-lg backdrop-blur-sm bg-opacity-90">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-full border-2 border-white/20 overflow-hidden bg-primary-700">
              {!logoError ? (
                <img 
                  src={LOGO_URL}
                  alt="Little Paws JAX"
                  className="h-full w-full object-cover"
                  onError={() => setLogoError(true)}
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center">
                  <PawPrint className="w-6 h-6 text-white" />
                </div>
              )}
            </div>
            <span className="text-white font-bold text-lg  sm:block">Little Paws JAX</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className={`nav-link text-white/90 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                  location.pathname === link.to ? 'bg-white/10' : ''
                }`}
              >
                <link.icon className="w-4 h-4" />
                <span>{link.label}</span>
              </Link>
            ))}
            {user ? (
              <>
                <Link
                  to="/admin"
                  className="nav-link text-white/90 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Admin</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="nav-link text-white/90 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="nav-link text-white/90 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors"
              >
                <LogIn className="w-4 h-4" />
                <span>Login</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button 
          <button className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>*/}
        </div>
      </div>
    </nav>
  );
}