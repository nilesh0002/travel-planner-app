import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl: string = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey: string = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Type-safe supabase client
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);
