-- Create admin users table with proper role and permissions
do $$
begin
  -- Drop existing table if exists
  drop table if exists public.admin_users cascade;
  
  -- Create admin_users table
  create table public.admin_users (
    id uuid primary key references auth.users(id) on delete cascade,
    role text not null,
    created_at timestamptz default now(),
    constraint admin_users_role_check check (role in ('admin'))
  );

  -- Enable RLS
  alter table public.admin_users enable row level security;

  -- Create policies
  create policy "Admin users can be viewed by admins"
    on public.admin_users for select
    using (auth.jwt()->>'role' = 'admin');

  create policy "Admins can manage admin users"
    on public.admin_users for all
    using (auth.jwt()->>'role' = 'admin');

  -- Create function to handle admin creation
  create or replace function create_new_admin(admin_email text)
  returns void as $$
  declare
    user_id uuid;
  begin
    -- Get user id
    select id into user_id
    from auth.users
    where email = admin_email;

    -- Insert into admin_users
    insert into public.admin_users (id, role)
    values (user_id, 'admin')
    on conflict (id) do update
    set role = 'admin';

    -- Update user metadata
    update auth.users
    set raw_app_meta_data = jsonb_build_object('role', 'admin')
    where id = user_id;
  end;
  $$ language plpgsql security definer;

  -- Create initial admin
  select create_new_admin('dixonjd1982@gmail.com');
end $$;