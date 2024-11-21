-- Create admin users table if it doesn't exist
create table if not exists public.admin_users (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('admin')),
  created_at timestamptz default now()
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

-- Function to set user as admin
create or replace function public.set_user_as_admin(user_email text)
returns void as $$
declare
  target_user_id uuid;
begin
  -- Get user id from auth.users
  select id into target_user_id
  from auth.users
  where email = user_email;

  -- If user exists, set as admin
  if target_user_id is not null then
    -- Insert or update admin role
    insert into public.admin_users (id, role)
    values (target_user_id, 'admin')
    on conflict (id) do update
    set role = 'admin';

    -- Update user's JWT claims
    update auth.users
    set raw_app_meta_data = 
      coalesce(raw_app_meta_data, '{}'::jsonb) || 
      jsonb_build_object('role', 'admin')
    where id = target_user_id;
  end if;
end;
$$ language plpgsql security definer;