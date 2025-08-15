import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "next-themes";
import { 
  Download, 
  RefreshCw, 
  Settings, 
  Bell,
  BarChart3,
  Calendar,
  Moon,
  Sun
} from "lucide-react";

export function DashboardHeader() {
  const { theme, setTheme } = useTheme();
  
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="dashboard-header px-4 sm:px-6 py-4 transition-all duration-300">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Left Section */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-nav-foreground">
                Procurement Analytics
              </h1>
              <p className="text-sm text-nav-foreground/70 hidden sm:block">
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
              onClick={toggleTheme}
              className="text-nav-foreground hover:bg-nav-hover transition-all duration-300"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              <span className="sr-only">Toggle theme</span>
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm"
              className="text-nav-foreground hover:bg-nav-hover transition-all duration-300"
            >
              <Bell className="h-4 w-4" />
              <span className="sr-only">Notifications</span>
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm"
              className="text-nav-foreground hover:bg-nav-hover transition-all duration-300"
            >
              <RefreshCw className="h-4 w-4" />
              <span className="sr-only">Refresh data</span>
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm"
              className="text-nav-foreground hover:bg-nav-hover transition-all duration-300"
            >
              <Settings className="h-4 w-4" />
              <span className="sr-only">Settings</span>
            </Button>
            
            <Button 
              size="sm"
              className="bg-success hover:bg-success-dark text-success-foreground shadow-md export-button transition-all duration-300 hover:shadow-lg"
            >
              <Download className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Export Report</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}