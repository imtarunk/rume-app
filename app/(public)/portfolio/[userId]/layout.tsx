// app/layout.tsx
import "../../../globals.css";
import { Inter } from "next/font/google";
import type { Metadata } from "next";
import { ReactNode } from "react";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tarun Kumar Saini – Portfolio",
  description: "Full Stack & Blockchain Developer Portfolio",
};

async function getUserData(userId: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/resume/${userId}`, {
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json();
}

export default async function RootLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { userId: string };
}) {
  const userData = await getUserData(params.userId);
  return (
    <html lang="en" className={inter.className}>
      <body className="bg-white text-gray-900 antialiased">
        {/* You can use a context/provider here if needed */}
        {children}
      </body>
    </html>
  );
}
