"use client"

import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, ArrowLeft, RefreshCw } from "lucide-react"
import Link from "next/link"

const errorMessages = {
  Configuration: "There is a problem with the server configuration.",
  AccessDenied: "You cancelled the authentication process.",
  Verification: "The verification token has expired or has already been used.",
  Default: "An error occurred during authentication.",
}

export default function AuthError() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")

  const errorMessage =
    error && error in errorMessages ? errorMessages[error as keyof typeof errorMessages] : errorMessages.Default

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
            <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
          <CardTitle className="text-2xl">Authentication Error</CardTitle>
          <CardDescription>{errorMessage}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error === "Configuration" && (
            <div className="rounded-lg bg-yellow-50 dark:bg-yellow-900/20 p-4">
              <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-2">Configuration Issue</h4>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                The Google OAuth configuration needs to be updated. Please check:
              </p>
              <ul className="mt-2 text-sm text-yellow-700 dark:text-yellow-300 list-disc list-inside space-y-1">
                <li>Authorized redirect URIs in Google Cloud Console</li>
                <li>Environment variables are correctly set</li>
                <li>Domain verification if using custom domains</li>
              </ul>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <Button asChild>
              <Link href="/auth/signin">
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
