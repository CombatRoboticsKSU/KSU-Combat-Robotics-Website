import { createClient } from '@supabase/supabase-js';

let supabase = null;
let supabaseUrl = '';
let supabaseAnonKey = '';

// Fetch public envs from the API route at runtime
export async function getSupabaseClient() {
  if (supabase) return supabase;
  // const res = await fetch('http://localhost:4000/api/env');
  const res = await fetch('/api/env');
  const envs = await res.json();
  supabaseUrl = envs.NEXT_PUBLIC_SUPABASE_URL;
  supabaseAnonKey = envs.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables.');
  }
  supabase = createClient(supabaseUrl, supabaseAnonKey);
  return supabase;
}