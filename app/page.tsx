import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Upload,
  Palette,
  Globe,
  Zap,
  Shield,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">Rume</span>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Button asChild>
              <Link href="/auth/signin">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <Badge variant="secondary" className="mb-4">
          AI-Powered Portfolio Generation
        </Badge>
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Transform Your Resume Into a Stunning Portfolio
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Upload your resume and watch as AI creates a beautiful, professional
          portfolio website in minutes. Choose from stunning templates and get
          your own custom domain.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="/auth/signin">
              Create Your Portfolio <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="#demo">View Demo</Link>
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="text-center">
            <CardHeader>
              <Upload className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>Upload Resume</CardTitle>
              <CardDescription>
                Upload your resume in PDF, DOCX, or JSON format. Our AI will
                parse and extract all relevant information.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Palette className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>Choose Template</CardTitle>
              <CardDescription>
                Select from beautiful, responsive templates. Customize colors,
                themes, and layout to match your style.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Globe className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>Publish & Share</CardTitle>
              <CardDescription>
                Get your custom domain or subdomain. Share your professional
                portfolio with the world instantly.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Benefits */}
      <section className="container mx-auto px-4 py-20 bg-muted/50 rounded-lg">
        <h2 className="text-3xl font-bold text-center mb-12">
          Why Choose PortfolioGen?
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="flex items-start space-x-3">
            <Zap className="h-6 w-6 text-primary mt-1" />
            <div>
              <h3 className="font-semibold mb-2">Lightning Fast</h3>
              <p className="text-sm text-muted-foreground">
                Generate your portfolio in under 5 minutes
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <Shield className="h-6 w-6 text-primary mt-1" />
            <div>
              <h3 className="font-semibold mb-2">Secure & Private</h3>
              <p className="text-sm text-muted-foreground">
                Your data is encrypted and secure
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <Globe className="h-6 w-6 text-primary mt-1" />
            <div>
              <h3 className="font-semibold mb-2">SEO Optimized</h3>
              <p className="text-sm text-muted-foreground">
                Built for search engine visibility
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center p-8 border-t border-gray-200">
        <p className="text-sm text-gray-500 mb-1">
          Made with ❤️ by{" "}
          <a
            href="https://codextarun.xyz"
            className="underline hover:text-primary"
            target="_blank"
            rel="noopener noreferrer"
          >
            codextarun.xyz
          </a>
        </p>
      </footer>
    </div>
  );
}
