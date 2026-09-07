import { createBrowserClient } from "@supabase/ssr"

const supabaseURL = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseURL || !supabaseAnonKey)
  throw new Error("No SUPABASE_URL or no SUPABASE ANON KEY found")

export const supabase = createBrowserClient(supabaseURL, supabaseAnonKey)