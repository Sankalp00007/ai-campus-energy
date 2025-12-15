import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zcoiodmkzimatvqbbaez.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpjb2lvZG1remltYXR2cWJiYWV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU1OTkwMTQsImV4cCI6MjA4MTE3NTAxNH0.GiRYj6QYY3nv7rwZh2jXxtsJcBsNXy-kveDhalvTrfg';

export const supabase = createClient(supabaseUrl, supabaseKey);