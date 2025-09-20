import React from 'react'
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Warning } from "@phosphor-icons/react"

interface ErrorFallbackProps {
  error: Error
  resetErrorBoundary: () => void
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
        <Button 
          onClick={resetErrorBoundary}
          variant="outline"
          className="w-full"
        >
          Try Again
        </Button>
      </div>
    </div>
  )
}