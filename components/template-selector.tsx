"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TemplateSelectorProps {
  userId: string;
  currentTemplate?: string;
}

const templates = [
  {
    id: "classic-v1",
    name: "Classic",
    description:
      "Modern AI-native portfolio with interactive sections and smooth animations",
    preview:
      "https://s.tmimgcdn.com/scr/1200x750/429000/cv-resume-ai-specialist-v3-un-modele-dynamique-concu-pour-ameliorer-votre-profil-de-specialiste-de-l39ia_429036-original.jpg",
    features: [
      "Interactive Navigation",
      "Dark Mode",
      "Mobile Responsive",
      "Modern Design",
    ],
  },
  {
    id: "modern-v2",
    name: "Modern",
    description:
      "Modern AI-native portfolio with interactive sections and smooth animations",
    preview:
      "https://s.tmimgcdn.com/scr/1200x750/429000/cv-resume-ai-specialist-v3-un-modele-dynamique-concu-pour-ameliorer-votre-profil-de-specialiste-de-l39ia_429036-original.jpg",
    features: [
      "Interactive Navigation",
      "Dark Mode",
      "Mobile Responsive",
      "Modern Design",
    ],
  },
];

export function TemplateSelector({
  userId,
  currentTemplate,
}: TemplateSelectorProps) {
  const [selectedTemplate, setSelectedTemplate] = useState(
    currentTemplate || "modern"
  );
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const handleSelectTemplate = async (templateId: string) => {
    setSaving(true);
    try {
      const response = await fetch("/api/portfolio/template", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          templateId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save template");
      }

      setSelectedTemplate(templateId);
      toast({
        title: "Template updated!",
        description: "Your portfolio template has been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update template. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Choose Your Template</h2>
        <p className="text-muted-foreground">
          Select a template that best represents your professional style
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <Card
            key={template.id}
            className={`cursor-pointer transition-all hover:shadow-lg ${
              selectedTemplate === template.id ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => setSelectedTemplate(template.id)}
          >
            <CardHeader className="pb-2">
              <div className="aspect-video bg-muted rounded-lg mb-4 overflow-hidden">
                <img
                  src={template.preview || "/placeholder.svg"}
                  alt={`${template.name} template preview`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{template.name}</CardTitle>
                {selectedTemplate === template.id && (
                  <Check className="h-5 w-5 text-primary" />
                )}
              </div>
              <CardDescription>{template.description}</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex flex-wrap gap-2 mb-4">
                {template.features.map((feature) => (
                  <Badge key={feature} variant="secondary" className="text-xs">
                    {feature}
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 bg-transparent"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Preview functionality
                  }}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Preview
                </Button>
                {selectedTemplate === template.id ? (
                  <Button
                    size="sm"
                    className="flex-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectTemplate(template.id);
                    }}
                    disabled={saving}
                  >
                    {saving ? "Saving..." : "Selected"}
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 bg-transparent"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectTemplate(template.id);
                    }}
                    disabled={saving}
                  >
                    Select
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
