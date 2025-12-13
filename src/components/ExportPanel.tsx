"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Loader2, Check } from "lucide-react";
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
      
      // Clone the preview element and resize it
      const element = previewRef.current;
      
      const dataUrl = await toPng(element, {
        width: dimensions.width,
        height: dimensions.height,
        pixelRatio: 2,
        style: {
          width: `${dimensions.width}px`,
          height: `${dimensions.height}px`,
          transform: "scale(1)",
          transformOrigin: "top left",
        },
      });

      // Create download link
      const link = document.createElement("a");
      link.download = `fivedrop-${platform}-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();

      setExportedPlatform(platform);
      setTimeout(() => setExportedPlatform(null), 2000);
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const currentPlatform = settings.platform;
  const currentDimensions = PLATFORM_DIMENSIONS[currentPlatform];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-foreground">Export Image</h3>
        <Badge variant="outline" className="text-xs">
          {currentDimensions.width} × {currentDimensions.height}
        </Badge>
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
            Download for {currentDimensions.name}
          </>
        )}
      </Button>

      {/* All Platforms */}
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground">Export for other platforms:</p>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(PLATFORM_DIMENSIONS)
            .filter(([key]) => key !== currentPlatform)
            .map(([key, info]) => (
              <Button
                key={key}
                variant="outline"
                size="sm"
                onClick={() => handleExport(key as Platform)}
                disabled={isExporting || !settings.content}
                className="text-xs"
              >
                {exportedPlatform === key ? (
                  <Check className="mr-1 h-3 w-3" />
                ) : (
                  <Download className="mr-1 h-3 w-3" />
                )}
                {info.name}
              </Button>
            ))}
        </div>
      </div>

      {!settings.content && (
        <p className="text-xs text-muted-foreground text-center py-2">
          Add some content to enable export
        </p>
      )}
    </div>
  );
}

