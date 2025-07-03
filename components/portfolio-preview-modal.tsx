"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, ExternalLink, CheckCircle, Circle, Loader2 } from "lucide-react";
import { PortfolioPreview } from "./portfolio-preview";
import { useToast } from "@/components/ui/use-toast";
import Loader from "@/components/ui/loader";

interface PortfolioPreviewModalProps {
  resumeData: any;
  template: string;
  trigger?: React.ReactNode;
  userId: string;
}

export function PortfolioPreviewModal({
  resumeData,
  template,
  trigger,
  userId,
}: PortfolioPreviewModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPublished, setIsPublished] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Fetch isPublished state when modal opens
  React.useEffect(() => {
    if (isOpen && userId) {
      fetch(`/api/portfolio/template?userId=${userId}`)
        .then((res) => res.json())
        .then((data) => setIsPublished(data.portfolio?.isPublished ?? false));
    }
  }, [isOpen, userId]);

  const handleTogglePublish = async () => {
    setLoading(true);
    const newState = !isPublished;
    try {
      const res = await fetch("/api/portfolio/template", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, isPublished: newState }),
      });
      if (!res.ok) throw new Error("Failed to update publish state");
      setIsPublished(newState);
      toast({
        title: newState
          ? "Portfolio is now Live!"
          : "Portfolio is now Offline.",
        description: newState
          ? "Your portfolio is now published and visible to the world."
          : "Your portfolio is now offline.",
        variant: newState ? "default" : "default",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update publish state.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const defaultTrigger = (
    <Button variant="outline">
      <Eye className="mr-2 h-4 w-4" />
      Preview Portfolio
    </Button>
  );

  if (loading) {
    return <Loader />;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-hidden">
        <DialogHeader className="flex flex-row items-center justify-between">
          <div>
            <DialogTitle>Portfolio Preview</DialogTitle>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="secondary">{template} Template</Badge>
              <Badge variant="outline">Preview Mode</Badge>
            </div>
          </div>
          <div className="space-x-2">
            <Button
              variant={isPublished ? "default" : "secondary"}
              size="sm"
              onClick={handleTogglePublish}
              disabled={loading}
              className={
                isPublished
                  ? "bg-green-600 text-white"
                  : "bg-gray-400 text-white"
              }
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : isPublished ? (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" /> Live
                </>
              ) : (
                <>
                  <Circle className="mr-2 h-4 w-4" /> Offline
                </>
              )}
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a
                href={`/preview/${userId}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Open in New Tab
              </a>
            </Button>
          </div>
        </DialogHeader>
        <div className="overflow-auto max-h-[calc(90vh-120px)]">
          {resumeData ? (
            <PortfolioPreview data={resumeData} template={template} />
          ) : (
            <Loader />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
