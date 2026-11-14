begin;
create table if not exists public.certificates (
  id uuid primary key default gen_random_uuid(),
  user_email text not null,
  issued_at timestamptz not null default now(),
  revoked_at timestamptz
);
alter table public.certificates add column if not exists revoked_at timestamptz;
alter table public.certificates enable row level security;
revoke all on public.certificates from anon, authenticated;
-- Exact UUID lookup only; never expose email or allow anonymous table scans.
create or replace function public.verify_certificate(certificate_id uuid)
returns table(id uuid, issued_at timestamptz)
language sql stable security definer set search_path = ''
as $$ select c.id, c.issued_at from public.certificates c
      where c.id = certificate_id and c.revoked_at is null and c.issued_at <= now() limit 1; $$;
revoke all on function public.verify_certificate(uuid) from public;
grant execute on function public.verify_certificate(uuid) to anon;
commit;
