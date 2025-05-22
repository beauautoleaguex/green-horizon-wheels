
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

// Use default values if environment variables are not available
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://mock-supabase-url.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'mock-anon-key';

// Log notice instead of error
if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn('Missing Supabase environment variables. Using mock values for development.');
}

export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey
);
