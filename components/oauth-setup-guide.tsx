"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Copy, ExternalLink, CheckCircle } from "lucide-react"
import { useState } from "react"

export function OAuthSetupGuide() {
  const [copiedStep, setCopiedStep] = useState<number | null>(null)

  const copyToClipboard = (text: string, step: number) => {
    navigator.clipboard.writeText(text)
    setCopiedStep(step)
    setTimeout(() => setCopiedStep(null), 2000)
  }

  const redirectUris = [
    "http://localhost:3000/api/auth/callback/google",
    "https://your-domain.vercel.app/api/auth/callback/google",
  ]

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Google OAuth Setup Guide</h1>
        <p className="text-muted-foreground">
          Follow these steps to configure Google OAuth for your portfolio generator
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Badge variant="outline">Step 1</Badge>
              <CardTitle className="text-lg">Create Google Cloud Project</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Go to the Google Cloud Console and create a new project or select an existing one.
            </p>
            <Button variant="outline" size="sm" asChild>
              <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                Open Google Cloud Console
              </a>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Badge variant="outline">Step 2</Badge>
              <CardTitle className="text-lg">Enable Google+ API</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Navigate to "APIs & Services" → "Library" and enable the Google+ API.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Badge variant="outline">Step 3</Badge>
              <CardTitle className="text-lg">Create OAuth 2.0 Credentials</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Go to "APIs & Services" → "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
            </p>
            <div className="space-y-2">
              <p className="text-sm font-medium">Application Type:</p>
              <Badge variant="secondary">Web Application</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Badge variant="outline">Step 4</Badge>
              <CardTitle className="text-lg">Configure Authorized Redirect URIs</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Add these redirect URIs to your OAuth 2.0 client configuration:
            </p>
            <div className="space-y-2">
              {redirectUris.map((uri, index) => (
                <div key={index} className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                  <code className="flex-1 text-sm font-mono">{uri}</code>
                  <Button variant="ghost" size="sm" onClick={() => copyToClipboard(uri, index)}>
                    {copiedStep === index ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Replace "your-domain.vercel.app" with your actual Vercel deployment URL
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Badge variant="outline">Step 5</Badge>
              <CardTitle className="text-lg">Set Environment Variables</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Copy your Client ID and Client Secret and add them to your environment variables:
            </p>
            <div className="space-y-2">
              <div className="p-3 bg-muted rounded-lg">
                <code className="text-sm font-mono">
                  GOOGLE_CLIENT_ID=your_client_id_here
                  <br />
                  GOOGLE_CLIENT_SECRET=your_client_secret_here
                  <br />
                  NEXTAUTH_SECRET=your_random_secret_here
                  <br />
                  NEXTAUTH_URL=http://localhost:3000
                </code>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
          <CardHeader>
            <CardTitle className="text-lg text-green-800 dark:text-green-200">🎉 You're all set!</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-green-700 dark:text-green-300">
              Once you've completed these steps, restart your development server and try signing in again.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
