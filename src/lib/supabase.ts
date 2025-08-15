import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      procurement_orders: {
        Row: {
          id: string
          order_date: string
          vendor: string
          category: string
          region: string
          item_name: string
          quantity: number
          unit_price: number
          total_amount: number
          contract_type: string
          delivery_score: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_date: string
          vendor: string
          category: string
          region: string
          item_name: string
          quantity: number
          unit_price: number
          total_amount: number
          contract_type?: string
          delivery_score?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_date?: string
          vendor?: string
          category?: string
          region?: string
          item_name?: string
          quantity?: number
          unit_price?: number
          total_amount?: number
          contract_type?: string
          delivery_score?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}