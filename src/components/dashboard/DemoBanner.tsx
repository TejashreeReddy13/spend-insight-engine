import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DemoBannerProps {
  isVisible: boolean;
}

export function DemoBanner({ isVisible }: DemoBannerProps) {
  if (!isVisible) return null;

  return (
    <Alert className="border-warning bg-warning/5 text-warning-foreground mb-6 animate-fade-in transition-colors duration-300">
      <Info className="h-4 w-4 text-warning flex-shrink-0 mt-0.5" />
      <AlertDescription className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <span className="text-sm leading-relaxed">
          <strong className="font-semibold">Demo Mode:</strong> You're viewing sample procurement data. 
          Connect to Supabase to view your live data and unlock full functionality.
        </span>
        <Button
          variant="outline"
          size="sm"
          className="h-8 px-3 text-xs border-warning text-warning hover:bg-warning hover:text-warning-foreground 
                   transition-all duration-200 whitespace-nowrap flex-shrink-0 w-full sm:w-auto justify-center"
          onClick={() => {
            // This guides users to look for the Supabase button
            alert("Click the green 'Supabase' button in the top-right corner to connect your database.");
          }}
        >
          Connect Supabase
          <ExternalLink className="ml-1.5 h-3 w-3" />
        </Button>
      </AlertDescription>
    </Alert>
  );
}