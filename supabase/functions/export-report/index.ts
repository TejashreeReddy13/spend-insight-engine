import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ExportRequest {
  format: 'pdf' | 'excel'
  analysisData: any
  insights: any[]
  metadata?: {
    generatedDate: string
    filters: any
    companyInfo: {
      name: string
      logo: string
      reportTitle: string
    }
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { format, analysisData, insights, metadata }: ExportRequest = await req.json()

    if (format === 'pdf') {
      const pdfData = await generatePDFReport(analysisData, insights)
      return new Response(pdfData, {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'attachment; filename="procurement-analysis.pdf"'
        }
      })
    } else if (format === 'excel') {
      const excelData = await generateExcelReport(analysisData, insights)
      return new Response(excelData, {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': 'attachment; filename="procurement-analysis.xlsx"'
        }
      })
    }

    throw new Error('Invalid format specified')

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

async function generatePDFReport(analysisData: any, insights: any[]) {
  // For this implementation, we'll generate a structured HTML report
  // In production, you might use a library like Puppeteer or jsPDF
  
  const formatCurrency = (amount: number) => `$${(amount / 1000000).toFixed(1)}M`
  const formatNumber = (num: number) => num.toLocaleString()

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Procurement Analysis Report</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; color: #333; }
        .header { text-align: center; margin-bottom: 40px; border-bottom: 3px solid #2563eb; padding-bottom: 20px; }
        .summary-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 30px 0; }
        .summary-card { background: #f8fafc; padding: 20px; border-radius: 8px; border-left: 4px solid #2563eb; }
        .metric-value { font-size: 2em; font-weight: bold; color: #2563eb; }
        .section { margin: 40px 0; page-break-inside: avoid; }
        .section h2 { color: #2563eb; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #e2e8f0; }
        th { background-color: #f1f5f9; font-weight: bold; }
        .insight-card { background: #f0fdf4; border-left: 4px solid #16a34a; padding: 20px; margin: 15px 0; border-radius: 4px; }
        .priority-high { border-left-color: #dc2626; background: #fef2f2; }
        .priority-medium { border-left-color: #d97706; background: #fffbeb; }
        .footer { margin-top: 50px; text-align: center; color: #6b7280; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Procurement Spend & Savings Analysis Report</h1>
        <p>Generated on ${new Date().toLocaleDateString()}</p>
      </div>

      <div class="section">
        <h2>Executive Summary</h2>
        <div class="summary-grid">
          <div class="summary-card">
            <div class="metric-value">${formatCurrency(analysisData.summary.totalSpend)}</div>
            <div>Total Spend</div>
          </div>
          <div class="summary-card">
            <div class="metric-value">${formatNumber(analysisData.summary.uniqueVendors)}</div>
            <div>Active Vendors</div>
          </div>
          <div class="summary-card">
            <div class="metric-value">${formatCurrency(analysisData.summary.potentialSavings)}</div>
            <div>Potential Savings</div>
          </div>
          <div class="summary-card">
            <div class="metric-value">${analysisData.summary.maverickPercentage.toFixed(1)}%</div>
            <div>Off-Contract Spend</div>
          </div>
        </div>
      </div>

      <div class="section">
        <h2>Top Vendors by Spend</h2>
        <table>
          <thead>
            <tr>
              <th>Vendor</th>
              <th>Total Spend</th>
              <th>Orders</th>
              <th>Performance Score</th>
              <th>Off-Contract %</th>
            </tr>
          </thead>
          <tbody>
            ${analysisData.topVendors.slice(0, 10).map((vendor: any) => `
              <tr>
                <td>${vendor.vendor}</td>
                <td>${formatCurrency(vendor.spend)}</td>
                <td>${vendor.orders}</td>
                <td>${vendor.performanceScore}/100</td>
                <td>${vendor.offContractPercentage.toFixed(1)}%</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <div class="section">
        <h2>Price Variance Analysis</h2>
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Average Price</th>
              <th>Price Variance</th>
              <th>Total Quantity</th>
              <th>Vendor Count</th>
            </tr>
          </thead>
          <tbody>
            ${analysisData.priceVariance.slice(0, 15).map((item: any) => `
              <tr>
                <td>${item.item}</td>
                <td>$${item.avgPrice.toFixed(2)}</td>
                <td>${item.variance.toFixed(1)}%</td>
                <td>${formatNumber(item.totalQuantity)}</td>
                <td>${item.vendors.length}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <div class="section">
        <h2>Cost-Saving Insights & Recommendations</h2>
        ${insights.map((insight: any) => `
          <div class="insight-card ${insight.priority === 'High' ? 'priority-high' : insight.priority === 'Critical' ? 'priority-high' : 'priority-medium'}">
            <h3>${insight.title}</h3>
            <p><strong>Potential Savings:</strong> ${formatCurrency(insight.potentialSaving)}</p>
            <p><strong>Priority:</strong> ${insight.priority} | <strong>Timeline:</strong> ${insight.implementationTime}</p>
            <p>${insight.description}</p>
            <p><strong>Impact:</strong> ${insight.impact}</p>
          </div>
        `).join('')}
      </div>

      <div class="section">
        <h2>Spend Breakdown by Category</h2>
        <table>
          <thead>
            <tr>
              <th>Category</th>
              <th>Total Spend</th>
              <th>Percentage of Total</th>
            </tr>
          </thead>
          <tbody>
            ${analysisData.spendByCategory.slice(0, 10).map((category: any) => `
              <tr>
                <td>${category.category}</td>
                <td>${formatCurrency(category.spend)}</td>
                <td>${category.percentage.toFixed(1)}%</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <div class="footer">
        <p>This report was generated by the Procurement Analytics System</p>
        <p>For questions or additional analysis, please contact your procurement team</p>
      </div>
    </body>
    </html>
  `

  // Convert HTML to base64 (simplified for this example)
  // In production, use proper PDF generation
  return new TextEncoder().encode(html)
}

async function generateExcelReport(analysisData: any, insights: any[]) {
  // For this implementation, we'll generate CSV format
  // In production, you might use a library like ExcelJS
  
  const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`
  
  let csvContent = "Procurement Analysis Report\n\n"
  
  // Summary Section
  csvContent += "Executive Summary\n"
  csvContent += "Metric,Value\n"
  csvContent += `Total Spend,${formatCurrency(analysisData.summary.totalSpend)}\n`
  csvContent += `Active Vendors,${analysisData.summary.uniqueVendors}\n`
  csvContent += `Potential Savings,${formatCurrency(analysisData.summary.potentialSavings)}\n`
  csvContent += `Off-Contract Spend %,${analysisData.summary.maverickPercentage.toFixed(1)}%\n\n`
  
  // Top Vendors
  csvContent += "Top Vendors by Spend\n"
  csvContent += "Vendor,Total Spend,Orders,Performance Score,Off-Contract %\n"
  analysisData.topVendors.slice(0, 15).forEach((vendor: any) => {
    csvContent += `"${vendor.vendor}",${formatCurrency(vendor.spend)},${vendor.orders},${vendor.performanceScore},${vendor.offContractPercentage.toFixed(1)}%\n`
  })
  csvContent += "\n"
  
  // Price Variance
  csvContent += "Price Variance Analysis\n"
  csvContent += "Item,Average Price,Price Variance,Total Quantity,Vendor Count\n"
  analysisData.priceVariance.slice(0, 20).forEach((item: any) => {
    csvContent += `"${item.item}",${formatCurrency(item.avgPrice)},${item.variance.toFixed(1)}%,${item.totalQuantity},${item.vendors.length}\n`
  })
  csvContent += "\n"
  
  // Insights
  csvContent += "Cost-Saving Insights\n"
  csvContent += "Title,Potential Savings,Priority,Timeline,Category,Description\n"
  insights.forEach((insight: any) => {
    csvContent += `"${insight.title}",${formatCurrency(insight.potentialSaving)},"${insight.priority}","${insight.implementationTime}","${insight.category}","${insight.description.replace(/"/g, '""')}"\n`
  })
  
  return new TextEncoder().encode(csvContent)
}