"use client";

import { forwardRef, useMemo } from "react";
import {
  FONT_INFO,
  GRADIENT_PRESETS,
  PLATFORM_DIMENSIONS,
  CTA_SIZES,
  type PostSettings,
} from "@/lib/types";
import { ArrowDown } from "lucide-react";

interface PreviewCanvasProps {
  settings: PostSettings;
}

// Twitter verified badge - exact replica
function VerifiedBadge({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484z"
        fill="#1D9BF0"
      />
      <path
        d="M9.813 15.904L7.076 13.166c-.294-.293-.294-.768 0-1.06.293-.294.768-.294 1.06 0l2.03 2.03 4.908-4.908c.293-.293.768-.293 1.06 0 .294.294.294.769 0 1.061l-5.437 5.438c-.146.146-.338.22-.53.22-.19 0-.384-.074-.53-.22l-.824-.823z"
        fill="white"
      />
    </svg>
  );
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

    const isSquare = settings.platform === "instagram";
    const isStory = settings.platform === "instagram-story";
    const isCreatorCard = settings.format === "creator-card";

    // Smarter font size calculation based on content length
    const { mainFontSize, subtitleFontSize, pointerFontSize, handleFontSize } = useMemo(() => {
      const contentLength = settings.content.length;
      const wordCount = settings.content.split(/\s+/).filter(w => w).length;
      const lineCount = settings.content.split('\n').length;
      
      // Use a combination of character count and word count for better scaling
      const complexityScore = contentLength + (wordCount * 2) + (lineCount * 10);
      
      let main: number;
      
      if (isStory) {
        // Story format - taller, needs different scaling
        if (complexityScore < 60) main = 48;
        else if (complexityScore < 100) main = 42;
        else if (complexityScore < 150) main = 36;
        else if (complexityScore < 220) main = 30;
        else if (complexityScore < 300) main = 26;
        else if (complexityScore < 400) main = 22;
        else if (complexityScore < 500) main = 19;
        else main = 16;
      } else if (isSquare) {
        // Square format - most common
        if (complexityScore < 50) main = 42;
        else if (complexityScore < 80) main = 36;
        else if (complexityScore < 120) main = 32;
        else if (complexityScore < 180) main = 28;
        else if (complexityScore < 250) main = 24;
        else if (complexityScore < 350) main = 21;
        else if (complexityScore < 450) main = 18;
        else if (complexityScore < 600) main = 16;
        else main = 14;
      } else {
        // Landscape formats - less vertical space
        if (complexityScore < 50) main = 38;
        else if (complexityScore < 80) main = 32;
        else if (complexityScore < 120) main = 28;
        else if (complexityScore < 180) main = 24;
        else if (complexityScore < 250) main = 21;
        else if (complexityScore < 350) main = 18;
        else if (complexityScore < 450) main = 16;
        else main = 14;
      }

      // Adjust for format
      if (settings.format === "long-thought") {
        main = Math.max(main - 2, 14);
      } else if (settings.format === "list-drop") {
        main = Math.max(main - 1, 14);
      } else if (isCreatorCard) {
        // Creator card needs room for header
        main = Math.max(main - 1, 14);
      }

      return {
        mainFontSize: main,
        subtitleFontSize: Math.max(Math.floor(main * 0.55), 12),
        pointerFontSize: Math.max(Math.floor(main * 0.45), 11),
        handleFontSize: Math.max(Math.floor(main * 0.4), 11),
      };
    }, [settings.content, settings.platform, settings.format, isSquare, isStory, isCreatorCard]);

    // Auto-scale name font size based on name length
    const nameFontSize = useMemo(() => {
      const nameLength = settings.creatorName?.length || 0;
      const baseSize = Math.max(Math.floor(mainFontSize * 0.55), 14);
      
      // Scale down name font if name is too long
      if (nameLength > 25) return Math.max(baseSize * 0.7, 12);
      if (nameLength > 20) return Math.max(baseSize * 0.8, 12);
      if (nameLength > 15) return Math.max(baseSize * 0.9, 13);
      return baseSize;
    }, [settings.creatorName, mainFontSize]);

    // Apply highlight to content - works for all formats
    const applyHighlight = (text: string): React.ReactNode => {
      if (!settings.highlightText || !text.includes(settings.highlightText)) {
        return text;
      }
      
      const parts = text.split(new RegExp(`(${settings.highlightText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
      return parts.map((part, i) => 
        part.toLowerCase() === settings.highlightText.toLowerCase() ? (
          <span key={i} style={{ color: settings.highlightColor }}>{part}</span>
        ) : (
          part
        )
      );
    };

    // Format content based on selected format
    const formattedContent = useMemo(() => {
      if (!settings.content) return null;
      
      switch (settings.format) {
        case "list-drop":
          const lines = settings.content
            .split(/\n|(?=\d+[.\)]\s)/)
            .filter((line) => line.trim());
          return lines.map((line, i) => (
            <div key={i} className="flex gap-2 items-start">
              <span className="opacity-60 font-medium flex-shrink-0">{i + 1}.</span>
              <span>{applyHighlight(line.replace(/^\d+[.\)]\s*/, "").trim())}</span>
            </div>
          ));
        case "thread-starter":
          return (
            <div className="relative">
              <span className="absolute -left-6 top-0 opacity-40" style={{ fontSize: `${mainFontSize * 0.8}px` }}>🧵</span>
              <span>{applyHighlight(settings.content)}</span>
            </div>
          );
        default:
          return applyHighlight(settings.content);
      }
    }, [settings.content, settings.format, settings.highlightText, settings.highlightColor, mainFontSize]);

    const aspectRatio = dimensions.width / dimensions.height;

    // Calculate CTA button size
    const ctaSize = useMemo(() => {
      const baseSize = Math.max(mainFontSize * 1.2, 32);
      const multiplier = CTA_SIZES[settings.ctaSize].multiplier;
      return baseSize * multiplier;
    }, [mainFontSize, settings.ctaSize]);

    // Fixed preview dimensions for consistency
    const previewWidth = isStory ? 240 : isSquare ? 340 : 400;
    const previewHeight = Math.round(previewWidth / aspectRatio);

    return (
      <div className="w-full flex justify-center">
        <div
          ref={ref}
          className="preview-canvas rounded-lg overflow-hidden relative flex flex-col"
          style={{
            background,
            width: `${previewWidth}px`,
            height: `${previewHeight}px`,
          }}
        >
          <div
            className={`${fontClass} h-full flex flex-col`}
            style={{
              color: settings.textColor,
              padding: isStory ? "10% 7%" : isSquare ? "8% 7%" : "5% 6%",
            }}
          >
            {/* Creator Card Header */}
            {isCreatorCard && (settings.creatorName || settings.creatorHandle) && (
              <div className="flex items-center gap-3 mb-4">
                {/* Avatar */}
                {settings.creatorAvatar ? (
                  <img
                    src={settings.creatorAvatar}
                    alt={settings.creatorName}
                    className="rounded-full object-cover flex-shrink-0"
                    style={{
                      width: `${Math.max(mainFontSize * 2, 44)}px`,
                      height: `${Math.max(mainFontSize * 2, 44)}px`,
                    }}
                    crossOrigin="anonymous"
                  />
                ) : (
                  <div
                    className="rounded-full bg-gray-600 flex items-center justify-center text-white font-bold flex-shrink-0"
                    style={{
                      width: `${Math.max(mainFontSize * 2, 44)}px`,
                      height: `${Math.max(mainFontSize * 2, 44)}px`,
                      fontSize: `${Math.max(mainFontSize * 0.7, 16)}px`,
                    }}
                  >
                    {settings.creatorName?.charAt(0)?.toUpperCase() || "?"}
                  </div>
                )}
                {/* Name & Handle */}
                <div className="flex flex-col min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span
                      className="font-semibold"
                      style={{ fontSize: `${nameFontSize}px` }}
                    >
                      {settings.creatorName || "Your Name"}
                    </span>
                    {settings.showVerifiedBadge && (
                      <VerifiedBadge size={Math.max(nameFontSize * 1.1, 16)} />
                    )}
                  </div>
                  <span
                    className="opacity-60"
                    style={{ fontSize: `${handleFontSize}px` }}
                  >
                    {settings.creatorHandle ? `@${settings.creatorHandle.replace("@", "")}` : "@handle"}
                  </span>
                </div>
              </div>
            )}

            {/* Main Content */}
            <div
              className={`leading-snug font-bold flex-1 flex items-center`}
              style={{
                fontSize: `${mainFontSize}px`,
                lineHeight: 1.35,
                letterSpacing: "-0.01em",
              }}
            >
              <div className="w-full">
                {formattedContent || (
                  <span className="opacity-40 italic font-normal">
                    Your content will appear here...
                  </span>
                )}
              </div>
            </div>

            {/* Subtitle */}
            {settings.subtitle && (
              <div
                className="mt-3 opacity-80 font-normal"
                style={{
                  fontSize: `${subtitleFontSize}px`,
                  lineHeight: 1.4,
                }}
              >
                {applyHighlight(settings.subtitle)}
              </div>
            )}

            {/* Comment Pointer */}
            {settings.showCommentPointer && settings.commentPointerText && (
              <div
                className="mt-auto pt-4 opacity-70 font-medium"
                style={{
                  fontSize: `${pointerFontSize}px`,
                }}
              >
                {settings.commentPointerText}
              </div>
            )}

            {/* CTA Button */}
            {settings.showCtaButton && (
              <div className="mt-auto pt-4 flex justify-center">
                <div
                  className="rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor: settings.highlightColor,
                    width: `${ctaSize}px`,
                    height: `${ctaSize}px`,
                  }}
                >
                  <ArrowDown
                    className="text-black"
                    style={{
                      width: `${ctaSize * 0.5}px`,
                      height: `${ctaSize * 0.5}px`,
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);
