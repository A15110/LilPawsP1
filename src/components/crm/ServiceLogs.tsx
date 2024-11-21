import React, { useState, useEffect } from 'react';
import { Calendar, Search, FileText } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface ServiceLog {
  id: string;
  booking_id: string;
  log_date: string;
  notes: string;
  photos: string[];
  created_at: string;
  booking?: {
    client_name: string;
    pet_type: string;
    service_type: string;
  };
}

export default function ServiceLogs() {
  const [logs, setLogs] = useState<ServiceLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchLogs();
  }, []);

  async function fetchLogs() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('service_logs')
        .select(`
          *,
          booking:bookings (
            client_name,
            pet_type,
            service_type
          )
        `)
        .order('log_date', { ascending: false });

      if (error) throw error;
      setLogs(data || []);
    } catch (err: any) {
      console.error('Error fetching service logs:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const filteredLogs = logs.filter(log =>
    log.booking?.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.notes?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        Error loading service logs: {error}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Service Logs</h2>
          <button
            onClick={() => {/* Add new log modal */}}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-purple-700 transition-colors"
          >
            <FileText className="w-4 h-4" />
            Add Log
          </button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
        </div>
      </div>

      <div className="p-6">
        <div className="space-y-6">
          {filteredLogs.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No service logs found.
            </div>
          ) : (
            filteredLogs.map((log) => (
              <div key={log.id} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {log.booking?.client_name}'s {log.booking?.pet_type}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {log.booking?.service_type}
                    </p>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(log.log_date).toLocaleDateString()}
                  </div>
                </div>
                
                <p className="text-gray-700 mb-4">{log.notes}</p>

                {log.photos && log.photos.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {log.photos.map((photo, index) => (
                      <div key={index} className="aspect-square rounded-lg overflow-hidden">
                        <img
                          src={photo}
                          alt={`Service log photo ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
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