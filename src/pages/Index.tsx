import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Users, 
  ArrowRight,
  Lightbulb,
  Shield,
  Target
} from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: "Spend Analytics",
      description: "Comprehensive spend analysis across vendors, categories, and regions with real-time KPIs and insights."
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: "Price Variance Detection", 
      description: "Identify pricing inconsistencies across suppliers and regions to optimize procurement costs."
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Maverick Spend Control",
      description: "Monitor off-contract purchases and ensure compliance with approved vendor agreements."
    },
    {
      icon: <Lightbulb className="h-8 w-8" />,
      title: "AI-Powered Insights",
      description: "Receive intelligent recommendations for vendor consolidation, bulk ordering, and cost optimization."
    }
  ];

  return (
    <div className="dashboard-container min-h-screen">
      {/* Hero Section */}
      <div className="bg-nav-bg text-nav-foreground">
        <div className="container mx-auto px-6 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="p-3 bg-primary/10 rounded-lg">
                <BarChart3 className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold">
                Procurement Analytics
              </h1>
            </div>
            
            <p className="text-xl text-nav-foreground/80 mb-8 leading-relaxed">
              Transform your procurement operations with enterprise-grade spend analysis, 
              price variance detection, and AI-powered cost savings recommendations.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                onClick={() => navigate('/dashboard')}
                className="bg-primary hover:bg-primary-dark text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <BarChart3 className="h-5 w-5 mr-2" />
                Launch Dashboard
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
              
              <Button 
                size="lg" 
                variant="outline"
                className="border-nav-foreground/20 text-nav-foreground hover:bg-nav-foreground/10"
              >
                <Target className="h-5 w-5 mr-2" />
                View Demo
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 px-6">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
            <Card className="dashboard-card p-6 text-center border-l-4 border-l-success">
              <div className="text-3xl font-bold text-success mb-2">$2.4M</div>
              <div className="text-sm text-muted-foreground">Annual Savings Identified</div>
            </Card>
            
            <Card className="dashboard-card p-6 text-center border-l-4 border-l-primary">
              <div className="text-3xl font-bold text-primary mb-2">127</div>
              <div className="text-sm text-muted-foreground">Active Vendors Managed</div>
            </Card>
            
            <Card className="dashboard-card p-6 text-center border-l-4 border-l-teal">
              <div className="text-3xl font-bold text-teal mb-2">89%</div>
              <div className="text-sm text-muted-foreground">Contract Compliance Rate</div>
            </Card>
            
            <Card className="dashboard-card p-6 text-center border-l-4 border-l-warning">
              <div className="text-3xl font-bold text-warning mb-2">23%</div>
              <div className="text-sm text-muted-foreground">Cost Reduction Achieved</div>
            </Card>
          </div>

          {/* Features Grid */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Enterprise Procurement Intelligence
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Gain complete visibility into your procurement spend with advanced analytics, 
              automated insights, and actionable recommendations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="dashboard-card p-8 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg text-primary flex-shrink-0">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* CTA Section */}
          <div className="text-center mt-16">
            <Card className="dashboard-card p-12 bg-gradient-to-r from-primary/5 to-teal/5 border-primary/20">
              <div className="max-w-2xl mx-auto">
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  Ready to Optimize Your Procurement Spend?
                </h3>
                <p className="text-muted-foreground mb-8">
                  Start analyzing your procurement data today and discover opportunities 
                  for significant cost savings across your organization.
                </p>
                <Button 
                  size="lg"
                  onClick={() => navigate('/dashboard')}
                  className="bg-gradient-to-r from-primary to-primary-light text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <DollarSign className="h-5 w-5 mr-2" />
                  Start Saving Money
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
