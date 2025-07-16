"use client";

import { useState, useEffect } from "react";
import type { User, Resume, Portfolio } from "@prisma/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Eye, Settings, Globe, FileText, Palette } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { ResumeUpload } from "./resume-upload";
import { TemplateSelector } from "./template-selector";
import { signOut } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PortfolioPreviewModal } from "./portfolio-preview-modal";
import { PortfolioPreview } from "./portfolio-preview";
import { getPortfolioData } from "./templates/v1/data";

type UserWithRelations = User & {
  resumes: Resume[];
  portfolio: Portfolio | null;
};

interface DashboardContentProps {
  user: UserWithRelations;
}

export function DashboardContent({ user }: DashboardContentProps) {
  const [activeTab, setActiveTab] = useState("upload");
  const latestResume = user.resumes[0];
  const [resumeData, setResumeData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  useEffect(() => {
    if (modalOpen && user.id) {
      (async () => {
        const data = await getPortfolioData({ userId: user.id });
        setResumeData(data);
      })();
    }
  }, [modalOpen, user.id]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Portfolio Dashboard</h1>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Avatar>
              <AvatarImage src={user.image || ""} />
              <AvatarFallback>{user.name?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            <Button
              variant="ghost"
              onClick={() => signOut({ callbackUrl: "/" })} // Redirect to home after logout
            >
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">
            Welcome back, {user.name}!
          </h2>
          <p className="text-muted-foreground">
            Manage your portfolio and create stunning websites from your resume.
          </p>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="upload">Upload Resume</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Resume Status
                  </CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {latestResume ? "Uploaded" : "Not Uploaded"}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {latestResume
                      ? `Last updated ${new Date(
                          latestResume.updatedAt
                        ).toLocaleDateString("en-GB", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                        })}`
                      : "Upload your resume to get started"}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Portfolio Status
                  </CardTitle>
                  <Globe className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {user.portfolio?.isPublished ? "Published" : "Draft"}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {user.portfolio?.isPublished
                      ? "Your portfolio is live"
                      : "Publish to make it visible"}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Template
                  </CardTitle>
                  <Palette className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {user.portfolio?.templateId || "None"}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Current template selection
                  </p>
                </CardContent>
              </Card>
            </div>

            {latestResume && (
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>
                    Get started with your portfolio creation
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-4">
                  <Button onClick={() => setActiveTab("templates")}>
                    <Palette className="mr-2 h-4 w-4" />
                    Choose Template
                  </Button>
                  <PortfolioPreviewModal
                    resumeData={resumeData}
                    userId={user.id}
                    template={user.portfolio?.templateId || "toukoum"}
                    trigger={
                      <Button
                        variant="outline"
                        onClick={() => setModalOpen(true)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Preview Portfolio
                      </Button>
                    }
                  />
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="upload">
            <ResumeUpload userId={user.id} />
          </TabsContent>

          <TabsContent value="templates">
            <TemplateSelector
              userId={user.id}
              currentTemplate={user.portfolio?.templateId}
            />
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Portfolio Settings</CardTitle>
                <CardDescription>
                  Configure your portfolio preferences and domain settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Custom Domain</label>
                  <p className="text-sm text-muted-foreground">
                    Connect your own domain or use our subdomain
                  </p>
                  <Badge variant="secondary">Coming Soon</Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
