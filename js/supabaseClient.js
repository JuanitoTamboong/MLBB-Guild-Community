import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';


// NOTE:
// - Put your SUPABASE_URL and SUPABASE_ANON_KEY here.
// - Do NOT use the service_role key in the browser.

const SUPABASE_URL = 'https://awlmvwnqznhgouuwzzns.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF3bG12d25xem5oZ291dXd6em5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM0NzkzNzksImV4cCI6MjA5OTA1NTM3OX0.HTca2eP5MHNpkU4xbHtTHFXhnQIxSPqLjFqmWPw4SGE';



export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

