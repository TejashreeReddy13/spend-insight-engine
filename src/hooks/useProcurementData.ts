import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || '',
  import.meta.env.VITE_SUPABASE_ANON_KEY || ''
)

interface FilterState {
  vendor: string
  category: string
  region: string
  dateRange: string
}

interface ProcurementAnalysis {
  summary: {
    totalSpend: number
    totalOrders: number
    uniqueVendors: number
    maverickSpend: number
    maverickPercentage: number
    potentialSavings: number
    avgOrderValue: number
  }
  spendByVendor: Array<{
    vendor: string
    spend: number
    percentage: number
  }>
  spendByCategory: Array<{
    category: string
    spend: number
    percentage: number
  }>
  spendByRegion: Array<{
    region: string
    spend: number
    percentage: number
  }>
  priceVariance: Array<{
    item: string
    avgPrice: number
    minPrice: number
    maxPrice: number
    variance: number
    totalQuantity: number
    vendors: string[]
    regions: string[]
  }>
  topVendors: Array<{
    vendor: string
    spend: number
    orders: number
    avgDeliveryScore: number
    offContractPercentage: number
    performanceScore: number
  }>
  maverickAnalysis: {
    offContractSpend: number
    offContractPercentage: number
    offContractOrders: number
    potentialSavings: number
    topOffContractVendors: Array<{
      vendor: string
      offContractSpend: number
      offContractOrders: number
    }>
  }
}

interface Insight {
  id: string
  title: string
  description: string
  potentialSaving: number
  priority: string
  category: string
  implementationTime: string
  impact: string
  status: string
}

export function useProcurementData() {
  const [data, setData] = useState<ProcurementAnalysis | null>(null)
  const [insights, setInsights] = useState<Insight[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async (filters: FilterState) => {
    try {
      setLoading(true)
      setError(null)

      // Convert date range to actual dates
      const dateRanges: Record<string, { start: string; end: string }> = {
        'last-7-days': {
          start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          end: new Date().toISOString().split('T')[0]
        },
        'last-30-days': {
          start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          end: new Date().toISOString().split('T')[0]
        },
        'last-90-days': {
          start: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          end: new Date().toISOString().split('T')[0]
        },
        'last-year': {
          start: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          end: new Date().toISOString().split('T')[0]
        },
        'all-time': {
          start: '2022-01-01',
          end: new Date().toISOString().split('T')[0]
        }
      }

      const dateRange = dateRanges[filters.dateRange] || dateRanges['last-30-days']

      // Build query parameters
      const params = new URLSearchParams({
        startDate: dateRange.start,
        endDate: dateRange.end
      })

      if (filters.vendor) params.append('vendor', filters.vendor)
      if (filters.category) params.append('category', filters.category)
      if (filters.region) params.append('region', filters.region)

      // Call analyze-procurement edge function
      const { data: analysisData, error: analysisError } = await supabase.functions.invoke(
        'analyze-procurement',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

      if (analysisError) throw analysisError

      setData(analysisData)

      // Generate insights based on analysis
      const { data: insightsData, error: insightsError } = await supabase.functions.invoke(
        'generate-insights',
        {
          body: { analysisData }
        }
      )

      if (insightsError) throw insightsError

      setInsights(insightsData.insights || [])

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error fetching procurement data:', err)
    } finally {
      setLoading(false)
    }
  }

  const exportReport = async (format: 'pdf' | 'excel') => {
    if (!data || !insights) return

    try {
      const { data: reportData, error } = await supabase.functions.invoke(
        'export-report',
        {
          body: {
            format,
            analysisData: data,
            insights
          }
        }
      )

      if (error) throw error

      // Create download link
      const blob = new Blob([reportData], {
        type: format === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `procurement-analysis.${format === 'pdf' ? 'pdf' : 'xlsx'}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

    } catch (err) {
      console.error('Error exporting report:', err)
      throw err
    }
  }

  const getVendorOptions = async () => {
    const { data, error } = await supabase
      .from('procurement_orders')
      .select('vendor')
      .order('vendor')

    if (error) throw error

    return [...new Set(data.map(row => row.vendor))].sort()
  }

  const getCategoryOptions = async () => {
    const { data, error } = await supabase
      .from('procurement_orders')
      .select('category')
      .order('category')

    if (error) throw error

    return [...new Set(data.map(row => row.category))].sort()
  }

  const getRegionOptions = async () => {
    const { data, error } = await supabase
      .from('procurement_orders')
      .select('region')
      .order('region')

    if (error) throw error

    return [...new Set(data.map(row => row.region))].sort()
  }

  return {
    data,
    insights,
    loading,
    error,
    fetchData,
    exportReport,
    getVendorOptions,
    getCategoryOptions,
    getRegionOptions
  }
}