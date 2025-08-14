import { useState } from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardFilters } from "@/components/dashboard/DashboardFilters";
import { SpendOverview } from "@/components/dashboard/SpendOverview";
import { PriceVarianceAnalysis } from "@/components/dashboard/PriceVarianceAnalysis";
import { CostSavingsInsights } from "@/components/dashboard/CostSavingsInsights";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { 
  BarChart3, 
  TrendingDown, 
  Lightbulb, 
  Users, 
  AlertTriangle,
  Package
} from "lucide-react";

interface FilterState {
  vendor: string;
  category: string;
  region: string;
  dateRange: string;
}

export default function Dashboard() {
  const [filters, setFilters] = useState<FilterState>({
    vendor: "",
    category: "",
    region: "",
    dateRange: "last-30-days"
  });

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    // In a real app, this would trigger data refetch with new filters
    console.log("Filters updated:", newFilters);
  };

  return (
    <div className="dashboard-container min-h-screen">
      <DashboardHeader />
      
      <main className="px-6 py-6 space-y-6">
        <DashboardFilters onFiltersChange={handleFiltersChange} />
        
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="variance" className="flex items-center gap-2">
              <TrendingDown className="h-4 w-4" />
              <span className="hidden sm:inline">Price Variance</span>
            </TabsTrigger>
            <TabsTrigger value="maverick" className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              <span className="hidden sm:inline">Maverick Spend</span>
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              <span className="hidden sm:inline">AI Insights</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <SpendOverview filters={filters} />
          </TabsContent>

          <TabsContent value="variance" className="space-y-6">
            <PriceVarianceAnalysis filters={filters} />
          </TabsContent>

          <TabsContent value="maverick" className="space-y-6">
            <Card className="dashboard-card p-8 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="p-4 bg-warning/10 rounded-full">
                  <Package className="h-12 w-12 text-warning" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    Maverick Spend Detection
                  </h3>
                  <p className="text-muted-foreground max-w-md">
                    This module analyzes off-contract purchases and identifies spending outside 
                    approved vendor agreements. Implementation in progress.
                  </p>
                </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 w-full max-w-2xl">
                  <div className="text-center p-4 bg-secondary/30 rounded-lg">
                    <div className="text-2xl font-bold text-warning">Coming Soon</div>
                    <div className="text-sm text-muted-foreground">Off-Contract Spend</div>
                  </div>
                  <div className="text-center p-4 bg-secondary/30 rounded-lg">
                    <div className="text-2xl font-bold text-danger">Coming Soon</div>
                    <div className="text-sm text-muted-foreground">Unauthorized Vendors</div>
                  </div>
                  <div className="text-center p-4 bg-secondary/30 rounded-lg">
                    <div className="text-2xl font-bold text-primary">Coming Soon</div>
                    <div className="text-sm text-muted-foreground">Potential Savings</div>
                  </div>
                  <div className="text-center p-4 bg-secondary/30 rounded-lg">
                    <div className="text-2xl font-bold text-success">Coming Soon</div>
                    <div className="text-sm text-muted-foreground">Compliance Target</div>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <CostSavingsInsights filters={filters} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}