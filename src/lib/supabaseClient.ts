import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type ReportStatus = 'draft' | 'review' | 'ready';

export interface TraceableReport {
  id: string;
  title: string;
  organization: string;
  status: ReportStatus;
  report_period: string;
  metric_count: number;
  record_count: number;
  summary: string;
  created_at: string;
  updated_at: string;
}
