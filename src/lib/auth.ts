import { supabase } from './supabase';

export async function createAdminUser(email: string, password: string) {
  try {
    // Create user through Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { role: 'admin' }
    });

    if (authError) throw authError;

    // Set user as admin using our custom function
    const { error: adminError } = await supabase.rpc('set_user_as_admin', {
      user_email: email
    });

    if (adminError) throw adminError;

    return { success: true };
  } catch (error) {
    console.error('Error creating admin user:', error);
    return { success: false, error };
  }
}