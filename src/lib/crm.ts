import { getDb } from './db';
import { z } from 'zod';

// Validation schemas
const clientSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  address: z.string().optional()
});

const petSchema = z.object({
  clientId: z.number(),
  name: z.string().min(1),
  type: z.string(),
  breed: z.string().optional(),
  age: z.number().optional(),
  medicalInfo: z.string().optional(),
  notes: z.string().optional()
});

const bookingSchema = z.object({
  clientId: z.number(),
  petId: z.number(),
  serviceType: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  status: z.enum(['pending', 'confirmed', 'completed', 'cancelled']),
  notes: z.string().optional()
});

// Client management
export async function createClient(data: unknown) {
  const validated = clientSchema.parse(data);
  const db = await getDb();
  
  const result = await db.run(
    'INSERT INTO clients (name, email, phone, address) VALUES (?, ?, ?, ?)',
    [validated.name, validated.email, validated.phone, validated.address]
  );
  
  return result.lastID;
}

export async function getClient(id: number) {
  const db = await getDb();
  return db.get('SELECT * FROM clients WHERE id = ?', [id]);
}

export async function updateClient(id: number, data: unknown) {
  const validated = clientSchema.partial().parse(data);
  const db = await getDb();
  
  const updates = Object.entries(validated)
    .filter(([_, value]) => value !== undefined)
    .map(([key]) => `${key} = ?`)
    .join(', ');
    
  const values = Object.values(validated).filter(value => value !== undefined);
  
  await db.run(
    `UPDATE clients SET ${updates} WHERE id = ?`,
    [...values, id]
  );
}

// Pet management
export async function addPet(data: unknown) {
  const validated = petSchema.parse(data);
  const db = await getDb();
  
  const result = await db.run(
    'INSERT INTO pets (client_id, name, type, breed, age, medical_info, notes) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [validated.clientId, validated.name, validated.type, validated.breed, validated.age, validated.medicalInfo, validated.notes]
  );
  
  return result.lastID;
}

export async function getPet(id: number) {
  const db = await getDb();
  return db.get('SELECT * FROM pets WHERE id = ?', [id]);
}

export async function getClientPets(clientId: number) {
  const db = await getDb();
  return db.all('SELECT * FROM pets WHERE client_id = ?', [clientId]);
}

// Booking management
export async function createBooking(data: unknown) {
  const validated = bookingSchema.parse(data);
  const db = await getDb();
  
  // Calculate price based on service type and dates
  const basePrice = await getServiceBasePrice(validated.serviceType);
  const totalPrice = calculateTotalPrice(basePrice, validated.startDate, validated.endDate);
  
  const result = await db.run(
    `INSERT INTO bookings (
      client_id, pet_id, service_type, start_date, end_date,
      status, total_price, notes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      validated.clientId,
      validated.petId,
      validated.serviceType,
      validated.startDate,
      validated.endDate,
      validated.status,
      totalPrice,
      validated.notes
    ]
  );
  
  return result.lastID;
}

export async function getBooking(id: number) {
  const db = await getDb();
  return db.get('SELECT * FROM bookings WHERE id = ?', [id]);
}

export async function getClientBookings(clientId: number) {
  const db = await getDb();
  return db.all('SELECT * FROM bookings WHERE client_id = ? ORDER BY start_date DESC', [clientId]);
}

export async function updateBookingStatus(id: number, status: string) {
  const db = await getDb();
  await db.run('UPDATE bookings SET status = ? WHERE id = ?', [status, id]);
}

// Service logging
export async function addServiceLog(bookingId: number, notes: string, photos?: string[]) {
  const db = await getDb();
  await db.run(
    'INSERT INTO service_logs (booking_id, log_date, notes, photos) VALUES (?, CURRENT_TIMESTAMP, ?, ?)',
    [bookingId, notes, photos ? JSON.stringify(photos) : null]
  );
}

export async function getServiceLogs(bookingId: number) {
  const db = await getDb();
  return db.all('SELECT * FROM service_logs WHERE booking_id = ? ORDER BY log_date DESC', [bookingId]);
}

// Helper functions
async function getServiceBasePrice(serviceType: string): Promise<number> {
  const prices: Record<string, number> = {
    'walking': 19,
    'boarding': 40,
    'sitting': 50,
    'daycare': 35,
    'drop-in-30': 22,
    'drop-in-60': 35
  };
  
  return prices[serviceType] || 0;
}

function calculateTotalPrice(basePrice: number, startDate: string, endDate: string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  
  // Check for holiday rates
  const holidayDates = [
    { start: '2024-08-30', end: '2024-09-02' },
    { start: '2024-11-28', end: '2024-12-01' },
    { start: '2024-12-21', end: '2025-01-01' },
    // Add other holiday dates
  ];
  
  let holidayDays = 0;
  for (const holiday of holidayDates) {
    const holidayStart = new Date(holiday.start);
    const holidayEnd = new Date(holiday.end);
    
    if (start <= holidayEnd && end >= holidayStart) {
      const overlapStart = new Date(Math.max(start.getTime(), holidayStart.getTime()));
      const overlapEnd = new Date(Math.min(end.getTime(), holidayEnd.getTime()));
      const overlapDays = Math.ceil((overlapEnd.getTime() - overlapStart.getTime()) / (1000 * 60 * 60 * 24));
      holidayDays += overlapDays;
    }
  }
  
  const regularDays = days - holidayDays;
  const holidayRate = 8; // Additional fee per day during holidays
  
  return (basePrice * regularDays) + ((basePrice + holidayRate) * holidayDays);
}

// Export types for TypeScript support
export type Client = z.infer<typeof clientSchema>;
export type Pet = z.infer<typeof petSchema>;
export type Booking = z.infer<typeof bookingSchema>;