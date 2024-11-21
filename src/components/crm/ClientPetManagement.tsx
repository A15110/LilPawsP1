import React, { useState, useEffect } from 'react';
import { Plus, ChevronDown, ChevronRight, PawPrint, Calendar, Edit2, Trash2, Search } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import AddClientForm from './AddClientForm';

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  emergency_contact: string;
  emergency_phone: string;
  pets: Pet[];
}

interface Pet {
  id: string;
  name: string;
  type: string;
  breed: string;
  age: number;
  medical_info: string;
  feeding_instructions: string;
  behavioral_notes: string;
  client_id: string;
}

interface Booking {
  id: string;
  pet_id: string;
  service_type: string;
  start_date: string;
  end_date: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  total_price: number;
}

export default function ClientPetManagement() {
  const [clients, setClients] = useState<Client[]>([]);
  const [expandedClient, setExpandedClient] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [bookings, setBookings] = useState<Record<string, Booking[]>>({});
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch clients with their pets
      const { data: clientsData, error: clientsError } = await supabase
        .from('clients')
        .select(`
          *,
          pets (*)
        `);

      if (clientsError) throw clientsError;

      // Fetch all bookings
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select('*')
        .order('start_date', { ascending: false });

      if (bookingsError) throw bookingsError;

      // Organize bookings by pet_id
      const bookingsByPet = bookingsData.reduce((acc: Record<string, Booking[]>, booking) => {
        if (!acc[booking.pet_id]) {
          acc[booking.pet_id] = [];
        }
        acc[booking.pet_id].push(booking);
        return acc;
      }, {});

      setClients(clientsData || []);
      setBookings(bookingsByPet);
    } catch (error: any) {
      console.error('Error fetching data:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  const handleDeleteClient = async (clientId: string) => {
    if (!confirm('Are you sure you want to delete this client? This will also delete all associated pets and bookings.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', clientId);

      if (error) throw error;

      setClients(clients.filter(client => client.id !== clientId));
    } catch (error: any) {
      console.error('Error deleting client:', error);
      alert('Failed to delete client');
    }
  };

  const handleDeletePet = async (petId: string, clientId: string) => {
    if (!confirm('Are you sure you want to delete this pet? This will also delete all associated bookings.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('pets')
        .delete()
        .eq('id', petId);

      if (error) throw error;

      setClients(clients.map(client => {
        if (client.id === clientId) {
          return {
            ...client,
            pets: client.pets.filter(pet => pet.id !== petId)
          };
        }
        return client;
      }));
    } catch (error: any) {
      console.error('Error deleting pet:', error);
      alert('Failed to delete pet');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        Error: {error}
      </div>
    );
  }

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.pets.some(pet => 
      pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pet.type.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-xl font-bold text-gray-800">Client & Pet Management</h2>
          <button
            onClick={() => setShowAddForm(true)}
            className="w-full sm:w-auto bg-purple-600 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-purple-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add New Client
          </button>
        </div>

        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search clients and pets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
        </div>
      </div>

      {showAddForm && (
        <AddClientForm
          onClose={() => setShowAddForm(false)}
          onSuccess={() => {
            setShowAddForm(false);
            fetchData();
          }}
        />
      )}

      <div className="p-6">
        <div className="space-y-4">
          {filteredClients.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No clients found. Add a new client to get started.
            </div>
          ) : (
            filteredClients.map((client) => (
              <div key={client.id} className="border rounded-lg overflow-hidden">
                <div
                  className="flex items-center justify-between p-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => setExpandedClient(expandedClient === client.id ? null : client.id)}
                >
                  <div className="flex items-center gap-4">
                    {expandedClient === client.id ? (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-500" />
                    )}
                    <div>
                      <h3 className="font-semibold text-gray-900">{client.name}</h3>
                      <p className="text-sm text-gray-500">{client.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClient(client.id);
                      }}
                      className="text-red-600 hover:text-red-700 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <span className="text-sm text-gray-500">
                      {client.pets.length} pets
                    </span>
                  </div>
                </div>

                {expandedClient === client.id && (
                  <div className="p-4 space-y-4">
                    {client.pets.map((pet) => (
                      <div key={pet.id} className="bg-white p-4 rounded-lg border">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-3">
                            <PawPrint className="w-6 h-6 text-purple-500" />
                            <div>
                              <h4 className="font-semibold text-gray-900">{pet.name}</h4>
                              <p className="text-sm text-gray-500">
                                {pet.type} • {pet.breed} • {pet.age} years old
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleDeletePet(pet.id, client.id)}
                            className="text-red-600 hover:text-red-700 p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {bookings[pet.id]?.length > 0 && (
                          <div className="mt-4">
                            <h5 className="text-sm font-semibold text-gray-700 mb-2">
                              Recent Bookings
                            </h5>
                            <div className="space-y-2">
                              {bookings[pet.id].slice(0, 3).map((booking) => (
                                <div
                                  key={booking.id}
                                  className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded"
                                >
                                  <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-gray-500" />
                                    <span>{booking.service_type}</span>
                                  </div>
                                  <div className="flex items-center gap-4">
                                    <span className="text-gray-500">
                                      {new Date(booking.start_date).toLocaleDateString()}
                                    </span>
                                    <span className={`px-2 py-1 rounded-full text-xs ${
                                      booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                                      booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                      booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                      'bg-blue-100 text-blue-800'
                                    }`}>
                                      {booking.status}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {pet.medical_info && (
                          <div className="mt-4 text-sm text-gray-600 bg-yellow-50 p-3 rounded">
                            <strong>Medical Info:</strong> {pet.medical_info}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}