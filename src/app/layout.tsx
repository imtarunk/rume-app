import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rume | AI-Powered Portfolio Builder",
  description: "Transform your resume into a world-class portfolio in seconds using AI. Designed for impact, built for opportunities.",
  keywords: ["AI portfolio", "resume builder", "online portfolio", "career growth", "personal branding"],
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Rume | AI-Powered Portfolio Builder",
    description: "Transform your resume into a world-class portfolio in seconds using AI.",
    url: "https://rume-app-v1.vercel.app",
    siteName: "Rume",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rume | AI-Powered Portfolio Builder",
    description: "Transform your resume into a world-class portfolio in seconds using AI.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
      </body>
    </html>
  );
}
