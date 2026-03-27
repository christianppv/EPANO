-- Add destination and planned_members to trips
alter table public.trips
  add column if not exists destination text not null default '',
  add column if not exists planned_members int not null default 2;

-- Align status values with app domain language
alter table public.trips drop constraint if exists trips_status_check;
alter table public.trips
  add constraint trips_status_check
    check (status in ('planning', 'confirmed', 'completed'));
alter table public.trips alter column status set default 'planning';

-- RPC: Preview trip by invite code (no membership required)
create or replace function public.get_trip_by_invite_code(p_code text)
returns table (
  id uuid,
  name text,
  destination text,
  status text,
  invite_code text
)
language sql
security definer
stable
as $$
  select id, name, destination, status, invite_code
  from public.trips
  where invite_code = p_code;
$$;

-- RPC: Join a trip via invite code
create or replace function public.join_trip_by_invite_code(p_code text)
returns uuid
language plpgsql
security definer
as $$
declare
  v_trip_id uuid;
begin
  select id into v_trip_id from public.trips where invite_code = p_code;
  if v_trip_id is null then
    raise exception 'trip_not_found';
  end if;
  insert into public.trip_members (trip_id, user_id, role)
  values (v_trip_id, auth.uid(), 'member')
  on conflict (trip_id, user_id) do nothing;
  return v_trip_id;
end;
$$;
