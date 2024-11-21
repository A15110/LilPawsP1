-- Create admin users table
create table if not exists public.admin_users (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('admin')),
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.admin_users enable row level security;

-- Create policy for admin access
create policy "Admin users can be viewed by admins"
  on public.admin_users for select
  using (auth.jwt()->>'role' = 'admin');

-- Create policy for admin management
create policy "Admins can manage admin users"
  on public.admin_users for all
  using (auth.jwt()->>'role' = 'admin');

-- Create initial admin user
do $$
declare
  admin_user_id uuid;
begin
  -- Create admin user if it doesn't exist
  insert into auth.users (email, encrypted_password, email_confirmed_at, raw_app_meta_data)
  values (
    'dixonjd1982@gmail.com',
    crypt('Password1', gen_salt('bf')),
    now(),
    jsonb_build_object('role', 'admin')
  )
  on conflict (email) do update
  set raw_app_meta_data = jsonb_build_object('role', 'admin')
  returning id into admin_user_id;

  -- Add user to admin_users table
  insert into public.admin_users (id, role)
  values (admin_user_id, 'admin')
  on conflict (id) do update
  set role = 'admin';
end $$;