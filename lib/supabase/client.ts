import { createBrowserClient } from "@supabase/ssr"
import type { Database } from "@/lib/supabase/database.types"

const supabaseURL = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseURL || !supabaseAnonKey)
  throw new Error("No SUPABASE_URL or no SUPABASE ANON KEY found")

export const supabase = createBrowserClient<Database>(supabaseURL, supabaseAnonKey)