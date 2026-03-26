-- ENAPO Core Schema
-- Migration: 001_initial_schema

-- Enable required extensions
create extension if not exists "uuid-ossp";

-- ─── PROFILES (extends Supabase Auth) ────────────────────────
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  name text,
  email text,
  avatar_url text,
  created_at timestamptz default now() not null
);

alter table public.profiles enable row level security;

create policy "Users can view profiles of trip members"
  on public.profiles for select
  using (true);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, email, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'full_name', 'User'),
    new.email,
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─── TRIPS ───────────────────────────────────────────────────
create table public.trips (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  date_from date,
  date_to date,
  invite_code text unique default substr(md5(random()::text), 1, 8),
  created_by uuid references public.profiles(id) on delete set null,
  status text default 'active' check (status in ('active', 'completed', 'cancelled')),
  created_at timestamptz default now() not null
);

alter table public.trips enable row level security;

-- ─── TRIP MEMBERS ────────────────────────────────────────────
create table public.trip_members (
  trip_id uuid references public.trips(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  role text default 'member' check (role in ('organizer', 'member')),
  joined_at timestamptz default now() not null,
  primary key (trip_id, user_id)
);

alter table public.trip_members enable row level security;

-- Trip policies (members only)
create policy "Trip members can view trip"
  on public.trips for select
  using (id in (select trip_id from public.trip_members where user_id = auth.uid()));

create policy "Authenticated users can create trips"
  on public.trips for insert
  with check (auth.uid() = created_by);

create policy "Organizer can update trip"
  on public.trips for update
  using (id in (select trip_id from public.trip_members where user_id = auth.uid() and role = 'organizer'));

-- Trip member policies
create policy "Trip members can view members"
  on public.trip_members for select
  using (trip_id in (select trip_id from public.trip_members where user_id = auth.uid()));

create policy "Users can join trips"
  on public.trip_members for insert
  with check (auth.uid() = user_id);

create policy "Organizer can manage members"
  on public.trip_members for delete
  using (trip_id in (select trip_id from public.trip_members where user_id = auth.uid() and role = 'organizer'));

-- ─── OPTIONS ─────────────────────────────────────────────────
create table public.options (
  id uuid default uuid_generate_v4() primary key,
  trip_id uuid references public.trips(id) on delete cascade not null,
  url text,
  title text,
  image_url text,
  price text,
  rating text,
  source_domain text,
  category text default 'other' check (category in ('accommodation', 'flight', 'activity', 'car', 'other')),
  notes text,
  added_by uuid references public.profiles(id) on delete set null,
  status text default 'active' check (status in ('active', 'decided', 'rejected')),
  created_at timestamptz default now() not null
);

alter table public.options enable row level security;

create policy "Trip members can view options"
  on public.options for select
  using (trip_id in (select trip_id from public.trip_members where user_id = auth.uid()));

create policy "Trip members can add options"
  on public.options for insert
  with check (trip_id in (select trip_id from public.trip_members where user_id = auth.uid()));

create policy "Trip members can update options"
  on public.options for update
  using (trip_id in (select trip_id from public.trip_members where user_id = auth.uid()));

-- ─── POLLS ───────────────────────────────────────────────────
create table public.polls (
  id uuid default uuid_generate_v4() primary key,
  trip_id uuid references public.trips(id) on delete cascade not null,
  title text not null,
  category text,
  deadline timestamptz,
  status text default 'open' check (status in ('open', 'closed')),
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz default now() not null
);

alter table public.polls enable row level security;

create policy "Trip members can view polls"
  on public.polls for select
  using (trip_id in (select trip_id from public.trip_members where user_id = auth.uid()));

create policy "Trip members can create polls"
  on public.polls for insert
  with check (trip_id in (select trip_id from public.trip_members where user_id = auth.uid()));

create policy "Poll creator can update poll"
  on public.polls for update
  using (created_by = auth.uid());

-- ─── POLL OPTIONS ────────────────────────────────────────────
create table public.poll_options (
  id uuid default uuid_generate_v4() primary key,
  poll_id uuid references public.polls(id) on delete cascade not null,
  option_id uuid references public.options(id) on delete cascade not null
);

alter table public.poll_options enable row level security;

create policy "Trip members can view poll options"
  on public.poll_options for select
  using (poll_id in (select id from public.polls where trip_id in
    (select trip_id from public.trip_members where user_id = auth.uid())));

create policy "Trip members can add poll options"
  on public.poll_options for insert
  with check (poll_id in (select id from public.polls where trip_id in
    (select trip_id from public.trip_members where user_id = auth.uid())));

-- ─── VOTES ───────────────────────────────────────────────────
create table public.votes (
  id uuid default uuid_generate_v4() primary key,
  poll_id uuid references public.polls(id) on delete cascade not null,
  poll_option_id uuid references public.poll_options(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  value text default 'yes' check (value in ('yes', 'no', 'maybe')),
  created_at timestamptz default now() not null,
  unique (poll_id, user_id)
);

alter table public.votes enable row level security;

create policy "Trip members can view votes"
  on public.votes for select
  using (poll_id in (select id from public.polls where trip_id in
    (select trip_id from public.trip_members where user_id = auth.uid())));

create policy "Users can cast own votes"
  on public.votes for insert
  with check (auth.uid() = user_id);

create policy "Users can change own votes"
  on public.votes for update
  using (auth.uid() = user_id);

-- ─── COMMENTS ────────────────────────────────────────────────
create table public.comments (
  id uuid default uuid_generate_v4() primary key,
  trip_id uuid references public.trips(id) on delete cascade not null,
  option_id uuid references public.options(id) on delete cascade,
  poll_id uuid references public.polls(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade not null,
  text text not null,
  created_at timestamptz default now() not null
);

alter table public.comments enable row level security;

create policy "Trip members can view comments"
  on public.comments for select
  using (trip_id in (select trip_id from public.trip_members where user_id = auth.uid()));

create policy "Trip members can add comments"
  on public.comments for insert
  with check (trip_id in (select trip_id from public.trip_members where user_id = auth.uid()));

-- ─── INDEXES ─────────────────────────────────────────────────
create index idx_trip_members_user on public.trip_members(user_id);
create index idx_trip_members_trip on public.trip_members(trip_id);
create index idx_options_trip on public.options(trip_id);
create index idx_options_status on public.options(status);
create index idx_polls_trip on public.polls(trip_id);
create index idx_votes_poll on public.votes(poll_id);
create index idx_comments_trip on public.comments(trip_id);
create index idx_trips_invite_code on public.trips(invite_code);

-- ─── REALTIME ────────────────────────────────────────────────
alter publication supabase_realtime add table public.options;
alter publication supabase_realtime add table public.votes;
alter publication supabase_realtime add table public.polls;
alter publication supabase_realtime add table public.trip_members;
