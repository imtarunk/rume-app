"use client";

import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  X,
  ExternalLink,
  Globe,
  Settings,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ResumeUploadProps {
  userId: string;
}

export function ResumeUpload({ userId }: ResumeUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [hasExistingResume, setHasExistingResume] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  // Check if user already has a resume on component mount
  useEffect(() => {
    const checkExistingResume = async () => {
      try {
        const response = await fetch(`/api/resume/${userId}`);
        if (response.ok) {
          setHasExistingResume(true);
        }
      } catch (error) {
        console.error("Error checking existing resume:", error);
      }
    };

    checkExistingResume();
  }, [userId]);

  const onDrop = useCallback(
    async (acceptedFiles: File[], rejectedFiles: any[]) => {
      // Handle rejected files
      if (rejectedFiles.length > 0) {
        const rejection = rejectedFiles[0];
        let errorMessage = "File rejected: ";

        if (rejection.errors.some((e: any) => e.code === "file-too-large")) {
          errorMessage += "File size too large (max 10MB)";
        } else if (
          rejection.errors.some((e: any) => e.code === "file-invalid-type")
        ) {
          errorMessage +=
            "Invalid file type. Please upload PDF, DOCX, or JSON files";
        } else {
          errorMessage += "Please check file requirements";
        }

        setError(errorMessage);
        return;
      }

      const file = acceptedFiles[0];
      if (!file) return;

      setError(null);
      setUploading(true);
      setProgress(0);
      setUploadedFile(file);

      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("userId", userId);

        // Simulate progress
        const progressInterval = setInterval(() => {
          setProgress((prev) => {
            if (prev >= 90) {
              clearInterval(progressInterval);
              return 90;
            }
            return prev + 10;
          });
        }, 200);

        const response = await fetch("/api/upload-resume", {
          method: "POST",
          body: formData,
        });

        clearInterval(progressInterval);
        setProgress(100);

        if (response.ok) {
          setUploadSuccess(true);
          setShowSuccessModal(true);
          toast({
            title: "Success!",
            description: "Resume uploaded and parsed successfully!",
          });
          setTimeout(() => {
            router.refresh();
          }, 1000);
        } else {
          throw new Error("Upload failed");
        }
      } catch (error: any) {
        console.error("Upload error:", error);
        const errorMessage =
          error.message || "Failed to upload resume. Please try again.";
        setError(errorMessage);

        toast({
          title: "Upload failed",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setUploading(false);
        setTimeout(() => setProgress(0), 2000);
      }
    },
    [userId, toast, router]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
      "application/msword": [".doc"],
      "application/json": [".json"],
      "text/plain": [".txt"],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
    disabled: uploading,
  });

  const clearError = () => setError(null);
  const clearUploadedFile = () => setUploadedFile(null);

  return (
    <>
      <div className="space-y-6">
        {/* Show existing portfolio URL if resume exists */}
        {hasExistingResume && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-blue-600" />
                Your Portfolio is Live
              </CardTitle>
              <CardDescription>
                Your resume has been processed and your portfolio is available
                online
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
                  Your Portfolio URL:
                </p>
                <p className="text-sm text-blue-700 dark:text-blue-300 break-all font-mono">
                  {typeof window !== "undefined"
                    ? `${window.location.origin}/portfolio/${userId}`
                    : `/portfolio/${userId}`}
                </p>
              </div>
              <div className="flex gap-2">
                <Button asChild className="flex-1">
                  <a
                    href={`/portfolio/${userId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View Portfolio
                  </a>
                </Button>
                <Button variant="outline" className="flex-1">
                  <Settings className="mr-2 h-4 w-4" />
                  Customize
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Upload Your Resume</CardTitle>
            <CardDescription>
              Upload your resume in PDF, DOCX, DOC, JSON, or TXT format. Our
              system will extract and parse all relevant information.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="flex items-center justify-between">
                  {error}
                  <Button variant="ghost" size="sm" onClick={clearError}>
                    <X className="h-4 w-4" />
                  </Button>
                </AlertDescription>
              </Alert>
            )}

            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? "border-primary bg-primary/5"
                  : "border-muted-foreground/25 hover:border-primary/50"
              } ${uploading ? "pointer-events-none opacity-50" : ""}`}
            >
              <input {...getInputProps()} />
              <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              {isDragActive ? (
                <p className="text-lg">Drop your resume here...</p>
              ) : (
                <div>
                  <p className="text-lg mb-2">Drag & drop your resume here</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    or click to browse files
                  </p>
                  <Button variant="outline" disabled={uploading}>
                    {uploading ? "Uploading..." : "Choose File"}
                  </Button>
                </div>
              )}
            </div>

            {uploading && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    {progress < 90 ? "Uploading..." : "Processing..."}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {progress}%
                  </span>
                </div>
                <Progress value={progress} className="w-full" />
                <p className="text-xs text-muted-foreground text-center">
                  {progress < 50 && "Uploading file..."}
                  {progress >= 50 &&
                    progress < 90 &&
                    "Parsing resume content..."}
                  {progress >= 90 && "Finalizing..."}
                </p>
              </div>
            )}

            {uploadedFile && !uploading && (
              <div className="p-4 border rounded-lg bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="font-medium text-green-800 dark:text-green-200">
                        {uploadedFile.name}
                      </p>
                      <p className="text-sm text-green-600 dark:text-green-300">
                        Uploaded and parsed successfully
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={clearUploadedFile}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>What happens next?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div className="space-y-2">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-sm font-medium text-primary">1</span>
                </div>
                <p className="text-sm font-medium">Parse Content</p>
                <p className="text-xs text-muted-foreground">
                  Extract information from your resume
                </p>
              </div>
              <div className="space-y-2">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-sm font-medium text-primary">2</span>
                </div>
                <p className="text-sm font-medium">Review & Edit</p>
                <p className="text-xs text-muted-foreground">
                  Check and modify the extracted data
                </p>
              </div>
              <div className="space-y-2">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-sm font-medium text-primary">3</span>
                </div>
                <p className="text-sm font-medium">Generate Portfolio</p>
                <p className="text-xs text-muted-foreground">
                  Create your professional website
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Resume Uploaded Successfully!
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Your resume has been processed and your portfolio is now live!
            </p>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm font-medium text-green-800 mb-2">
                Your Portfolio URL:
              </p>
              <p className="text-sm text-green-700 break-all">
                {typeof window !== "undefined"
                  ? `${window.location.origin}/portfolio/${userId}`
                  : `/portfolio/${userId}`}
              </p>
            </div>
            <div className="flex gap-2">
              <Button asChild className="flex-1">
                <a
                  href={`/portfolio/${userId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View Portfolio
                </a>
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowSuccessModal(false)}
                className="flex-1"
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
