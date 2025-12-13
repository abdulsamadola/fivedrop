"use client";

import { forwardRef, useMemo } from "react";
import {
  FONT_INFO,
  GRADIENT_PRESETS,
  PLATFORM_DIMENSIONS,
  type PostSettings,
} from "@/lib/types";
import { ArrowDown, BadgeCheck } from "lucide-react";

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

    const isSquare = settings.platform === "instagram";
    const isStory = settings.platform === "instagram-story";
    const isCreatorCard = settings.format === "creator-card";

    // Calculate font size based on content length and format
    const { mainFontSize, subtitleFontSize, pointerFontSize, nameFontSize, handleFontSize } = useMemo(() => {
      const contentLength = settings.content.length;
      
      // Base size calculation - more aggressive scaling for longer content
      let main: number;
      if (isStory) {
        // Story format - larger text
        if (contentLength < 50) main = 48;
        else if (contentLength < 100) main = 42;
        else if (contentLength < 150) main = 36;
        else if (contentLength < 200) main = 32;
        else if (contentLength < 300) main = 28;
        else main = 24;
      } else if (isSquare) {
        // Square format
        if (contentLength < 50) main = 44;
        else if (contentLength < 100) main = 38;
        else if (contentLength < 150) main = 34;
        else if (contentLength < 200) main = 30;
        else if (contentLength < 300) main = 26;
        else if (contentLength < 400) main = 23;
        else main = 20;
      } else {
        // Landscape formats
        if (contentLength < 50) main = 42;
        else if (contentLength < 100) main = 36;
        else if (contentLength < 150) main = 32;
        else if (contentLength < 200) main = 28;
        else if (contentLength < 300) main = 24;
        else main = 20;
      }

      // Adjust for format
      if (settings.format === "long-thought") {
        main = Math.max(main - 4, 18);
      } else if (settings.format === "list-drop") {
        main = Math.max(main - 2, 18);
      } else if (isCreatorCard) {
        // Creator card needs room for header
        main = Math.max(main - 2, 18);
      }

      return {
        mainFontSize: main,
        subtitleFontSize: Math.max(Math.floor(main * 0.55), 14),
        pointerFontSize: Math.max(Math.floor(main * 0.45), 12),
        nameFontSize: Math.max(Math.floor(main * 0.5), 16),
        handleFontSize: Math.max(Math.floor(main * 0.4), 12),
      };
    }, [settings.content.length, settings.platform, settings.format, isSquare, isStory, isCreatorCard]);

    // Format content with highlight support
    const formattedContent = useMemo(() => {
      if (!settings.content) return null;
      
      let content: React.ReactNode = settings.content;

      // Apply highlight if specified
      if (settings.highlightText && settings.content.includes(settings.highlightText)) {
        const parts = settings.content.split(settings.highlightText);
        content = (
          <>
            {parts[0]}
            <span style={{ color: settings.highlightColor }}>{settings.highlightText}</span>
            {parts.slice(1).join(settings.highlightText)}
          </>
        );
      }
      
      switch (settings.format) {
        case "list-drop":
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
              <span>{content}</span>
            </div>
          );
        default:
          return content;
      }
    }, [settings.content, settings.format, settings.highlightText, settings.highlightColor]);

    const aspectRatio = dimensions.width / dimensions.height;

    // Calculate max height based on platform
    const getMaxHeight = () => {
      if (isStory) return "600px";
      if (isSquare) return "450px";
      return "350px";
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
            maxWidth: isStory ? "280px" : isSquare ? "450px" : "100%",
            height: "auto",
          }}
        >
          <div
            className={`${fontClass} h-full flex flex-col`}
            style={{
              color: settings.textColor,
              padding: isStory ? "12% 8%" : isSquare ? "10% 8%" : "6% 8%",
            }}
          >
            {/* Creator Card Header */}
            {isCreatorCard && (settings.creatorName || settings.creatorHandle) && (
              <div className="flex items-center gap-3 mb-auto">
                {/* Avatar */}
                {settings.creatorAvatar ? (
                  <img
                    src={settings.creatorAvatar}
                    alt={settings.creatorName}
                    className="rounded-full object-cover"
                    style={{
                      width: `${Math.max(mainFontSize * 1.8, 48)}px`,
                      height: `${Math.max(mainFontSize * 1.8, 48)}px`,
                    }}
                    crossOrigin="anonymous"
                  />
                ) : (
                  <div
                    className="rounded-full bg-gray-600 flex items-center justify-center text-white font-bold"
                    style={{
                      width: `${Math.max(mainFontSize * 1.8, 48)}px`,
                      height: `${Math.max(mainFontSize * 1.8, 48)}px`,
                      fontSize: `${Math.max(mainFontSize * 0.7, 18)}px`,
                    }}
                  >
                    {settings.creatorName?.charAt(0)?.toUpperCase() || "?"}
                  </div>
                )}
                {/* Name & Handle */}
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="font-semibold"
                      style={{ fontSize: `${nameFontSize}px` }}
                    >
                      {settings.creatorName || "Your Name"}
                    </span>
                    {settings.showVerifiedBadge && (
                      <BadgeCheck
                        className="text-blue-500 fill-blue-500"
                        style={{
                          width: `${nameFontSize}px`,
                          height: `${nameFontSize}px`,
                        }}
                      />
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
              className={`leading-tight font-bold ${isCreatorCard ? "my-auto" : "flex-1 flex items-center"}`}
              style={{
                fontSize: `${mainFontSize}px`,
                lineHeight: 1.35,
                letterSpacing: "-0.01em",
              }}
            >
              <div>
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
                className="mt-4 opacity-80 font-normal"
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
                className="mt-auto pt-6 opacity-70 font-medium"
                style={{
                  fontSize: `${pointerFontSize}px`,
                }}
              >
                {settings.commentPointerText}
              </div>
            )}

            {/* CTA Button */}
            {settings.showCtaButton && (
              <div className="mt-auto pt-6 flex justify-center">
                <div
                  className="rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor: settings.highlightColor,
                    width: `${Math.max(mainFontSize * 1.5, 40)}px`,
                    height: `${Math.max(mainFontSize * 1.5, 40)}px`,
                  }}
                >
                  <ArrowDown
                    className="text-black"
                    style={{
                      width: `${Math.max(mainFontSize * 0.8, 20)}px`,
                      height: `${Math.max(mainFontSize * 0.8, 20)}px`,
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
