-- GRI-6 · Schema mínimo: profiles, event_types, events.
-- Tres tablas, nada más. Sin recurrencia: un evento es una fecha
-- (`event_occurrences` llega cuando volvamos a meter RRULE).

create extension if not exists postgis with schema extensions;

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------

create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------------

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text not null unique,
  display_name text not null,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- event_types
-- ---------------------------------------------------------------------------

create table public.event_types (
  slug text primary key,
  name_es text not null,
  sort_order int not null
);

-- Va en la migración y no en seed.sql: producción necesita estas filas.
insert into public.event_types (slug, name_es, sort_order) values
  ('clasicos', 'Clásicos', 10),
  ('tuning', 'Tuning', 20),
  ('jdm', 'JDM', 30),
  ('vag', 'VAG', 40),
  ('4x4', '4x4', 50),
  ('motos', 'Motos', 60),
  ('cars-and-coffee', 'Cars & Coffee', 70),
  ('otro', 'Otro', 80);

-- ---------------------------------------------------------------------------
-- events
-- ---------------------------------------------------------------------------

create type public.event_status as enum ('draft', 'published', 'cancelled');

create table public.events (
  id uuid primary key default gen_random_uuid(),
  -- Lo completa el trigger `events_set_slug`; cualquier valor que mande el cliente se ignora.
  slug text not null unique,
  author_id uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  title text not null,
  description text,
  type_id text not null references public.event_types (slug),
  starts_at timestamptz not null,
  ends_at timestamptz,
  location extensions.geography(Point, 4326),
  address_text text,
  -- Redundante con `location` a propósito: es el filtro más usado y no queremos
  -- resolverlo con PostGIS en cada query.
  department text,
  cover_url text,
  status public.event_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint events_ends_after_starts check (ends_at is null or ends_at >= starts_at)
);

create index events_author_id_idx on public.events (author_id);
create index events_type_id_idx on public.events (type_id);
create index events_starts_at_idx on public.events (starts_at);
create index events_department_starts_at_idx on public.events (department, starts_at);
create index events_location_idx on public.events using gist (location);

-- El slug sale del título más un sufijo corto, y no cambia al editar.
create function public.events_set_slug()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  base text;
begin
  if tg_op = 'UPDATE' then
    new.slug := old.slug;
    return new;
  end if;

  base := translate(lower(new.title), 'áàäâéèëêíìïîóòöôúùüûñç', 'aaaaeeeeiiiioooouuuunc');
  base := regexp_replace(base, '[^a-z0-9]+', '-', 'g');
  base := trim(both '-' from left(trim(both '-' from base), 60));
  if base = '' then
    base := 'evento';
  end if;

  new.slug := base || '-' || left(replace(gen_random_uuid()::text, '-', ''), 6);
  return new;
end;
$$;

create trigger events_set_slug
  before insert or update on public.events
  for each row execute function public.events_set_slug();

create trigger events_set_updated_at
  before update on public.events
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.event_types enable row level security;
alter table public.events enable row level security;

create policy "profiles: lectura pública"
  on public.profiles for select
  to anon, authenticated
  using (true);

create policy "profiles: alta propia"
  on public.profiles for insert
  to authenticated
  with check ((select auth.uid()) = id);

create policy "profiles: edición propia"
  on public.profiles for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

create policy "event_types: lectura pública"
  on public.event_types for select
  to anon, authenticated
  using (true);

-- Publicados y cancelados son públicos; los borradores solo los ve su autor.
create policy "events: lectura pública o propia"
  on public.events for select
  to anon, authenticated
  using (status <> 'draft' or author_id = (select auth.uid()));

create policy "events: alta propia"
  on public.events for insert
  to authenticated
  with check (author_id = (select auth.uid()));

-- Sin política de delete: un evento se da de baja pasándolo a `cancelled`.
create policy "events: edición propia"
  on public.events for update
  to authenticated
  using (author_id = (select auth.uid()))
  with check (author_id = (select auth.uid()));
