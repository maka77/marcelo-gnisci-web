import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://iwhjwpxnqetwbwelwkud.supabase.co'
const supabaseAnonKey = 'sb_publishable_22T6luFW5B9gBbCf7r7cGw_MtoNREJ1'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
