import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ProcurementOrder {
  id: string
  vendor: string
  category: string
  item_name: string
  quantity: number
  unit_price: number
  total_amount: number
  region: string
  order_date: string
  contract_type: string
  delivery_score: number
}

interface AnalysisFilters {
  vendor?: string
  category?: string
  region?: string
  startDate?: string
  endDate?: string
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    const url = new URL(req.url)
    const filters: AnalysisFilters = {
      vendor: url.searchParams.get('vendor') || undefined,
      category: url.searchParams.get('category') || undefined,
      region: url.searchParams.get('region') || undefined,
      startDate: url.searchParams.get('startDate') || undefined,
      endDate: url.searchParams.get('endDate') || undefined,
    }

    // Build query with filters
    let query = supabaseClient
      .from('procurement_orders')
      .select('*')

    if (filters.vendor) {
      query = query.eq('vendor', filters.vendor)
    }
    if (filters.category) {
      query = query.eq('category', filters.category)
    }
    if (filters.region) {
      query = query.eq('region', filters.region)
    }
    if (filters.startDate) {
      query = query.gte('order_date', filters.startDate)
    }
    if (filters.endDate) {
      query = query.lte('order_date', filters.endDate)
    }

    const { data: orders, error } = await query

    if (error) {
      throw error
    }

    // Calculate comprehensive analysis
    const analysis = calculateAnalysis(orders as ProcurementOrder[])

    return new Response(
      JSON.stringify(analysis),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})

