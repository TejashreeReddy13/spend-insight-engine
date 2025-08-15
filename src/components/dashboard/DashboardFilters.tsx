import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Filter } from "lucide-react";
import { useProcurementData } from "@/hooks/useProcurementData";

interface FilterState {
  vendor: string;
  category: string;
  region: string;
  dateRange: string;
}

interface DashboardFiltersProps {
  onFiltersChange: (filters: FilterState) => void;
}

export function DashboardFilters({ onFiltersChange }: DashboardFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    vendor: "",
    category: "",
    region: "",
    dateRange: "last-30-days"
  });

  const [vendorOptions, setVendorOptions] = useState<string[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<string[]>([]);
  const [regionOptions, setRegionOptions] = useState<string[]>([]);

  const { getVendorOptions, getCategoryOptions, getRegionOptions } = useProcurementData();

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [vendors, categories, regions] = await Promise.all([
          getVendorOptions(),
          getCategoryOptions(),
          getRegionOptions()
        ]);
        setVendorOptions(vendors);
        setCategoryOptions(categories);
        setRegionOptions(regions);
      } catch (error) {
        console.error("Failed to load filter options:", error);
      }
    };

    loadOptions();
  }, [getVendorOptions, getCategoryOptions, getRegionOptions]);

  const activeFilters = Object.entries(filters).filter(([key, value]) => 
    value && key !== "dateRange"
  );

  const updateFilter = (key: keyof FilterState, value: string) => {
    // Convert "all" back to empty string for the actual filter logic  
    const filterValue = value === "all" ? "" : value;
    const newFilters = { ...filters, [key]: filterValue };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilter = (key: keyof FilterState) => {
    const newFilters = { ...filters, [key]: "" };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearAllFilters = () => {
    const newFilters = {
      vendor: "",
      category: "",
      region: "",
      dateRange: "last-30-days"
    };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  return (
    <Card className="dashboard-card p-6 animate-fade-in hover:shadow-lg transition-all duration-300">
      <div className="space-y-4">
        {/* Filter Controls */}
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Filters</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Select value={filters.vendor || "all"} onValueChange={(value) => updateFilter("vendor", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select Vendor" />
            </SelectTrigger>
            <SelectContent className="z-50 bg-popover border-border shadow-lg">
              <SelectItem value="all">All Vendors</SelectItem>
              {vendorOptions.map((vendor) => (
                <SelectItem key={vendor} value={vendor}>
                  {vendor}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.category || "all"} onValueChange={(value) => updateFilter("category", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent className="z-50 bg-popover border-border shadow-lg">
              <SelectItem value="all">All Categories</SelectItem>
              {categoryOptions.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.region || "all"} onValueChange={(value) => updateFilter("region", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select Region" />
            </SelectTrigger>
            <SelectContent className="z-50 bg-popover border-border shadow-lg">
              <SelectItem value="all">All Regions</SelectItem>
              {regionOptions.map((region) => (
                <SelectItem key={region} value={region}>
                  {region}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.dateRange} onValueChange={(value) => updateFilter("dateRange", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select Date Range" />
            </SelectTrigger>
            <SelectContent className="z-50 bg-popover border-border shadow-lg">
              <SelectItem value="last-7-days">Last 7 Days</SelectItem>
              <SelectItem value="last-30-days">Last 30 Days</SelectItem>
              <SelectItem value="last-90-days">Last 90 Days</SelectItem>
              <SelectItem value="last-year">Last Year</SelectItem>
              <SelectItem value="all-time">All Time</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Active Filters */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-border-light">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            {activeFilters.map(([key, value]) => (
              <Badge 
                key={key} 
                variant="secondary" 
                className="filter-badge flex items-center gap-1 px-3 py-1 hover:bg-secondary/80 transition-all duration-300 animate-scale-in"
              >
                <span className="capitalize">{key}:</span>
                <span className="font-medium">{value}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto w-auto p-0 hover:bg-transparent hover:text-destructive transition-colors duration-200"
                  onClick={() => clearFilter(key as keyof FilterState)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={clearAllFilters}
              className="ml-2 h-7 text-xs hover:bg-destructive hover:text-destructive-foreground transition-all duration-300"
            >
              Clear All
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}