-- Create admin role
create or replace function public.create_admin_role()
returns void as $$
begin
  -- Create service_admin role if it doesn't exist
  if not exists (select 1 from pg_roles where rolname = 'service_admin') then
    create role service_admin;
  end if;
end;
$$ language plpgsql security definer;

-- Create function to set user as admin
create or replace function public.set_user_admin(user_id uuid)
returns void as $$
begin
  -- Add admin claims to the user's JWT
  update auth.users
  set raw_app_meta_data = raw_app_meta_data || 
    json_build_object('role', 'service_admin')::jsonb
  where id = user_id;
end;
$$ language plpgsql security definer;