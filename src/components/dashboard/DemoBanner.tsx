import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DemoBannerProps {
  isVisible: boolean;
}

export function DemoBanner({ isVisible }: DemoBannerProps) {
  if (!isVisible) return null;

  return (
    <Alert className="border-warning bg-warning/5 text-warning-foreground mb-6">
      <Info className="h-4 w-4 text-warning" />
      <AlertDescription className="flex items-center justify-between gap-4">
        <span className="text-sm flex-1">
          <strong>Demo Mode:</strong> You're viewing sample procurement data. 
          Connect to Supabase to view your live data and unlock full functionality.
        </span>
        <Button
          variant="outline"
          size="sm"
          className="h-8 px-3 text-xs border-warning text-warning hover:bg-warning hover:text-warning-foreground whitespace-nowrap"
          onClick={() => {
            // This guides users to look for the Supabase button
            alert("Click the green 'Supabase' button in the top-right corner to connect your database.");
          }}
        >
          Connect Supabase
          <ExternalLink className="ml-1 h-3 w-3" />
        </Button>
      </AlertDescription>
    </Alert>
  );
}