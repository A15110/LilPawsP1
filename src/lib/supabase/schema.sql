-- Reset schema
drop table if exists public.service_logs cascade;
drop table if exists public.bookings cascade;
drop table if exists public.reviews cascade;
drop table if exists public.pets cascade;
drop table if exists public.clients cascade;
drop table if exists public.admin_users cascade;

-- Create clients table
create table public.clients (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  email text unique not null,
  phone text not null,
  address text not null,
  emergency_contact text not null,
  emergency_phone text not null,
  user_id uuid references auth.users(id)
);

-- Create pets table
create table public.pets (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  client_id uuid references public.clients(id) on delete cascade not null,
  name text not null,
  type text not null,
  breed text,
  age integer,
  medical_info text,
  feeding_instructions text,
  behavioral_notes text
);

-- Create bookings table
create table public.bookings (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  client_name text not null,
  client_email text not null,
  client_phone text not null,
  service_type text not null,
  pet_type text not null,
  start_date timestamp with time zone not null,
  notes text,
  status text not null default 'pending',
  check (status in ('pending', 'confirmed', 'completed', 'cancelled'))
);

-- Create service_logs table
create table public.service_logs (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  booking_id uuid references public.bookings(id) on delete cascade not null,
  log_date timestamp with time zone not null,
  notes text,
  photos text[]
);

-- Enable RLS
alter table public.clients enable row level security;
alter table public.pets enable row level security;
alter table public.bookings enable row level security;
alter table public.service_logs enable row level security;

-- Create policies for clients table
create policy "Clients can be created by anyone"
  on public.clients for insert
  with check (true);

create policy "Clients can be viewed by admin"
  on public.clients for select
  using (auth.role() = 'authenticated' and auth.jwt()->>'role' = 'admin');

create policy "Clients can be updated by admin"
  on public.clients for update
  using (auth.role() = 'authenticated' and auth.jwt()->>'role' = 'admin');

create policy "Clients can be deleted by admin"
  on public.clients for delete
  using (auth.role() = 'authenticated' and auth.jwt()->>'role' = 'admin');

-- Create policies for pets table
create policy "Pets can be created by anyone"
  on public.pets for insert
  with check (true);

create policy "Pets can be viewed by admin"
  on public.pets for select
  using (auth.role() = 'authenticated' and auth.jwt()->>'role' = 'admin');

create policy "Pets can be updated by admin"
  on public.pets for update
  using (auth.role() = 'authenticated' and auth.jwt()->>'role' = 'admin');

create policy "Pets can be deleted by admin"
  on public.pets for delete
  using (auth.role() = 'authenticated' and auth.jwt()->>'role' = 'admin');

-- Create policies for bookings table
create policy "Bookings can be created by anyone"
  on public.bookings for insert
  with check (true);

create policy "Bookings can be viewed by admin"
  on public.bookings for select
  using (auth.role() = 'authenticated' and auth.jwt()->>'role' = 'admin');

create policy "Bookings can be updated by admin"
  on public.bookings for update
  using (auth.role() = 'authenticated' and auth.jwt()->>'role' = 'admin');

-- Create policies for service_logs table
create policy "Service logs can be created by admin"
  on public.service_logs for insert
  with check (auth.role() = 'authenticated' and auth.jwt()->>'role' = 'admin');

create policy "Service logs can be viewed by admin"
  on public.service_logs for select
  using (auth.role() = 'authenticated' and auth.jwt()->>'role' = 'admin');

-- Refresh schema cache
notify pgrst, 'reload schema';