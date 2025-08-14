import { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: number;
  changeLabel?: string;
  icon?: ReactNode;
  variant?: "default" | "success" | "warning" | "danger";
  loading?: boolean;
}

export function KPICard({ 
  title, 
  value, 
  subtitle, 
  change, 
  changeLabel, 
  icon, 
  variant = "default",
  loading = false 
}: KPICardProps) {
  const getTrendIcon = () => {
    if (change === undefined) return null;
    if (change > 0) return <TrendingUp className="h-4 w-4" />;
    if (change < 0) return <TrendingDown className="h-4 w-4" />;
    return <Minus className="h-4 w-4" />;
  };

  const getTrendColor = () => {
    if (change === undefined) return "text-muted-foreground";
    if (change > 0) return "text-success";
    if (change < 0) return "text-danger";
    return "text-muted-foreground";
  };

  const getVariantStyles = () => {
    switch (variant) {
      case "success":
        return "border-l-4 border-l-success";
      case "warning":
        return "border-l-4 border-l-warning";
      case "danger":
        return "border-l-4 border-l-danger";
      default:
        return "border-l-4 border-l-primary";
    }
  };

  if (loading) {
    return (
      <Card className={`kpi-card ${getVariantStyles()} animate-pulse`}>
        <div className="flex items-start justify-between mb-3">
          <div className="h-4 bg-muted rounded w-24"></div>
          <div className="h-6 w-6 bg-muted rounded"></div>
        </div>
        <div className="h-8 bg-muted rounded w-32 mb-2"></div>
        <div className="h-3 bg-muted rounded w-20"></div>
      </Card>
    );
  }

  return (
    <Card className={`kpi-card ${getVariantStyles()} fade-in`}>
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          {title}
        </h3>
        {icon && (
          <div className="text-primary p-2 bg-primary/10 rounded-lg">
            {icon}
          </div>
        )}
      </div>
      
      <div className="mb-2">
        <div className="text-3xl font-bold text-foreground mb-1">
          {value}
        </div>
        {subtitle && (
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        )}
      </div>
      
      {(change !== undefined || changeLabel) && (
        <div className={`flex items-center gap-1 text-sm ${getTrendColor()}`}>
          {getTrendIcon()}
          {change !== undefined && (
            <span className="font-medium">
              {change > 0 ? "+" : ""}{change}%
            </span>
          )}
          {changeLabel && (
            <span className="text-muted-foreground ml-1">{changeLabel}</span>
          )}
        </div>
      )}
    </Card>
  );
}