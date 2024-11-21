import React, { useState, useEffect } from 'react';
import { Clock, DollarSign, Calendar, Save, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface BusinessHours {
  day: string;
  start: string;
  end: string;
  isOpen: boolean;
}

interface HolidayRate {
  date: string;
  name: string;
  surcharge: number;
}

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState('hours');
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const [businessHours, setBusinessHours] = useState<BusinessHours[]>([
    { day: 'Monday', start: '09:00', end: '17:00', isOpen: true },
    { day: 'Tuesday', start: '09:00', end: '17:00', isOpen: true },
    { day: 'Wednesday', start: '09:00', end: '17:00', isOpen: true },
    { day: 'Thursday', start: '09:00', end: '17:00', isOpen: true },
    { day: 'Friday', start: '09:00', end: '17:00', isOpen: true },
    { day: 'Saturday', start: '10:00', end: '15:00', isOpen: true },
    { day: 'Sunday', start: '10:00', end: '15:00', isOpen: false },
  ]);

  const [holidayRates, setHolidayRates] = useState<HolidayRate[]>([]);
  const [newHoliday, setNewHoliday] = useState<HolidayRate>({
    date: '',
    name: '',
    surcharge: 8,
  });

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    try {
      const { data: hoursData, error: hoursError } = await supabase
        .from('business_hours')
        .select('*');

      if (hoursError) throw hoursError;
      if (hoursData) setBusinessHours(hoursData);

      const { data: holidayData, error: holidayError } = await supabase
        .from('holiday_rates')
        .select('*')
        .order('date', { ascending: true });

      if (holidayError) throw holidayError;
      if (holidayData) setHolidayRates(holidayData);
    } catch (error) {
      console.error('Error loading settings:', error);
      showNotification('error', 'Failed to load settings');
    }
  }

  async function saveBusinessHours() {
    try {
      setSaving(true);
      const { error } = await supabase
        .from('business_hours')
        .upsert(businessHours);

      if (error) throw error;
      showNotification('success', 'Business hours updated successfully');
    } catch (error) {
      console.error('Error saving business hours:', error);
      showNotification('error', 'Failed to save business hours');
    } finally {
      setSaving(false);
    }
  }

  async function addHolidayRate() {
    try {
      setSaving(true);
      const { error } = await supabase
        .from('holiday_rates')
        .insert(newHoliday);

      if (error) throw error;
      setHolidayRates([...holidayRates, newHoliday]);
      setNewHoliday({ date: '', name: '', surcharge: 8 });
      showNotification('success', 'Holiday rate added successfully');
    } catch (error) {
      console.error('Error adding holiday rate:', error);
      showNotification('error', 'Failed to add holiday rate');
    } finally {
      setSaving(false);
    }
  }

  function showNotification(type: 'success' | 'error', message: string) {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  }

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px">
          {[
            { id: 'hours', label: 'Business Hours', icon: Clock },
            { id: 'rates', label: 'Holiday Rates', icon: DollarSign },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`group inline-flex items-center py-4 px-6 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="w-5 h-5 mr-2" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Notification */}
        {notification && (
          <div
            className={`mb-4 p-4 rounded-lg ${
              notification.type === 'success'
                ? 'bg-green-50 text-green-800'
                : 'bg-red-50 text-red-800'
            }`}
          >
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              {notification.message}
            </div>
          </div>
        )}

        {activeTab === 'hours' && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Business Hours</h3>
            <div className="space-y-4">
              {businessHours.map((hours, index) => (
                <div key={hours.day} className="flex items-center gap-4">
                  <div className="w-32">
                    <span className="font-medium">{hours.day}</span>
                  </div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={hours.isOpen}
                      onChange={(e) => {
                        const newHours = [...businessHours];
                        newHours[index].isOpen = e.target.checked;
                        setBusinessHours(newHours);
                      }}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="ml-2 text-sm text-gray-600">Open</span>
                  </label>
                  <input
                    type="time"
                    value={hours.start}
                    onChange={(e) => {
                      const newHours = [...businessHours];
                      newHours[index].start = e.target.value;
                      setBusinessHours(newHours);
                    }}
                    disabled={!hours.isOpen}
                    className="rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  />
                  <span className="text-gray-500">to</span>
                  <input
                    type="time"
                    value={hours.end}
                    onChange={(e) => {
                      const newHours = [...businessHours];
                      newHours[index].end = e.target.value;
                      setBusinessHours(newHours);
                    }}
                    disabled={!hours.isOpen}
                    className="rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>
              ))}
            </div>
            <button
              onClick={saveBusinessHours}
              disabled={saving}
              className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:bg-purple-400"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Hours'}
            </button>
          </div>
        )}

        {activeTab === 'rates' && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Holiday Rates</h3>
            
            {/* Add New Holiday Rate */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
              <h4 className="font-medium text-gray-700">Add Holiday Rate</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date</label>
                  <input
                    type="date"
                    value={newHoliday.date}
                    onChange={(e) => setNewHoliday({ ...newHoliday, date: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Holiday Name</label>
                  <input
                    type="text"
                    value={newHoliday.name}
                    onChange={(e) => setNewHoliday({ ...newHoliday, name: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Surcharge ($)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={newHoliday.surcharge}
                    onChange={(e) => setNewHoliday({ ...newHoliday, surcharge: Number(e.target.value) })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>
              </div>
              <button
                onClick={addHolidayRate}
                disabled={saving || !newHoliday.date || !newHoliday.name}
                className="mt-4 flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:bg-purple-400"
              >
                <Calendar className="w-4 h-4" />
                {saving ? 'Adding...' : 'Add Holiday Rate'}
              </button>
            </div>

            {/* Holiday Rates List */}
            <div className="mt-6">
              <h4 className="font-medium text-gray-700 mb-4">Current Holiday Rates</h4>
              <div className="bg-white shadow overflow-hidden rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Holiday
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Surcharge
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {holidayRates.map((holiday) => (
                      <tr key={holiday.date}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(holiday.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {holiday.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${holiday.surcharge}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button
                            onClick={async () => {
                              try {
                                const { error } = await supabase
                                  .from('holiday_rates')
                                  .delete()
                                  .match({ date: holiday.date });
                                
                                if (error) throw error;
                                setHolidayRates(holidayRates.filter(h => h.date !== holiday.date));
                                showNotification('success', 'Holiday rate removed successfully');
                              } catch (error) {
                                console.error('Error removing holiday rate:', error);
                                showNotification('error', 'Failed to remove holiday rate');
                              }
                            }}
                            className="text-red-600 hover:text-red-900"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}