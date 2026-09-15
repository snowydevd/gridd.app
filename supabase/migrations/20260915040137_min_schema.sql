create table profiles (
    id uuid references auth.users(id) primary key,
    username text unique not null,
    display_name text not null,
    avatar_url text,
    created_at timestamp with time zone default now() not null,
    updated_at timestamp with time zone default now() not null
),


create table event_types (
    slug text primary key,
    name_es text not null,
    sort_order int not null
)

create table events (
    id unique primary key,
    slug text unique,
    
)