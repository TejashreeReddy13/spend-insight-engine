import { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Lightbulb, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Package2, 
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowRight,
  Loader2
} from "lucide-react";
import { useProcurementData } from "@/hooks/useProcurementData";

interface FilterState {
  vendor: string;
  category: string;
  region: string;
  dateRange: string;
}

interface CostSavingsInsightsProps {
  filters: FilterState;
}

export function CostSavingsInsights({ filters }: CostSavingsInsightsProps) {
  const { data, insights, loading, error, fetchData, exportReport } = useProcurementData();

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

  if (error || !insights) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">Failed to load insights: {error}</p>
      </div>
    );
  }

  const totalPotentialSavings = insights.reduce((sum, insight) => sum + insight.potentialSaving, 0);
  
  const getPriorityIcon = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "critical":
      case "high": return <AlertTriangle className="h-4 w-4 text-danger" />;
      case "medium": return <Clock className="h-4 w-4 text-warning" />;
      default: return <CheckCircle className="h-4 w-4 text-success" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "critical":
      case "high": return "border-l-danger bg-danger/5";
      case "medium": return "border-l-warning bg-warning/5";
      default: return "border-l-success bg-success/5";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "identified":
      case "new": return <Badge className="bg-primary/10 text-primary">New</Badge>;
      case "in-progress": return <Badge className="bg-warning/10 text-warning">In Progress</Badge>;
      case "completed": return <Badge className="bg-success/10 text-success">Completed</Badge>;
      default: return null;
    }
  };

  const formatCurrency = (value: number) => `$${(value / 1000).toFixed(0)}K`;

  const handleExportPDF = async () => {
    try {
      await exportReport('pdf');
    } catch (err) {
      console.error('Failed to export PDF:', err);
    }
  };

  const handleExportExcel = async () => {
    try {
      await exportReport('excel');
    } catch (err) {
      console.error('Failed to export Excel:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Total Savings */}
      <Card className="dashboard-card p-6 border-l-4 border-l-success bg-gradient-to-r from-success/5 to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-success/10 rounded-lg">
              <Lightbulb className="h-6 w-6 text-success" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">AI-Powered Cost Savings Insights</h2>
              <p className="text-muted-foreground">Identified opportunities to optimize procurement spend</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-success">{formatCurrency(totalPotentialSavings)}</div>
            <div className="text-sm text-muted-foreground">Potential Annual Savings</div>
          </div>
        </div>
      </Card>

      {/* Insights Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {insights.map((insight) => (
          <Card 
            key={insight.id} 
            className={`dashboard-card p-6 border-l-4 ${getPriorityColor(insight.priority)} hover:shadow-lg transition-all duration-300`}
          >
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-2">
                  {getPriorityIcon(insight.priority)}
                  <div>
                    <h3 className="font-semibold text-foreground">{insight.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{insight.category}</p>
                  </div>
                </div>
                {getStatusBadge(insight.status)}
              </div>

              {/* Description */}
              <p className="text-sm text-foreground leading-relaxed">
                {insight.description}
              </p>

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border-light">
                <div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <DollarSign className="h-3 w-3" />
                    Potential Saving
                  </div>
                  <div className="font-bold text-success">{formatCurrency(insight.potentialSaving)}</div>
                </div>
                <div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    Implementation
                  </div>
                  <div className="font-medium text-foreground">{insight.implementationTime}</div>
                </div>
              </div>

              {/* Impact Badge */}
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-xs">
                  {insight.impact} impact
                </Badge>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="h-8 text-xs hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  View Details
                  <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Action Panel */}
      <Card className="dashboard-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Ready to Take Action?</h3>
            <p className="text-muted-foreground">
              Implement these insights to achieve significant cost savings across your procurement operations.
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleExportPDF}>
              Export PDF
            </Button>
            <Button variant="outline" onClick={handleExportExcel}>
              Export Excel
            </Button>
            <Button className="bg-gradient-to-r from-success to-success-light text-success-foreground hover:shadow-lg">
              <TrendingUp className="h-4 w-4 mr-2" />
              Start Implementation
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}