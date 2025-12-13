"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Loader2, Check, Smartphone } from "lucide-react";
import {
  PLATFORM_DIMENSIONS,
  type Platform,
  type PostSettings,
} from "@/lib/types";
import { toPng } from "html-to-image";

interface ExportPanelProps {
  settings: PostSettings;
  previewRef: React.RefObject<HTMLDivElement | null>;
}

export function ExportPanel({ settings, previewRef }: ExportPanelProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportedPlatform, setExportedPlatform] = useState<Platform | null>(null);

  const handleExport = async (platform: Platform) => {
    if (!previewRef.current) return;

    setIsExporting(true);
    setExportedPlatform(null);

    try {
      const dimensions = PLATFORM_DIMENSIONS[platform];
      const element = previewRef.current;
      
      // Get current element size
      const rect = element.getBoundingClientRect();
      
      // Calculate scale factor to reach target dimensions
      const scaleX = dimensions.width / rect.width;
      const scaleY = dimensions.height / rect.height;
      
      const dataUrl = await toPng(element, {
        width: dimensions.width,
        height: dimensions.height,
        canvasWidth: dimensions.width,
        canvasHeight: dimensions.height,
        pixelRatio: 1,
        style: {
          transform: `scale(${scaleX}, ${scaleY})`,
          transformOrigin: "top left",
        },
      });

      // Create and trigger download
      const link = document.createElement("a");
      link.download = `fivedrop-${platform}-${Date.now()}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setExportedPlatform(platform);
      setTimeout(() => setExportedPlatform(null), 2000);
    } catch (error) {
      console.error("Export failed:", error);
      alert("Export failed. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const currentPlatform = settings.platform;
  const currentDimensions = PLATFORM_DIMENSIONS[currentPlatform];

  // Platform order - square first for mobile
  const platformOrder: Platform[] = ["instagram", "instagram-story", "facebook", "linkedin", "twitter"];
  const otherPlatforms = platformOrder.filter(p => p !== currentPlatform);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-foreground">Export Image</h3>
        <Badge variant="outline" className="text-xs">
          {currentDimensions.width} × {currentDimensions.height}
        </Badge>
      </div>

      {/* Mobile-friendly notice */}
      <div className="flex items-start gap-2 p-3 bg-primary/5 rounded-lg text-xs text-muted-foreground">
        <Smartphone className="h-4 w-4 mt-0.5 flex-shrink-0" />
        <span>
          Images export at full resolution for crisp quality on all devices.
        </span>
      </div>

      {/* Quick Export - Current Platform */}
      <Button
        onClick={() => handleExport(currentPlatform)}
        disabled={isExporting || !settings.content}
        className="w-full h-12 text-base font-medium"
        size="lg"
      >
        {isExporting ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Generating...
          </>
        ) : exportedPlatform === currentPlatform ? (
          <>
            <Check className="mr-2 h-5 w-5" />
            Downloaded!
          </>
        ) : (
          <>
            <Download className="mr-2 h-5 w-5" />
            Download {currentDimensions.name}
          </>
        )}
      </Button>

      {/* All Platforms */}
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground">Other sizes:</p>
        <div className="grid grid-cols-2 gap-2">
          {otherPlatforms.map((key) => {
            const info = PLATFORM_DIMENSIONS[key];
            return (
              <Button
                key={key}
                variant="outline"
                size="sm"
                onClick={() => handleExport(key)}
                disabled={isExporting || !settings.content}
                className="text-xs h-9"
              >
                {exportedPlatform === key ? (
                  <Check className="mr-1 h-3 w-3" />
                ) : (
                  <Download className="mr-1 h-3 w-3" />
                )}
                {info.name}
              </Button>
            );
          })}
        </div>
      </div>

      {!settings.content && (
        <p className="text-xs text-muted-foreground text-center py-2">
          Add content to enable export
        </p>
      )}
    </div>
  );
}
