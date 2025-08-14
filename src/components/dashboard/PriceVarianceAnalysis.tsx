import { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine
} from "recharts";
import { AlertTriangle, TrendingUp, DollarSign, Package, Loader2 } from "lucide-react";
import { useProcurementData } from "@/hooks/useProcurementData";

interface FilterState {
  vendor: string;
  category: string;
  region: string;
  dateRange: string;
}

interface PriceVarianceAnalysisProps {
  filters: FilterState;
}

export function PriceVarianceAnalysis({ filters }: PriceVarianceAnalysisProps) {
  const { data, loading, error, fetchData } = useProcurementData();

  useEffect(() => {
    fetchData(filters);
  }, [filters, fetchData]);

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

  const priceVarianceData = data.priceVariance.map((item, index) => ({
    item: item.item,
    avgPrice: item.avgPrice,
    minPrice: item.minPrice,
    maxPrice: item.maxPrice,
    variance: item.variance,
    totalQuantity: item.totalQuantity,
    vendors: item.vendors,
    regions: item.regions,
    supplier: item.vendors[0] || "Multiple",
    region: item.regions[0] || "Multiple",
    quantity: item.totalQuantity
  }));

  const highVarianceItems = priceVarianceData.filter(item => item.variance > 20).length;
  const totalItemsAnalyzed = priceVarianceData.length;
  const avgVariance = Math.round(priceVarianceData.reduce((sum, item) => sum + item.variance, 0) / priceVarianceData.length);

  const formatCurrency = (value: number) => `$${value}`;
  
  const getVarianceColor = (variance: number) => {
    if (variance > 25) return "#ef4444"; // danger
    if (variance > 15) return "#f59e0b"; // warning  
    return "#10b981"; // success
  };

  const getVarianceBadge = (variance: number) => {
    if (variance > 25) return <Badge className="bg-danger/10 text-danger">High Risk</Badge>;
    if (variance > 15) return <Badge className="bg-warning/10 text-warning">Medium Risk</Badge>;
    return <Badge className="bg-success/10 text-success">Low Risk</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="dashboard-card p-4 border-l-4 border-l-warning">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">High Variance Items</p>
              <p className="text-2xl font-bold text-warning">{highVarianceItems}</p>
              <p className="text-xs text-muted-foreground">Require immediate attention</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-warning" />
          </div>
        </Card>

        <Card className="dashboard-card p-4 border-l-4 border-l-primary">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Average Variance</p>
              <p className="text-2xl font-bold text-primary">{avgVariance}%</p>
              <p className="text-xs text-muted-foreground">Across all items</p>
            </div>
            <TrendingUp className="h-8 w-8 text-primary" />
          </div>
        </Card>

        <Card className="dashboard-card p-4 border-l-4 border-l-teal">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Items Analyzed</p>
              <p className="text-2xl font-bold text-teal">{totalItemsAnalyzed}</p>
              <p className="text-xs text-muted-foreground">In current analysis</p>
            </div>
            <Package className="h-8 w-8 text-teal" />
          </div>
        </Card>
      </div>

      {/* Price Variance Scatter Plot */}
      <Card className="chart-container">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Price Variance Analysis</h3>
          <div className="text-sm text-muted-foreground">
            Bubble size = Purchase Quantity
          </div>
        </div>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                type="number" 
                dataKey="avgPrice" 
                name="Average Price"
                tickFormatter={formatCurrency}
                stroke="hsl(var(--muted-foreground))"
              />
              <YAxis 
                type="number" 
                dataKey="variance" 
                name="Price Variance %"
                tickFormatter={(value) => `${value}%`}
                stroke="hsl(var(--muted-foreground))"
              />
              <Tooltip 
                cursor={{ strokeDasharray: '3 3' }}
                content={({ active, payload }) => {
                  if (active && payload && payload[0]) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
                        <p className="font-medium">{data.item}</p>
                        <p className="text-sm text-muted-foreground">Supplier: {data.supplier}</p>
                        <p className="text-sm text-muted-foreground">Region: {data.region}</p>
                        <p className="text-sm">Avg Price: {formatCurrency(data.avgPrice)}</p>
                        <p className="text-sm">Variance: {data.variance}%</p>
                        <p className="text-sm">Quantity: {data.quantity}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <ReferenceLine y={20} stroke="hsl(var(--warning))" strokeDasharray="5 5" />
              <Scatter 
                data={priceVarianceData} 
                fill="hsl(var(--primary))"
              >
                {priceVarianceData.map((entry, index) => (
                  <circle 
                    key={index}
                    r={Math.max(3, entry.quantity / 30)} 
                    fill={getVarianceColor(entry.variance)}
                    fillOpacity={0.8}
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 text-sm text-muted-foreground">
          * Items above the dashed line (20% variance) require price optimization
        </div>
      </Card>

      {/* Detailed Price Variance Table */}
      <Card className="dashboard-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Price Variance Details</h3>
          <Button variant="outline" size="sm">
            Export Analysis
          </Button>
        </div>
        
        <div className="space-y-3">
          {priceVarianceData
            .sort((a, b) => b.variance - a.variance)
            .slice(0, 8)
            .map((item, index) => (
            <div 
              key={index} 
              className="flex items-center justify-between p-3 rounded-lg border border-border-light hover:bg-secondary/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: getVarianceColor(item.variance) }}
                  />
                  <span className="font-medium">{item.item}</span>
                </div>
                {getVarianceBadge(item.variance)}
              </div>
              
              <div className="flex items-center gap-6 text-sm">
                <div className="text-center">
                  <p className="text-muted-foreground">Avg Price</p>
                  <p className="font-medium">{formatCurrency(item.avgPrice)}</p>
                </div>
                <div className="text-center">
                  <p className="text-muted-foreground">Variance</p>
                  <p className="font-bold" style={{ color: getVarianceColor(item.variance) }}>
                    {item.variance}%
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-muted-foreground">Supplier</p>
                  <p className="font-medium">{item.supplier}</p>
                </div>
                <div className="text-center">
                  <p className="text-muted-foreground">Quantity</p>
                  <p className="font-medium">{item.quantity}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 pt-4 border-t border-border-light">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              Showing top 8 items with highest price variance
            </span>
            <Button variant="link" size="sm" className="text-primary">
              View All Items →
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}