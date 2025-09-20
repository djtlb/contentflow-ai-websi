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
            <br />
            <span className="text-xs mt-2 block font-mono">{error.message}</span>
          </AlertDescription>
        </Alert>
        
        <Button 
          onClick={resetErrorBoundary}
          variant="outline"
          className="w-full"
        >
          <ArrowClockwise size={16} className="mr-2" />
          Try Again
        </Button>
      </div>
    </div>
  );
}