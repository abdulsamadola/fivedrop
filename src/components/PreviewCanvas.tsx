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

// Twitter/Facebook style verified badge - smooth rounded shape
function VerifiedBadge({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Smooth rounded seal/badge shape like Twitter */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11 0C9.735 0 8.628.632 8.016 1.6C7.228 1.143 6.296 1 5.39 1.196C4.088 1.484 3.016 2.484 2.664 3.812C2.312 5.14 2.68 6.548 3.64 7.568C2.924 8.252 2.44 9.172 2.312 10.2C2.144 11.572 2.68 12.936 3.72 13.856C3.28 14.756 3.18 15.78 3.456 16.74C3.82 18.032 4.82 19.068 6.096 19.5C6.192 20.552 6.68 21.54 7.472 22.256L7.476 22.256C8.488 23.148 9.848 23.544 11.172 23.344C11.448 23.344 11.724 23.304 12 23.252C12.276 23.304 12.552 23.344 12.828 23.344C14.152 23.544 15.512 23.148 16.524 22.256L16.528 22.256C17.32 21.54 17.808 20.552 17.904 19.5C19.18 19.068 20.18 18.032 20.544 16.74C20.82 15.78 20.72 14.756 20.28 13.856C21.32 12.936 21.856 11.572 21.688 10.2C21.56 9.172 21.076 8.252 20.36 7.568C21.32 6.548 21.688 5.14 21.336 3.812C20.984 2.484 19.912 1.484 18.61 1.196C17.704 1 16.772 1.143 15.984 1.6C15.372.632 14.265 0 13 0H11Z"
        fill="#1D9BF0"
        transform="translate(0, -0.5) scale(1)"
      />
      {/* White checkmark - thin and elegant */}
      <path
        d="M15.67 7.52L9.9 13.29L7.33 10.72C7.14 10.53 6.84 10.53 6.65 10.72C6.46 10.91 6.46 11.21 6.65 11.4L9.56 14.31C9.75 14.5 10.05 14.5 10.24 14.31L16.35 8.2C16.54 8.01 16.54 7.71 16.35 7.52C16.16 7.33 15.86 7.33 15.67 7.52Z"
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
