
import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

const supabaseUrl = 'https://mkvwhvehaonscftgapun.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1rdndodmVoYW9uc2NmdGdhcHVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxMzg1OTUsImV4cCI6MjA2MzcxNDU5NX0.OQHU0xQG0PnRTvj5al7Mpi2c8bomCLuO3AFt_wHwU20'

export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    persistSession: true,
    autoRefreshToken: true,
  }
})
