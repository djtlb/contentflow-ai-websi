import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Warning, ArrowClockwise } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

export function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        <Alert variant="destructive">
          <Warning size={20} />
          <AlertTitle>Something went wrong</AlertTitle>
          <AlertDescription>
            This spark has encountered an error. Please try refreshing the page or contact support if the problem persists.
          </AlertDescription>
        </Alert>
        
        <div className="bg-card border rounded-lg p-4">
          <h3 className="font-semibold text-sm text-muted-foreground mb-2">Error Details:</h3>
          <pre className="text-xs text-destructive bg-muted/50 p-3 rounded border overflow-auto max-h-32">
            {error.message}
          </pre>
        </div>
        
        <Button 
          onClick={resetErrorBoundary} 
          className="w-full"
          variant="outline"
        >
          <ArrowClockwise size={16} className="mr-2" />
          Try Again
        </Button>
      </div>
    </div>
  );
}