import { useEffect } from "react";
import { KPICard } from "./KPICard";
import { Card } from "@/components/ui/card";
import { DollarSign, Users, Package, TrendingUp, Building2, Loader2 } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { useProcurementData } from "@/hooks/useProcurementData";

interface FilterState {
  vendor: string;
  category: string;
  region: string;
  dateRange: string;
}

interface SpendOverviewProps {
  filters: FilterState;
}

export function SpendOverview({ filters }: SpendOverviewProps) {
  const { data, loading, error, fetchData } = useProcurementData();

  useEffect(() => {
    fetchData(filters);
  }, [filters, fetchData]);
  const formatCurrency = (value: number) => `$${(value / 1000000).toFixed(1)}M`;
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">Failed to load data: {error}</p>
      </div>
    );
  }

  const categoryData = data.spendByCategory.map((cat, index) => ({
    name: cat.category,
    value: cat.spend,
    color: `hsl(var(--chart-${(index % 5) + 1}))`
  }));

  const topVendors = data.topVendors.slice(0, 5).map(vendor => ({
    name: vendor.vendor,
    spend: vendor.spend,
    contracts: vendor.orders,
    performance: vendor.performanceScore
  }));

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="kpi-grid">
        <KPICard
          title="Total Spend"
          value={formatCurrency(data.summary.totalSpend)}
          subtitle="Filtered Period"
          change={8.5}
          changeLabel="vs prev period"
          icon={<DollarSign className="h-5 w-5" />}
          variant="success"
        />
        
        <KPICard
          title="Active Vendors"
          value={data.summary.uniqueVendors}
          subtitle="Unique Suppliers"
          change={-3.2}
          changeLabel="vendor optimization"
          icon={<Users className="h-5 w-5" />}
        />
        
        <KPICard
          title="Purchase Orders"
          value={data.summary.totalOrders.toLocaleString()}
          subtitle="Total Orders"
          change={12.8}
          changeLabel="vs prev period"
          icon={<Package className="h-5 w-5" />}
        />
        
        <KPICard
          title="Potential Savings"
          value={formatCurrency(data.summary.potentialSavings)}
          subtitle="Identified Opportunities"
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
              Total: {formatCurrency(data.summary.totalSpend)}
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