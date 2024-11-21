export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      clients: {
        Row: {
          id: string
          created_at: string
          email: string
          name: string
          phone: string
          address: string
          emergency_contact: string
          emergency_phone: string
        }
        Insert: {
          id?: string
          created_at?: string
          email: string
          name: string
          phone: string
          address: string
          emergency_contact: string
          emergency_phone: string
        }
        Update: {
          id?: string
          created_at?: string
          email?: string
          name?: string
          phone?: string
          address?: string
          emergency_contact?: string
          emergency_phone?: string
        }
      }
      pets: {
        Row: {
          id: string
          created_at: string
          client_id: string
          name: string
          type: string
          breed: string
          age: number
          medical_info: string
          feeding_instructions: string
          behavioral_notes: string
        }
        Insert: {
          id?: string
          created_at?: string
          client_id: string
          name: string
          type: string
          breed: string
          age: number
          medical_info?: string
          feeding_instructions?: string
          behavioral_notes?: string
        }
        Update: {
          id?: string
          created_at?: string
          client_id?: string
          name?: string
          type?: string
          breed?: string
          age?: number
          medical_info?: string
          feeding_instructions?: string
          behavioral_notes?: string
        }
      }
      bookings: {
        Row: {
          id: string
          created_at: string
          client_id: string
          pet_id: string
          service_type: string
          start_date: string
          end_date: string
          status: string
          notes: string
          total_price: number
        }
        Insert: {
          id?: string
          created_at?: string
          client_id: string
          pet_id: string
          service_type: string
          start_date: string
          end_date: string
          status?: string
          notes?: string
          total_price: number
        }
        Update: {
          id?: string
          created_at?: string
          client_id?: string
          pet_id?: string
          service_type?: string
          start_date?: string
          end_date?: string
          status?: string
          notes?: string
          total_price?: number
        }
      }
      admin_users: {
        Row: {
          id: string
          role: string
        }
        Insert: {
          id: string
          role: string
        }
        Update: {
          id?: string
          role?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}