-- Grant service_role access to tables that omitted it in earlier migrations.
-- The books migration had this pattern; challenges and submissions did not.
grant select on public.challenges to service_role;
grant select, insert, update, delete on public.submissions to service_role;