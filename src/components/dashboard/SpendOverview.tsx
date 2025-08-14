import { KPICard } from "./KPICard";
import { Card } from "@/components/ui/card";
import { DollarSign, Users, Package, TrendingUp, Building2 } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

const categoryData = [
  { name: "IT Equipment", value: 2845000, color: "hsl(var(--chart-1))" },
  { name: "Office Supplies", value: 1230000, color: "hsl(var(--chart-2))" },
  { name: "Industrial", value: 987000, color: "hsl(var(--chart-3))" },
  { name: "Marketing", value: 654000, color: "hsl(var(--chart-4))" },
  { name: "Facilities", value: 432000, color: "hsl(var(--chart-5))" },
];

const topVendors = [
  { name: "ACME Corp", spend: 1850000, contracts: 12, performance: 95 },
  { name: "Global Supplies", spend: 1420000, contracts: 8, performance: 88 },
  { name: "Tech Solutions", spend: 980000, contracts: 15, performance: 92 },
  { name: "Office Depot", spend: 760000, contracts: 6, performance: 85 },
  { name: "Industrial Co", spend: 650000, contracts: 9, performance: 90 },
];

export function SpendOverview() {
  const totalSpend = categoryData.reduce((sum, item) => sum + item.value, 0);
  const formatCurrency = (value: number) => `$${(value / 1000000).toFixed(1)}M`;

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="kpi-grid">
        <KPICard
          title="Total Spend"
          value={formatCurrency(totalSpend)}
          subtitle="Last 30 Days"
          change={8.5}
          changeLabel="vs prev month"
          icon={<DollarSign className="h-5 w-5" />}
          variant="success"
        />
        
        <KPICard
          title="Active Vendors"
          value={127}
          subtitle="Contracted Suppliers"
          change={-3.2}
          changeLabel="vendor consolidation"
          icon={<Users className="h-5 w-5" />}
        />
        
        <KPICard
          title="Purchase Orders"
          value="1,284"
          subtitle="This Month"
          change={12.8}
          changeLabel="vs prev month"
          icon={<Package className="h-5 w-5" />}
        />
        
        <KPICard
          title="Cost Savings"
          value="$1.2M"
          subtitle="YTD Achieved"
          change={24.5}
          changeLabel="above target"
          icon={<TrendingUp className="h-5 w-5" />}
          variant="success"
        />
      </div>

      {/* Charts Section */}
      <div className="chart-grid">
        {/* Category Spend Breakdown */}
        <Card className="chart-container">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Spend by Category</h3>
            <div className="text-sm text-muted-foreground">
              Total: {formatCurrency(totalSpend)}
            </div>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [formatCurrency(value), "Spend"]}
                  labelFormatter={(label) => `Category: ${label}`}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="grid grid-cols-2 gap-2 mt-4">
            {categoryData.map((category, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: category.color }}
                />
                <span className="text-muted-foreground truncate">{category.name}</span>
                <span className="font-medium ml-auto">{formatCurrency(category.value)}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Top Vendors */}
        <Card className="chart-container">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Top 5 Vendors by Spend</h3>
            <Building2 className="h-5 w-5 text-primary" />
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topVendors} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="name" 
                  fontSize={12}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                  stroke="hsl(var(--muted-foreground))"
                />
                <YAxis 
                  fontSize={12}
                  tickFormatter={formatCurrency}
                  stroke="hsl(var(--muted-foreground))"
                />
                <Tooltip 
                  formatter={(value: number) => [formatCurrency(value), "Spend"]}
                  labelFormatter={(label) => `Vendor: ${label}`}
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)"
                  }}
                />
                <Bar 
                  dataKey="spend" 
                  fill="hsl(var(--primary))" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-4 space-y-2">
            {topVendors.slice(0, 3).map((vendor, index) => (
              <div key={index} className="flex items-center justify-between text-sm p-2 rounded bg-secondary/30">
                <span className="font-medium">{vendor.name}</span>
                <div className="flex items-center gap-4">
                  <span className="text-muted-foreground">{vendor.contracts} contracts</span>
                  <span className="text-success font-medium">{vendor.performance}% performance</span>
                  <span className="font-bold">{formatCurrency(vendor.spend)}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}