"use client";

import { forwardRef, useMemo } from "react";
import {
  FONT_INFO,
  GRADIENT_PRESETS,
  PLATFORM_DIMENSIONS,
  CTA_SIZES,
  type PostSettings,
} from "@/lib/types";
import { ArrowDown, Check } from "lucide-react";

interface PreviewCanvasProps {
  settings: PostSettings;
}

// Custom verified badge SVG component matching the Facebook/Twitter style
function VerifiedBadge({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M20.396 11c.018-.648-.088-1.293-.311-1.895a4.56 4.56 0 00-1.028-1.59c-.178-.178-.362-.34-.551-.489a4.48 4.48 0 00-.684-.455c-.225-.118-.461-.217-.704-.293a4.67 4.67 0 00-.763-.157 5.46 5.46 0 00-.788-.034c-.089.003-.178.01-.266.021a4.6 4.6 0 00-.523.082c-.156.035-.31.078-.46.129a4.4 4.4 0 00-.437.175 5.07 5.07 0 00-.407.214c-.134.08-.264.166-.389.258l-.358.278-.348.304-.325.329-.303.354-.271.377-.242.401-.212.424-.18.447-.148.47-.115.491-.082.512-.05.533-.015.553.021.573.056.548.09.522.125.498.16.474.193.45.227.425.261.4.293.376.327.35.36.325.393.299.426.272.459.246.491.218.523.191.556.163.588.134.62.105"
        fill="#1D9BF0"
      />
      <path
        d="M11 1c-.556 0-1.108.03-1.652.09a9.9 9.9 0 00-1.59.27 9.54 9.54 0 00-1.49.474c-.48.197-.94.426-1.377.684-.437.258-.85.546-1.236.861-.385.316-.743.659-1.07 1.024-.327.366-.622.756-.882 1.166a9.94 9.94 0 00-1.142 2.655 9.73 9.73 0 00-.376 1.656c-.06.544-.09 1.096-.09 1.652s.03 1.108.09 1.652c.06.544.17 1.08.27 1.59.1.51.27 1.01.474 1.49.197.48.426.94.684 1.377.258.437.546.85.861 1.236.316.385.659.743 1.024 1.07.366.327.756.622 1.166.882a9.94 9.94 0 002.655 1.142c.51.154 1.03.28 1.558.367.528.087 1.064.143 1.604.163a10.25 10.25 0 001.652-.02c.544-.06 1.08-.17 1.59-.27.51-.1 1.01-.27 1.49-.474.48-.197.94-.426 1.377-.684.437-.258.85-.546 1.236-.861.385-.316.743-.659 1.07-1.024.327-.366.622-.756.882-1.166a9.94 9.94 0 001.142-2.655c.154-.51.28-1.03.367-1.558.087-.528.143-1.064.163-1.604a10.25 10.25 0 00-.02-1.652 9.9 9.9 0 00-.27-1.59 9.54 9.54 0 00-.474-1.49 9.72 9.72 0 00-.684-1.377 9.8 9.8 0 00-.861-1.236 9.75 9.75 0 00-1.024-1.07 9.94 9.94 0 00-1.166-.882 9.94 9.94 0 00-2.655-1.142 9.73 9.73 0 00-1.656-.376C12.108 1.03 11.556 1 11 1z"
        fill="#1D9BF0"
      />
      <path
        d="M9.64 15.67l-3.64-3.64 1.41-1.41 2.23 2.23 5.23-5.23 1.41 1.41-6.64 6.64z"
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
                      <VerifiedBadge size={nameFontSize * 1.1} />
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
