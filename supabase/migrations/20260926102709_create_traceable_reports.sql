/*
# Create traceable impact reports

1. New Tables
- `traceable_reports` stores the shared report workspace used by the dashboard.
- `id` is the generated report identifier.
- `title` is the human-readable report name.
- `organization` identifies the nonprofit or program owner.
- `status` stores the current workflow state.
- `report_period` stores the covered date range.
- `metric_count` stores the number of tracked metrics.
- `record_count` stores the number of source records.
- `summary` stores the report overview text.
- `created_at` and `updated_at` store lifecycle timestamps.

2. Security
- Row level security is enabled.
- Because this is a shared, no-sign-in workspace, anonymous and authenticated visitors can read and manage report rows.
- Separate policies cover SELECT, INSERT, UPDATE, and DELETE operations.

3. Important Notes
- This first version intentionally keeps the workspace single-tenant and does not collect personal beneficiary data.
- Status values are constrained to draft, review, and ready so the interface can present a predictable workflow.
*/

CREATE TABLE IF NOT EXISTS public.traceable_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  organization text NOT NULL DEFAULT 'Community Bridge Network',
  status text NOT NULL DEFAULT 'review' CHECK (status IN ('draft', 'review', 'ready')),
  report_period text NOT NULL DEFAULT 'Jan 2024 — Dec 2024',
  metric_count integer NOT NULL DEFAULT 0 CHECK (metric_count >= 0),
  record_count integer NOT NULL DEFAULT 0 CHECK (record_count >= 0),
  summary text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.traceable_reports ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "shared_reports_select" ON public.traceable_reports;
CREATE POLICY "shared_reports_select" ON public.traceable_reports
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "shared_reports_insert" ON public.traceable_reports;
CREATE POLICY "shared_reports_insert" ON public.traceable_reports
  FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "shared_reports_update" ON public.traceable_reports;
CREATE POLICY "shared_reports_update" ON public.traceable_reports
  FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "shared_reports_delete" ON public.traceable_reports;
CREATE POLICY "shared_reports_delete" ON public.traceable_reports
  FOR DELETE TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS traceable_reports_updated_at_idx
  ON public.traceable_reports (updated_at DESC);