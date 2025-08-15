import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

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

// Demo data functions for when Supabase isn't connected
function generateDemoData(): ProcurementAnalysis {
  return {
    summary: {
      totalSpend: 12450000,
      totalOrders: 1247,
      uniqueVendors: 87,
      maverickSpend: 1867500,
      maverickPercentage: 15.0,
      potentialSavings: 934250,
      avgOrderValue: 9986.79
    },
    spendByVendor: [
      { vendor: "Global Supply Co", spend: 2490000, percentage: 20.0 },
      { vendor: "Tech Solutions Inc", spend: 1743000, percentage: 14.0 },
      { vendor: "Office Essentials Ltd", spend: 1494000, percentage: 12.0 },
      { vendor: "Industrial Equipment Co", spend: 1245000, percentage: 10.0 },
      { vendor: "Digital Services Group", spend: 996000, percentage: 8.0 }
    ],
    spendByCategory: [
      { category: "IT Equipment", spend: 3735000, percentage: 30.0 },
      { category: "Office Supplies", spend: 2490000, percentage: 20.0 },
      { category: "Professional Services", spend: 1867500, percentage: 15.0 },
      { category: "Facilities", spend: 1494000, percentage: 12.0 },
      { category: "Marketing", spend: 1245000, percentage: 10.0 }
    ],
    spendByRegion: [
      { region: "North America", spend: 4980000, percentage: 40.0 },
      { region: "Europe", spend: 3735000, percentage: 30.0 },
      { region: "Asia Pacific", spend: 2490000, percentage: 20.0 },
      { region: "Latin America", spend: 1245000, percentage: 10.0 }
    ],
    priceVariance: [
      {
        item: "Laptop Computer",
        avgPrice: 1250.00,
        minPrice: 1100.00,
        maxPrice: 1450.00,
        variance: 28.0,
        totalQuantity: 150,
        vendors: ["Tech Solutions Inc", "Global Supply Co"],
        regions: ["North America", "Europe"]
      },
      {
        item: "Office Chair",
        avgPrice: 320.00,
        minPrice: 275.00,
        maxPrice: 385.00,
        variance: 34.4,
        totalQuantity: 200,
        vendors: ["Office Essentials Ltd", "Facility Pros"],
        regions: ["North America", "Asia Pacific"]
      }
    ],
    topVendors: [
      {
        vendor: "Global Supply Co",
        spend: 2490000,
        orders: 125,
        avgDeliveryScore: 4.2,
        offContractPercentage: 12.0,
        performanceScore: 87.5
      },
      {
        vendor: "Tech Solutions Inc",
        spend: 1743000,
        orders: 89,
        avgDeliveryScore: 4.5,
        offContractPercentage: 8.0,
        performanceScore: 92.0
      }
    ],
    maverickAnalysis: {
      offContractSpend: 1867500,
      offContractPercentage: 15.0,
      offContractOrders: 187,
      potentialSavings: 280125,
      topOffContractVendors: [
        {
          vendor: "Quick Office Supply",
          offContractSpend: 456000,
          offContractOrders: 45
        },
        {
          vendor: "Emergency IT Services",
          offContractSpend: 312000,
          offContractOrders: 28
        }
      ]
    }
  }
}

function generateDemoInsights(): Insight[] {
  return [
    {
      id: "1",
      title: "Vendor Consolidation Opportunity",
      description: "Consolidating purchases with top 3 vendors could yield 12% cost savings",
      potentialSaving: 1494000,
      priority: "high",
      category: "vendor-management",
      implementationTime: "3-6 months",
      impact: "high",
      status: "pending"
    },
    {
      id: "2", 
      title: "Contract Renegotiation",
      description: "IT equipment contracts due for renewal with potential 8% savings",
      potentialSaving: 298800,
      priority: "medium",
      category: "contract-optimization",
      implementationTime: "1-3 months",
      impact: "medium",
      status: "pending"
    }
  ]
}

export function useProcurementData() {
  const [data, setData] = useState<ProcurementAnalysis | null>(null)
  const [insights, setInsights] = useState<Insight[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async (filters: FilterState) => {
    try {
      setLoading(true)
      setError(null)

      // Check if Supabase is properly connected
      const hasRealCredentials = import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_URL !== 'https://placeholder.supabase.co'
      
      if (!hasRealCredentials) {
        // Return demo data when Supabase isn't connected
        console.log('🎭 Dashboard running in DEMO MODE - using sample data. Connect Supabase integration for live data.');
        const demoData = generateDemoData()
        setData(demoData)
        setInsights(generateDemoInsights())
        setLoading(false)
        return
      }

      console.log('🔗 Dashboard running in LIVE MODE - fetching data from Supabase.');

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
        'analyze-procurement?' + params.toString(),
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
  }, []) // Empty dependency array since this function doesn't depend on any props or state

  const exportReport = async (format: 'pdf' | 'excel') => {
    if (!data || !insights) return

    try {
      const currentDate = new Date().toISOString().split('T')[0];
      const reportData = {
        format,
        analysisData: data,
        insights,
        metadata: {
          generatedDate: currentDate,
          filters: {
            dateRange: 'Applied filters data', // You can pass actual filters here
            totalRecords: data.summary.totalOrders,
            totalSpend: data.summary.totalSpend
          },
          companyInfo: {
            name: "Your Company",
            logo: import.meta.env.BASE_URL + "placeholder.svg", // Use available placeholder
            reportTitle: `Procurement Analysis Report - ${currentDate}`
          }
        }
      };

      const { data: reportBlob, error } = await supabase.functions.invoke(
        'export-report',
        {
          body: reportData
        }
      )

      if (error) throw error

      // Create download link with proper filename
      const blob = new Blob([reportBlob], {
        type: format === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `procurement-analysis-${currentDate}.${format === 'pdf' ? 'pdf' : 'xlsx'}`
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
      .select('vendor_name')
      .order('vendor_name')

    if (error) throw error

    return [...new Set(data.map(row => row.vendor_name))].sort()
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