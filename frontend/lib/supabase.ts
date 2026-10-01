import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://nbvvvqcjzxittnzoxmbr.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_Uf4P3fqsz-TKehZQ4l7ZQQ_zx0lMr-i';

export const supabase = createClient(supabaseUrl, supabaseKey);
