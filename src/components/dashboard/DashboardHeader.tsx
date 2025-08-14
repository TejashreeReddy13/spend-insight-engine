import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Download, 
  RefreshCw, 
  Settings, 
  Bell,
  BarChart3,
  Calendar
} from "lucide-react";

export function DashboardHeader() {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="dashboard-header px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-nav-foreground">
                Procurement Analytics
              </h1>
              <p className="text-sm text-nav-foreground/70">
                Spend & Savings Analysis Dashboard
              </p>
            </div>
          </div>
          
          <Badge className="bg-success/10 text-success border-success/20">
            Real-time Data
          </Badge>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-nav-foreground/70">
            <Calendar className="h-4 w-4" />
            <span>{currentDate}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm"
              className="text-nav-foreground hover:bg-nav-hover"
            >
              <Bell className="h-4 w-4" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm"
              className="text-nav-foreground hover:bg-nav-hover"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm"
              className="text-nav-foreground hover:bg-nav-hover"
            >
              <Settings className="h-4 w-4" />
            </Button>
            
            <Button 
              size="sm"
              className="bg-success hover:bg-success-dark text-success-foreground shadow-md"
            >
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}