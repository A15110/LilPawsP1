import { supabase } from './supabase';

// Authentication endpoints
export const auth = {
  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) throw error;
    return data;
  },

  signUp: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    });
    if (error) throw error;
    return data;
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }
};

// Booking endpoints
export const bookings = {
  create: async (bookingData: any) => {
    const { data, error } = await supabase
      .from('bookings')
      .insert(bookingData)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  getAll: async () => {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        client:clients(*),
        pet:pets(*)
      `)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        client:clients(*),
        pet:pets(*)
      `)
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

  update: async (id: string, updates: any) => {
    const { data, error } = await supabase
      .from('bookings')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }
};

// Reviews endpoints
export const reviews = {
  create: async (reviewData: any) => {
    const { data, error } = await supabase
      .from('reviews')
      .insert(reviewData)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  getApproved: async () => {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('approved', true)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  getPending: async () => {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('approved', false)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  approve: async (id: string) => {
    const { data, error } = await supabase
      .from('reviews')
      .update({ approved: true })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }
};

// Photo management endpoints
export const photos = {
  upload: async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `photos/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('pet-photos')
      .upload(filePath, file);
    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('pet-photos')
      .getPublicUrl(filePath);

    return data.publicUrl;
  },

  list: async () => {
    const { data, error } = await supabase.storage
      .from('pet-photos')
      .list('photos');
    if (error) throw error;
    return data;
  },

  delete: async (path: string) => {
    const { error } = await supabase.storage
      .from('pet-photos')
      .remove([path]);
    if (error) throw error;
  }
};