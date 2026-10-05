import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('CRITICAL: Supabase environment variables VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are missing.');
}

// Client-side Supabase client using public Anon Key only
// (All operations are user-scoped and governed by Supabase Auth and Row Level Security)
export const supabase = createClient(
  supabaseUrl || 'https://hwaezxgpfvyicnhevkad.supabase.co',
  supabaseAnonKey || '',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);

export const isRealSupabaseConfigured = true;

export function getSupabaseMode(): { isLive: boolean; url: string } {
  return {
    isLive: true,
    url: supabaseUrl || 'https://hwaezxgpfvyicnhevkad.supabase.co',
  };
}
