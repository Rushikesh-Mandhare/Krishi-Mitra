import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jajomvphhmpagnvoigne.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impham9tdnBoaG1wYWdudm9pZ25lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjg1NjgxNDEsImV4cCI6MjA0NDE0NDE0MX0.Hfjn_MD3R4StZokifGAz_E__wGeo9-iGzEBjW9nlN_Y';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
