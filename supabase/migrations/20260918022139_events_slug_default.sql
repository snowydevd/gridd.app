-- El trigger `events_set_slug` siempre pisa el slug al insertar. El default vacío
-- solo existe para que `slug` sea opcional en los tipos generados (Insert).
alter table public.events alter column slug set default '';
