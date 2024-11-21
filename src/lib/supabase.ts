import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

const supabaseUrl = 'https://gnuofxzeqjwkyjggmfeo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdudW9meHplcWp3a3lqZ2dtZmVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIxMTY1NjUsImV4cCI6MjA0NzY5MjU2NX0.ilf4_9Pw_Mg5KjHbUcZoA3XV7xVwuRY6US6FdWJUVoE';

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);

export async function initialize() {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  } catch (error) {
    console.error('Error initializing Supabase:', error);
    return null;
  }
}