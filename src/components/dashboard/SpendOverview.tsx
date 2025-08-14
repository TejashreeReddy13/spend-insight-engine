import { useEffect } from "react";
import { KPICard } from "./KPICard";
import { Card } from "@/components/ui/card";
import { DollarSign, Users, Package, TrendingUp, Building2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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
      <div className="space-y-6">
        <div className="kpi-grid">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <Card className="dashboard-card p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-muted rounded w-24"></div>
                    <div className="h-8 bg-muted rounded w-32"></div>
                    <div className="h-3 bg-muted rounded w-20"></div>
                  </div>
                  <div className="h-12 w-12 bg-muted rounded-lg"></div>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <div className="h-3 w-3 bg-muted rounded-full"></div>
                  <div className="h-3 bg-muted rounded w-16"></div>
                </div>
              </Card>
            </div>
          ))}
        </div>
        <div className="chart-grid">
          {Array.from({ length: 2 }).map((_, i) => (
            <Card key={i} className="chart-container animate-pulse">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="h-6 bg-muted rounded w-48"></div>
                  <div className="h-4 bg-muted rounded w-24"></div>
                </div>
                <div className="h-64 bg-muted rounded-lg"></div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="text-center p-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10 mb-4">
          <Package className="h-8 w-8 text-destructive" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Failed to Load Data</h3>
        <p className="text-muted-foreground mb-4">{error || "Unable to fetch spend overview data"}</p>
        <Button 
          onClick={() => fetchData(filters)} 
          className="animate-fade-in"
        >
          Try Again
        </Button>
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
    <div className="space-y-6 animate-fade-in">
      {/* KPI Cards */}
      <div className="kpi-grid">
          <div className="animate-scale-in" style={{ animationDelay: '0.1s' }}>
            <KPICard
              title="Total Spend"
              value={formatCurrency(data.summary.totalSpend)}
              subtitle="Filtered Period"
              change={8.5}
              changeLabel="vs prev period"
              icon={<DollarSign className="h-5 w-5" />}
              variant="success"
            />
          </div>
          
          <div className="animate-scale-in" style={{ animationDelay: '0.2s' }}>
            <KPICard
              title="Active Vendors"
              value={data.summary.uniqueVendors}
              subtitle="Unique Suppliers"
              change={-3.2}
              changeLabel="vendor optimization"
              icon={<Users className="h-5 w-5" />}
            />
          </div>
          
          <div className="animate-scale-in" style={{ animationDelay: '0.3s' }}>
            <KPICard
              title="Purchase Orders"
              value={data.summary.totalOrders.toLocaleString()}
              subtitle="Total Orders"
              change={12.8}
              changeLabel="vs prev period"
              icon={<Package className="h-5 w-5" />}
            />
          </div>
          
          <div className="animate-scale-in" style={{ animationDelay: '0.4s' }}>
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
        </div>
      </div>

      {/* Charts Section */}
        <div className="chart-grid">
          <div className="animate-scale-in" style={{ animationDelay: '0.5s' }}>
        {/* Category Spend Breakdown */}
            <Card className="chart-container group hover:shadow-xl transition-all duration-500">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Spend by Category</h3>
            <div className="text-sm text-muted-foreground">
              Total: {formatCurrency(data.summary.totalSpend)}
            </div>
          </div>
          
              <div className="h-64 transition-all duration-300 group-hover:scale-[1.02]">
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
          </div>

          <div className="animate-scale-in" style={{ animationDelay: '0.6s' }}>

        {/* Top Vendors */}
        <Card className="chart-container group hover:shadow-xl transition-all duration-500">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Top 5 Vendors by Spend</h3>
            <Building2 className="h-5 w-5 text-primary" />
          </div>
          
          <div className="h-64 transition-all duration-300 group-hover:scale-[1.02]">
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
                  <div 
                    key={index} 
                    className="flex items-center justify-between text-sm p-3 rounded-lg bg-secondary/20 hover:bg-secondary/40 transition-all duration-300 cursor-pointer group"
                  >
                    <span className="font-medium group-hover:text-primary transition-colors">{vendor.name}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-muted-foreground">{vendor.contracts} contracts</span>
                      <span className="text-success font-medium">{vendor.performance}% performance</span>
                      <span className="font-bold group-hover:text-primary transition-colors">{formatCurrency(vendor.spend)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }