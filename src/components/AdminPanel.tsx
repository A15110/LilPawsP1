import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, PawPrint, ClipboardList, Settings, Menu, X } from 'lucide-react';
import ClientPetManagement from './crm/ClientPetManagement';
import BookingManagement from './crm/BookingManagement';
import ServiceLogs from './crm/ServiceLogs';
import { useAuth } from '../lib/AuthContext';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('clients');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const tabs = [
    { id: 'clients', label: 'Clients & Pets', icon: Users },
    { id: 'bookings', label: 'Bookings', icon: Calendar },
    { id: 'logs', label: 'Service Logs', icon: ClipboardList },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'clients':
        return <ClientPetManagement />;
      case 'bookings':
        return <BookingManagement />;
      case 'logs':
        return <ServiceLogs />;
      case 'settings':
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold mb-4">Settings</h3>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-2">Account Information</h4>
                <p className="text-gray-600">Email: {user.email}</p>
                <p className="text-gray-600">Role: Administrator</p>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 bg-white rounded-lg shadow-lg"
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6 text-gray-600" />
          ) : (
            <Menu className="w-6 h-6 text-gray-600" />
          )}
        </button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`
          fixed top-0 left-0 h-screen bg-white shadow-lg z-40
          lg:w-64 transition-all duration-300 ease-in-out
          ${mobileMenuOpen ? 'w-64 translate-x-0' : 'w-0 -translate-x-full lg:translate-x-0'}
          overflow-hidden
        `}>
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">Admin Dashboard</h2>
            <p className="text-sm text-gray-500">CRM Management</p>
          </div>
          <nav className="mt-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left ${
                  activeTab === tab.id
                    ? 'bg-purple-50 text-purple-700 border-r-4 border-purple-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-left text-red-600 hover:bg-red-50 mt-4"
            >
              <Settings className="w-5 h-5" />
              Logout
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-64 p-4 lg:p-8 mt-16 lg:mt-0">
          {renderTabContent()}
        </main>
      </div>

      {/* Overlay for mobile menu */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}