"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, Phone } from "lucide-react";
import V1Portfolio from "./templates/v1/v1";
import V2Portfolio from "./templates/v1/v2";
import { getPortfolioData } from "./templates/v1/data";
import { PortfolioData } from "./templates/v1/data";

export function PortfolioPreview({
  data,
  template,
}: {
  data: any;
  template: string;
}) {
  switch (template) {
    case "classic-v1":
      return <V1Portfolio data={data} />;
    case "modern-v2":
      return <V2Portfolio data={data} />;
    default:
      return <div>No valid template selected.</div>;
  }
}
