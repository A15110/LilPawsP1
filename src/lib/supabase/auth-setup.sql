-- Enable RLS
alter table auth.users enable row level security;

-- Create admin users table
create table if not exists admin_users (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role = 'admin'),
  created_at timestamptz default now()
);

-- Enable RLS on admin_users table
alter table admin_users enable row level security;

-- Create policies for admin_users
create policy "Admin users can be viewed by admins only"
  on admin_users for select
  using (auth.jwt()->>'role' = 'admin');

create policy "Admin users can be created by super admin only"
  on admin_users for insert
  with check (auth.jwt()->>'role' = 'admin');

-- Function to check if user is admin
create or replace function is_admin(user_id uuid)
returns boolean as $$
begin
  return exists (
    select 1 from admin_users
    where id = user_id
    and role = 'admin'
  );
end;
$$ language plpgsql security definer;

-- Create initial admin user
insert into admin_users (id, role)
select id, 'admin'
from auth.users
where email = 'dixonjd1982@gmail.com'
on conflict (id) do nothing;