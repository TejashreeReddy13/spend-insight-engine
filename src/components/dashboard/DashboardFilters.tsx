import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Filter, X } from "lucide-react";

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

  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const updateFilter = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
    
    // Update active filters for display
    const newActiveFilters = Object.entries(newFilters)
      .filter(([_, val]) => val && val !== "")
      .map(([key, val]) => `${key}: ${val}`);
    setActiveFilters(newActiveFilters);
  };

  const clearFilter = (filterKey: string) => {
    const key = filterKey.split(":")[0] as keyof FilterState;
    updateFilter(key, "");
  };

  const clearAllFilters = () => {
    const clearedFilters = {
      vendor: "",
      category: "",
      region: "",
      dateRange: "last-30-days"
    };
    setFilters(clearedFilters);
    setActiveFilters([]);
    onFiltersChange(clearedFilters);
  };

  return (
    <Card className="dashboard-card p-4 mb-6">
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Filter className="h-4 w-4" />
          Filters:
        </div>
        
        <div className="flex flex-wrap gap-3 flex-1">
          <Select value={filters.vendor} onValueChange={(value) => updateFilter("vendor", value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Vendor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Vendors</SelectItem>
              <SelectItem value="acme-corp">ACME Corp</SelectItem>
              <SelectItem value="global-supplies">Global Supplies</SelectItem>
              <SelectItem value="tech-solutions">Tech Solutions Inc</SelectItem>
              <SelectItem value="office-depot">Office Depot</SelectItem>
              <SelectItem value="industrial-parts">Industrial Parts Co</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.category} onValueChange={(value) => updateFilter("category", value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Categories</SelectItem>
              <SelectItem value="office-supplies">Office Supplies</SelectItem>
              <SelectItem value="it-equipment">IT Equipment</SelectItem>
              <SelectItem value="industrial">Industrial</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
              <SelectItem value="facilities">Facilities</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.region} onValueChange={(value) => updateFilter("region", value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Regions</SelectItem>
              <SelectItem value="north-america">North America</SelectItem>
              <SelectItem value="europe">Europe</SelectItem>
              <SelectItem value="asia-pacific">Asia Pacific</SelectItem>
              <SelectItem value="latin-america">Latin America</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.dateRange} onValueChange={(value) => updateFilter("dateRange", value)}>
            <SelectTrigger className="w-[180px]">
              <CalendarDays className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last-7-days">Last 7 Days</SelectItem>
              <SelectItem value="last-30-days">Last 30 Days</SelectItem>
              <SelectItem value="last-90-days">Last 90 Days</SelectItem>
              <SelectItem value="last-year">Last Year</SelectItem>
              <SelectItem value="ytd">Year to Date</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {activeFilters.length > 0 && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={clearAllFilters}
            className="whitespace-nowrap"
          >
            Clear All
          </Button>
        )}
      </div>

      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border-light">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {activeFilters.map((filter) => (
            <Badge 
              key={filter} 
              variant="secondary" 
              className="flex items-center gap-1"
            >
              {filter}
              <X 
                className="h-3 w-3 cursor-pointer hover:text-danger" 
                onClick={() => clearFilter(filter)}
              />
            </Badge>
          ))}
        </div>
      )}
    </Card>
  );
}