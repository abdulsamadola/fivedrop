"use client";

import { forwardRef, useMemo } from "react";
import {
  FONT_INFO,
  GRADIENT_PRESETS,
  PLATFORM_DIMENSIONS,
  type PostSettings,
} from "@/lib/types";

interface PreviewCanvasProps {
  settings: PostSettings;
}

export const PreviewCanvas = forwardRef<HTMLDivElement, PreviewCanvasProps>(
  function PreviewCanvas({ settings }, ref) {
    const dimensions = PLATFORM_DIMENSIONS[settings.platform];
    const fontClass = FONT_INFO[settings.fontFamily].className;

    const background = useMemo(() => {
      if (settings.backgroundType === "gradient") {
        return GRADIENT_PRESETS[settings.gradientPreset].css;
      }
      return settings.backgroundColor;
    }, [settings.backgroundType, settings.gradientPreset, settings.backgroundColor]);

    // Calculate font size based on content length and format
    const { mainFontSize, subtitleFontSize, pointerFontSize } = useMemo(() => {
      const contentLength = settings.content.length;
      const isSquare = settings.platform === "instagram";
      
      let main: number;
      if (contentLength < 50) {
        main = isSquare ? 56 : 52;
      } else if (contentLength < 100) {
        main = isSquare ? 48 : 44;
      } else if (contentLength < 200) {
        main = isSquare ? 40 : 36;
      } else if (contentLength < 300) {
        main = isSquare ? 34 : 30;
      } else {
        main = isSquare ? 28 : 26;
      }

      // Adjust for format
      if (settings.format === "long-thought") {
        main = Math.max(main - 6, 22);
      } else if (settings.format === "list-drop") {
        main = Math.max(main - 4, 24);
      }

      return {
        mainFontSize: main,
        subtitleFontSize: Math.max(Math.floor(main * 0.55), 16),
        pointerFontSize: Math.max(Math.floor(main * 0.45), 14),
      };
    }, [settings.content.length, settings.platform, settings.format]);

    // Format content based on selected format
    const formattedContent = useMemo(() => {
      if (!settings.content) return "";
      
      switch (settings.format) {
        case "list-drop":
          // Split by newlines or numbered items
          const lines = settings.content
            .split(/\n|(?=\d+[.\)]\s)/)
            .filter((line) => line.trim());
          return lines.map((line, i) => (
            <div key={i} className="flex gap-3 items-start">
              <span className="opacity-60 font-medium">{i + 1}.</span>
              <span>{line.replace(/^\d+[.\)]\s*/, "").trim()}</span>
            </div>
          ));
        case "thread-starter":
          return (
            <div className="relative">
              <span className="absolute -left-8 top-0 text-2xl opacity-40">🧵</span>
              <span>{settings.content}</span>
            </div>
          );
        default:
          return settings.content;
      }
    }, [settings.content, settings.format]);

    const aspectRatio = dimensions.width / dimensions.height;
    const isSquare = settings.platform === "instagram";

    return (
      <div
        className="w-full"
        style={{
          aspectRatio: aspectRatio,
          maxHeight: isSquare ? "500px" : "400px",
        }}
      >
        <div
          ref={ref}
          className="w-full h-full preview-canvas rounded-lg overflow-hidden relative flex flex-col justify-center"
          style={{
            background,
            aspectRatio: aspectRatio,
          }}
        >
          <div
            className={`${fontClass} h-full flex flex-col justify-center`}
            style={{
              color: settings.textColor,
              padding: isSquare ? "10%" : "8% 10%",
            }}
          >
            {/* Main Content */}
            <div
              className="leading-tight font-semibold"
              style={{
                fontSize: `${mainFontSize}px`,
                lineHeight: 1.3,
                letterSpacing: "-0.02em",
              }}
            >
              {formattedContent || (
                <span className="opacity-40 italic">
                  Your content will appear here...
                </span>
              )}
            </div>

            {/* Subtitle */}
            {settings.subtitle && (
              <div
                className="mt-6 opacity-80 font-normal"
                style={{
                  fontSize: `${subtitleFontSize}px`,
                  lineHeight: 1.5,
                }}
              >
                {settings.subtitle}
              </div>
            )}

            {/* Comment Pointer */}
            {settings.showCommentPointer && settings.commentPointerText && (
              <div
                className="mt-auto pt-8 opacity-70 font-medium"
                style={{
                  fontSize: `${pointerFontSize}px`,
                }}
              >
                {settings.commentPointerText}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

