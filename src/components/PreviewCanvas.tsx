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

// Custom verified badge with thin white checkmark
function VerifiedBadge({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Flower/star shape background */}
      <path
        d="M12 2C10.9 2 10 2.9 10 4C10 2.9 9.1 2 8 2C6.9 2 6 2.9 6 4C4.9 4 4 4.9 4 6C2.9 6 2 6.9 2 8C2 9.1 2.9 10 4 10C2.9 10 2 10.9 2 12C2 13.1 2.9 14 4 14C2.9 14 2 14.9 2 16C2 17.1 2.9 18 4 18C4 19.1 4.9 20 6 20C6 21.1 6.9 22 8 22C9.1 22 10 21.1 10 20C10 21.1 10.9 22 12 22C13.1 22 14 21.1 14 20C14 21.1 14.9 22 16 22C17.1 22 18 21.1 18 20C19.1 20 20 19.1 20 18C21.1 18 22 17.1 22 16C22 14.9 21.1 14 20 14C21.1 14 22 13.1 22 12C22 10.9 21.1 10 20 10C21.1 10 22 9.1 22 8C22 6.9 21.1 6 20 6C20 4.9 19.1 4 18 4C18 2.9 17.1 2 16 2C14.9 2 14 2.9 14 4C14 2.9 13.1 2 12 2Z"
        fill="#1D9BF0"
      />
      {/* Thin checkmark */}
      <path
        d="M9.5 12.5L11 14L15 10"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
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
    const { mainFontSize, subtitleFontSize, pointerFontSize, nameFontSize, handleFontSize } = useMemo(() => {
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
        nameFontSize: Math.max(Math.floor(main * 0.55), 14),
        handleFontSize: Math.max(Math.floor(main * 0.4), 11),
      };
    }, [settings.content, settings.platform, settings.format, isSquare, isStory, isCreatorCard]);

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

    // Calculate max height based on platform
    const getMaxHeight = () => {
      if (isStory) return "550px";
      if (isSquare) return "420px";
      return "320px";
    };

    return (
      <div
        className="w-full flex justify-center"
        style={{
          maxHeight: getMaxHeight(),
        }}
      >
        <div
          ref={ref}
          className="preview-canvas rounded-lg overflow-hidden relative flex flex-col"
          style={{
            background,
            aspectRatio: aspectRatio,
            width: "100%",
            maxWidth: isStory ? "250px" : isSquare ? "420px" : "100%",
            height: "auto",
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
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="font-semibold truncate"
                      style={{ fontSize: `${nameFontSize}px` }}
                    >
                      {settings.creatorName || "Your Name"}
                    </span>
                    {settings.showVerifiedBadge && (
                      <VerifiedBadge size={nameFontSize * 1.3} />
                    )}
                  </div>
                  <span
                    className="opacity-60 truncate"
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
