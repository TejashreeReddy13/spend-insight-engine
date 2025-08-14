import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface InsightRequest {
  analysisData: any
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { analysisData }: InsightRequest = await req.json()

    const insights = generateCostSavingInsights(analysisData)

    return new Response(
      JSON.stringify({ insights }),
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

function generateCostSavingInsights(data: any) {
  const insights = []
  
  // Vendor Consolidation Opportunities
  if (data.spendByVendor && data.spendByVendor.length > 50) {
    const smallVendors = data.spendByVendor.filter((v: any) => v.percentage < 2)
    const consolidationSavings = smallVendors.reduce((sum: number, v: any) => sum + v.spend, 0) * 0.12
    
    insights.push({
      id: 'vendor-consolidation',
      title: 'Vendor Consolidation Opportunity',
      description: `You have ${smallVendors.length} vendors representing less than 2% of total spend each. Consolidating with preferred vendors could reduce administrative costs and improve negotiating power.`,
      potentialSaving: consolidationSavings,
      priority: 'High',
      category: 'Vendor Management',
      implementationTime: '3-6 months',
      impact: 'Reduces vendor management overhead and improves pricing power',
      status: 'Identified'
    })
  }

  // Price Variance Optimization
  if (data.priceVariance && data.priceVariance.length > 0) {
    const highVarianceItems = data.priceVariance.filter((item: any) => item.variance > 25)
    const varianceSavings = highVarianceItems.reduce((sum: number, item: any) => {
      const totalItemValue = data.summary.totalSpend * 0.1 // Estimate item represents 10% of spend
      return sum + (totalItemValue * (item.variance / 100) * 0.3) // 30% of variance as savings
    }, 0)

    insights.push({
      id: 'price-standardization',
      title: 'Price Standardization Initiative',
      description: `${highVarianceItems.length} items show price variance above 25%. Standardizing procurement of these items could significantly reduce costs.`,
      potentialSaving: varianceSavings,
      priority: 'High',
      category: 'Price Optimization',
      implementationTime: '2-4 months',
      impact: 'Standardizes pricing and reduces procurement costs',
      status: 'Identified'
    })
  }

  // Maverick Spend Reduction
  if (data.maverickAnalysis && data.maverickAnalysis.offContractPercentage > 15) {
    insights.push({
      id: 'maverick-spend',
      title: 'Maverick Spend Reduction',
      description: `${data.maverickAnalysis.offContractPercentage.toFixed(1)}% of spending is off-contract. Implementing stricter procurement controls and preferred vendor programs can capture significant savings.`,
      potentialSaving: data.maverickAnalysis.potentialSavings,
      priority: 'Critical',
      category: 'Compliance',
      implementationTime: '1-3 months',
      impact: 'Improves contract compliance and reduces rogue spending',
      status: 'Identified'
    })
  }

  // Volume Discount Opportunities
  if (data.spendByCategory) {
    const largeCategories = data.spendByCategory.filter((cat: any) => cat.percentage > 10)
    const volumeSavings = largeCategories.reduce((sum: number, cat: any) => sum + (cat.spend * 0.08), 0)

    insights.push({
      id: 'volume-discounts',
      title: 'Volume Discount Negotiation',
      description: `Large spending categories (${largeCategories.map((c: any) => c.category).join(', ')}) present opportunities for volume-based pricing negotiations.`,
      potentialSaving: volumeSavings,
      priority: 'Medium',
      category: 'Contract Negotiation',
      implementationTime: '4-8 months',
      impact: 'Leverages spending volume for better pricing terms',
      status: 'Identified'
    })
  }

  // Regional Pricing Optimization
  if (data.spendByRegion && data.spendByRegion.length > 1) {
    const regionVariation = Math.max(...data.spendByRegion.map((r: any) => r.percentage)) - 
                           Math.min(...data.spendByRegion.map((r: any) => r.percentage))
    
    if (regionVariation > 20) {
      insights.push({
        id: 'regional-optimization',
        title: 'Regional Pricing Optimization',
        description: 'Significant regional spending variations detected. Implementing global pricing agreements could reduce costs across regions.',
        potentialSaving: data.summary.totalSpend * 0.06,
        priority: 'Medium',
        category: 'Global Sourcing',
        implementationTime: '6-12 months',
        impact: 'Harmonizes pricing across regions and improves cost predictability',
        status: 'Identified'
      })
    }
  }

  // Performance-Based Vendor Selection
  if (data.topVendors) {
    const lowPerformanceVendors = data.topVendors.filter((v: any) => v.performanceScore < 70)
    if (lowPerformanceVendors.length > 0) {
      const performanceSavings = lowPerformanceVendors.reduce((sum: number, v: any) => sum + v.spend, 0) * 0.15

      insights.push({
        id: 'vendor-performance',
        title: 'Vendor Performance Improvement',
        description: `${lowPerformanceVendors.length} key vendors have performance scores below 70%. Implementing performance improvement programs or vendor replacement could reduce costs and improve service quality.`,
        potentialSaving: performanceSavings,
        priority: 'Medium',
        category: 'Vendor Management',
        implementationTime: '3-6 months',
        impact: 'Improves service quality and reduces operational disruptions',
        status: 'Identified'
      })
    }
  }

  // Digital Procurement Automation
  insights.push({
    id: 'automation-opportunity',
    title: 'Procurement Process Automation',
    description: 'Implementing e-procurement platforms and automated approval workflows can reduce processing costs and improve compliance.',
    potentialSaving: data.summary.totalSpend * 0.04,
    priority: 'Medium',
    category: 'Process Improvement',
    implementationTime: '6-12 months',
    impact: 'Reduces manual processing costs and improves process efficiency',
    status: 'Identified'
  })

  // Strategic Sourcing Initiative
  if (data.summary.totalSpend > 5000000) { // $5M+ spend
    insights.push({
      id: 'strategic-sourcing',
      title: 'Strategic Sourcing Initiative',
      description: 'Your spend volume qualifies for strategic sourcing initiatives. Implementing category management and supplier relationship management can drive significant value.',
      potentialSaving: data.summary.totalSpend * 0.12,
      priority: 'High',
      category: 'Strategic Sourcing',
      implementationTime: '8-18 months',
      impact: 'Transforms procurement from tactical to strategic value driver',
      status: 'Identified'
    })
  }

  return insights.slice(0, 8) // Return top 8 insights
}