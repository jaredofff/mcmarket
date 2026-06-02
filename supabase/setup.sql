-- MC Market Supabase setup
-- Run this once in the Supabase SQL editor before uploading real resources.

create extension if not exists "pgcrypto";

create table if not exists public.plugins (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  author text,
  description text not null,
  price numeric(10, 2) not null default 0,
  version text not null,
  tier text not null default 'free',
  tested_versions text[] not null default '{}',
  dependencies text[] not null default '{}',
  categories text[] not null default '{}',
  tags text[] not null default '{}',
  cover_image text,
  cover_image_path text,
  banner_image text,
  banner_image_path text,
  file_path text,
  file_name text,
  file_size bigint,
  file_mime_type text,
  is_vip_only boolean not null default false,
  published boolean not null default false,
  download_count integer not null default 0,
  rating numeric(3, 2) not null default 0,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists plugins_published_created_at_idx
  on public.plugins (published, created_at desc);

create index if not exists plugins_categories_idx
  on public.plugins using gin (categories);

create index if not exists plugins_tags_idx
  on public.plugins using gin (tags);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_plugins_updated_at on public.plugins;
create trigger set_plugins_updated_at
before update on public.plugins
for each row execute function public.set_updated_at();

alter table public.plugins enable row level security;

drop policy if exists "Published plugins are public" on public.plugins;
create policy "Published plugins are public"
on public.plugins for select
using (published = true);

drop policy if exists "Admins can read plugins" on public.plugins;
create policy "Admins can read plugins"
on public.plugins for select
to authenticated
using (
  coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') in ('ADMIN', 'CEO')
);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'plugin-media',
  'plugin-media',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/gif', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'plugin-files',
  'plugin-files',
  false,
  104857600,
  array[
    'application/java-archive',
    'application/zip',
    'application/x-zip-compressed',
    'application/octet-stream'
  ]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can read plugin media" on storage.objects;
create policy "Public can read plugin media"
on storage.objects for select
using (bucket_id = 'plugin-media');
