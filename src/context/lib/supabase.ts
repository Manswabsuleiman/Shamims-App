import 'react-native-url-polyfill/auto'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

export function useSupabase() {
  return supabase
}

export { supabase }