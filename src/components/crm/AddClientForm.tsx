import React, { useState } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface AddClientFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddClientForm({ onClose, onSuccess }: AddClientFormProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [clientData, setClientData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    emergency_contact: '',
    emergency_phone: ''
  });

  const [petData, setPetData] = useState({
    name: '',
    type: '',
    breed: '',
    age: '',
    medical_info: '',
    feeding_instructions: '',
    behavioral_notes: ''
  });

  const handleClientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setClientData({ ...clientData, [e.target.name]: e.target.value });
  };

  const handlePetChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setPetData({ ...petData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Insert client
      const { data: clientResult, error: clientError } = await supabase
        .from('clients')
        .insert(clientData)
        .select()
        .single();

      if (clientError) throw clientError;

      // Insert pet with client_id
      const { error: petError } = await supabase
        .from('pets')
        .insert({
          ...petData,
          client_id: clientResult.id,
          age: parseInt(petData.age)
        });

      if (petError) throw petError;

      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Error adding client/pet:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {step === 1 ? 'Add New Client' : 'Add Pet Information'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 1 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={clientData.name}
                      onChange={handleClientChange}
                      className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={clientData.email}
                      onChange={handleClientChange}
                      className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={clientData.phone}
                      onChange={handleClientChange}
                      className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      required
                      value={clientData.address}
                      onChange={handleClientChange}
                      className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Emergency Contact
                    </label>
                    <input
                      type="text"
                      name="emergency_contact"
                      required
                      value={clientData.emergency_contact}
                      onChange={handleClientChange}
                      className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Emergency Phone
                    </label>
                    <input
                      type="tel"
                      name="emergency_phone"
                      required
                      value={clientData.emergency_phone}
                      onChange={handleClientChange}
                      className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Next: Pet Information
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Pet Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={petData.name}
                      onChange={handlePetChange}
                      className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Type
                    </label>
                    <select
                      name="type"
                      required
                      value={petData.type}
                      onChange={handlePetChange}
                      className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500"
                    >
                      <option value="">Select type</option>
                      <option value="Dog">Dog</option>
                      <option value="Cat">Cat</option>
                      <option value="Bird">Bird</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Breed
                    </label>
                    <input
                      type="text"
                      name="breed"
                      value={petData.breed}
                      onChange={handlePetChange}
                      className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Age
                    </label>
                    <input
                      type="number"
                      name="age"
                      min="0"
                      max="30"
                      required
                      value={petData.age}
                      onChange={handlePetChange}
                      className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Medical Information
                  </label>
                  <textarea
                    name="medical_info"
                    rows={3}
                    value={petData.medical_info}
                    onChange={handlePetChange}
                    className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Any medical conditions, medications, or special needs"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Feeding Instructions
                  </label>
                  <textarea
                    name="feeding_instructions"
                    rows={3}
                    value={petData.feeding_instructions}
                    onChange={handlePetChange}
                    className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Feeding schedule, portions, dietary restrictions"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Behavioral Notes
                  </label>
                  <textarea
                    name="behavioral_notes"
                    rows={3}
                    value={petData.behavioral_notes}
                    onChange={handlePetChange}
                    className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Temperament, training, special handling instructions"
                  />
                </div>

                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:bg-purple-400"
                  >
                    {loading ? 'Adding...' : 'Add Client & Pet'}
                  </button>
                </div>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}