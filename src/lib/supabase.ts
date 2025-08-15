import { createClient } from '@supabase/supabase-js'

// For Lovable's native Supabase integration, we'll use placeholder values temporarily
// and let the user know they need to properly connect their Supabase integration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key'

// Create a basic client - this will be replaced once integration is properly connected
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Check if we have real credentials
const hasRealCredentials = supabaseUrl !== 'https://placeholder.supabase.co' && supabaseAnonKey !== 'placeholder-key'

if (!hasRealCredentials) {
  console.warn('⚠️ Supabase credentials not found. Please ensure your Supabase integration is properly connected via the green Supabase button in the top-right corner.')
}

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