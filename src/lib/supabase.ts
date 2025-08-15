import { createClient } from '@supabase/supabase-js'

// With Lovable's native Supabase integration, these are automatically provided
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || globalThis.SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || globalThis.SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Available env vars:', Object.keys(import.meta.env))
  throw new Error('Missing Supabase environment variables. Please ensure the Supabase integration is properly connected.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      procurement_orders: {
        Row: {
          order_id: string
          order_date: string
          vendor_name: string
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
          order_id?: string
          order_date: string
          vendor_name: string
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
          order_id?: string
          order_date?: string
          vendor_name?: string
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