function calculateAnalysis(orders: ProcurementOrder[]) {
  // Total spend analysis
  const totalSpend = orders.reduce((sum, order) => sum + parseFloat(order.total_amount.toString()), 0)
  const totalOrders = orders.length
  const uniqueVendors = new Set(orders.map(o => o.vendor)).size

  // Spend by vendor
  const vendorSpend = orders.reduce((acc, order) => {
    const vendor = order.vendor
    const spend = parseFloat(order.total_amount.toString())
    if (!acc[vendor]) {
      acc[vendor] = { 
        spend: 0, 
        orders: 0, 
        avgDeliveryScore: 0,
        onContractSpend: 0,
        offContractSpend: 0
      }
    }
    acc[vendor].spend += spend
    acc[vendor].orders += 1
    acc[vendor].avgDeliveryScore += order.delivery_score
    
    if (order.contract_type === 'contract') {
      acc[vendor].onContractSpend += spend
    } else {
      acc[vendor].offContractSpend += spend
    }
    
    return acc
  }, {} as Record<string, any>)

  // Calculate vendor metrics
  Object.keys(vendorSpend).forEach(vendor => {
    vendorSpend[vendor].avgDeliveryScore = vendorSpend[vendor].avgDeliveryScore / vendorSpend[vendor].orders
    vendorSpend[vendor].offContractPercentage = (vendorSpend[vendor].offContractSpend / vendorSpend[vendor].spend) * 100
  })

  // Spend by category
  const categorySpend = orders.reduce((acc, order) => {
    const category = order.category
    const spend = parseFloat(order.total_amount.toString())
    acc[category] = (acc[category] || 0) + spend
    return acc
  }, {} as Record<string, number>)

  // Spend by region
  const regionSpend = orders.reduce((acc, order) => {
    const region = order.region
    const spend = parseFloat(order.total_amount.toString())
    acc[region] = (acc[region] || 0) + spend
    return acc
  }, {} as Record<string, number>)

  // Price variance analysis
  const itemPrices = orders.reduce((acc, order) => {
    const item = order.item_name
    if (!acc[item]) {
      acc[item] = []
    }
    acc[item].push({
      price: order.unit_price,
      vendor: order.vendor,
      region: order.region,
      quantity: order.quantity,
      order_date: order.order_date
    })
    return acc
  }, {} as Record<string, any[]>)

  const priceVarianceAnalysis = Object.keys(itemPrices).map(item => {
    const prices = itemPrices[item]
    if (prices.length < 2) return null

    const priceValues = prices.map(p => p.price)
    const avgPrice = priceValues.reduce((sum, p) => sum + p, 0) / priceValues.length
    const minPrice = Math.min(...priceValues)
    const maxPrice = Math.max(...priceValues)
    const variance = ((maxPrice - minPrice) / avgPrice) * 100

    return {
      item,
      avgPrice,
      minPrice,
      maxPrice,
      variance,
      totalQuantity: prices.reduce((sum, p) => sum + p.quantity, 0),
      vendors: [...new Set(prices.map(p => p.vendor))],
      regions: [...new Set(prices.map(p => p.region))]
    }
  }).filter(Boolean).sort((a, b) => (b?.variance || 0) - (a?.variance || 0))

  // Maverick spend analysis
  const offContractOrders = orders.filter(o => o.contract_type === 'maverick')
  const maverickSpend = offContractOrders.reduce((sum, order) => sum + parseFloat(order.total_amount.toString()), 0)
  const maverickPercentage = (maverickSpend / totalSpend) * 100
  
  // Estimate potential savings (assume 15% savings on off-contract items)
  const potentialMaverickSavings = maverickSpend * 0.15

  // Calculate additional potential savings from price variance
  const potentialVarianceSavings = priceVarianceAnalysis.slice(0, 10).reduce((sum, item) => {
    if (!item) return sum
    const avgOrder = orders.filter(o => o.item_name === item.item)
    const totalItemSpend = avgOrder.reduce((s, o) => s + parseFloat(o.total_amount.toString()), 0)
    // Assume 10% savings if all purchases were at minimum price
    return sum + (totalItemSpend * 0.1)
  }, 0)

  // Top vendors by spend
  const topVendors = Object.entries(vendorSpend)
    .map(([vendor, data]: [string, any]) => ({
      vendor,
      spend: data.spend,
      orders: data.orders,
      avgDeliveryScore: Math.round(data.avgDeliveryScore * 10) / 10,
      offContractPercentage: Math.round(data.offContractPercentage * 10) / 10,
      performanceScore: calculatePerformanceScore(data)
    }))
    .sort((a, b) => b.spend - a.spend)
    .slice(0, 10)

  return {
    summary: {
      totalSpend,
      totalOrders,
      uniqueVendors,
      maverickSpend,
      maverickPercentage,
      potentialSavings: potentialMaverickSavings + potentialVarianceSavings,
      avgOrderValue: totalSpend / totalOrders
    },
    spendByVendor: Object.entries(vendorSpend).map(([vendor, data]: [string, any]) => ({
      vendor,
      spend: data.spend,
      percentage: (data.spend / totalSpend) * 100
    })).sort((a, b) => b.spend - a.spend),
    spendByCategory: Object.entries(categorySpend).map(([category, spend]) => ({
      category,
      spend,
      percentage: (spend / totalSpend) * 100
    })).sort((a, b) => b.spend - a.spend),
    spendByRegion: Object.entries(regionSpend).map(([region, spend]) => ({
      region,
      spend,
      percentage: (spend / totalSpend) * 100
    })).sort((a, b) => b.spend - a.spend),
    priceVariance: priceVarianceAnalysis.slice(0, 20),
    topVendors,
    maverickAnalysis: {
      offContractSpend: maverickSpend,
      offContractPercentage: maverickPercentage,
      offContractOrders: offContractOrders.length,
      potentialSavings: potentialMaverickSavings,
      topOffContractVendors: getTopOffContractVendors(offContractOrders)
    }
  }
}

function calculatePerformanceScore(vendorData: any): number {
  // Performance score based on delivery score, contract compliance, and order volume
  const deliveryWeight = 0.4
  const complianceWeight = 0.4
  const volumeWeight = 0.2

  const deliveryScore = (vendorData.avgDeliveryScore / 5) * 100
  const complianceScore = ((vendorData.spend - vendorData.offContractSpend) / vendorData.spend) * 100
  const volumeScore = Math.min(100, (vendorData.orders / 50) * 100) // Normalize to 50 orders = 100%

  return Math.round(
    (deliveryScore * deliveryWeight + complianceScore * complianceWeight + volumeScore * volumeWeight) * 10
  ) / 10
}

function getTopOffContractVendors(offContractOrders: ProcurementOrder[]) {
  const vendorOffContract = offContractOrders.reduce((acc, order) => {
    const vendor = order.vendor
    const spend = parseFloat(order.total_amount.toString())
    if (!acc[vendor]) {
      acc[vendor] = { spend: 0, orders: 0 }
    }
    acc[vendor].spend += spend
    acc[vendor].orders += 1
    return acc
  }, {} as Record<string, any>)

  return Object.entries(vendorOffContract)
    .map(([vendor, data]: [string, any]) => ({
      vendor,
      offContractSpend: data.spend,
      offContractOrders: data.orders
    }))
    .sort((a, b) => b.offContractSpend - a.offContractSpend)
    .slice(0, 5)
}