'use client'

import { forwardRef, useMemo } from 'react'
import {
  FONT_INFO,
  GRADIENT_PRESETS,
  PLATFORM_DIMENSIONS,
  CTA_SIZES,
  type PostSettings,
} from '@/lib/types'
import { ArrowDown } from 'lucide-react'

interface PreviewCanvasProps {
  settings: PostSettings
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
  )
}

export const PreviewCanvas = forwardRef<HTMLDivElement, PreviewCanvasProps>(
  function PreviewCanvas({ settings }, ref) {
    const dimensions = PLATFORM_DIMENSIONS[settings.platform]
    const fontClass = FONT_INFO[settings.fontFamily].className

    const background = useMemo(() => {
      if (settings.backgroundType === 'gradient') {
        return GRADIENT_PRESETS[settings.gradientPreset].css
      }
      return settings.backgroundColor
    }, [
      settings.backgroundType,
      settings.gradientPreset,
      settings.backgroundColor,
    ])

    const isSquare = settings.platform === 'instagram'
    const isStory = settings.platform === 'instagram-story'
    const isCreatorCard = settings.format === 'creator-card'

    // Calculate display scale - render at full size, scale down for preview
    const displayScale = useMemo(() => {
      const maxPreviewWidth = isStory ? 200 : isSquare ? 320 : 380
      return maxPreviewWidth / dimensions.width
    }, [dimensions.width, isSquare, isStory])

    // Font sizes based on FULL export dimensions - REDUCED for better margins
    const { mainFontSize, subtitleFontSize, pointerFontSize, handleFontSize } =
      useMemo(() => {
        const contentLength = settings.content.length
        const wordCount = settings.content.split(/\s+/).filter((w) => w).length
        const lineCount = settings.content.split('\n').length
        const complexityScore = contentLength + wordCount * 2 + lineCount * 10

        // Base size relative to canvas width - SMALLER for proper margins
        const baseWidth = dimensions.width
        let main: number

        if (isStory) {
          // Story format (1080x1920) - taller canvas
          if (complexityScore < 60) main = baseWidth * 0.048
          else if (complexityScore < 100) main = baseWidth * 0.042
          else if (complexityScore < 150) main = baseWidth * 0.036
          else if (complexityScore < 220) main = baseWidth * 0.032
          else if (complexityScore < 300) main = baseWidth * 0.028
          else if (complexityScore < 400) main = baseWidth * 0.024
          else if (complexityScore < 500) main = baseWidth * 0.021
          else main = baseWidth * 0.018
        } else if (isSquare) {
          // Square format (1080x1080) - reduced by ~25%
          if (complexityScore < 50) main = baseWidth * 0.042
          else if (complexityScore < 80) main = baseWidth * 0.038
          else if (complexityScore < 120) main = baseWidth * 0.034
          else if (complexityScore < 180) main = baseWidth * 0.03
          else if (complexityScore < 250) main = baseWidth * 0.026
          else if (complexityScore < 350) main = baseWidth * 0.023
          else if (complexityScore < 450) main = baseWidth * 0.02
          else if (complexityScore < 600) main = baseWidth * 0.018
          else main = baseWidth * 0.016
        } else {
          // Landscape formats (1200x630) - reduced
          if (complexityScore < 50) main = baseWidth * 0.038
          else if (complexityScore < 80) main = baseWidth * 0.034
          else if (complexityScore < 120) main = baseWidth * 0.03
          else if (complexityScore < 180) main = baseWidth * 0.026
          else if (complexityScore < 250) main = baseWidth * 0.023
          else if (complexityScore < 350) main = baseWidth * 0.02
          else if (complexityScore < 450) main = baseWidth * 0.018
          else main = baseWidth * 0.016
        }

        // Adjust for format type
        if (settings.format === 'long-thought') {
          main = Math.max(main * 0.9, baseWidth * 0.015)
        } else if (settings.format === 'list-drop') {
          main = Math.max(main * 0.92, baseWidth * 0.015)
        } else if (isCreatorCard) {
          main = Math.max(main * 0.92, baseWidth * 0.015)
        }

        return {
          mainFontSize: Math.round(main),
          subtitleFontSize: Math.round(
            Math.max(main * 0.48, baseWidth * 0.014)
          ),
          pointerFontSize: Math.round(Math.max(main * 0.4, baseWidth * 0.012)),
          handleFontSize: Math.round(Math.max(main * 0.36, baseWidth * 0.012)),
        }
      }, [
        settings.content,
        settings.format,
        dimensions.width,
        isSquare,
        isStory,
        isCreatorCard,
      ])

    // Name font size scaled for export dimensions
    const nameFontSize = useMemo(() => {
      const nameLength = settings.creatorName?.length || 0
      const baseSize = Math.round(
        Math.max(mainFontSize * 0.52, dimensions.width * 0.022)
      )

      if (nameLength > 25) return Math.round(baseSize * 0.72)
      if (nameLength > 20) return Math.round(baseSize * 0.82)
      if (nameLength > 15) return Math.round(baseSize * 0.9)
      return baseSize
    }, [settings.creatorName, mainFontSize, dimensions.width])

    // Calculate dynamic height based on content - SMART SIZING like the example
    const dynamicDimensions = useMemo(() => {
      const baseWidth = dimensions.width
      const contentLength = settings.content.length
      const lineCount = settings.content.split('\n').length
      const hasHeader =
        isCreatorCard && (settings.creatorName || settings.creatorHandle)
      const hasSubtitle = !!settings.subtitle
      const hasCTA = settings.showCtaButton
      const hasPointer = settings.showCommentPointer

      // For story/landscape, keep original dimensions
      if (isStory || (!isSquare && !isStory)) {
        return { width: baseWidth, height: dimensions.height }
      }

      // Calculate lines needed (~20-22 chars per line at optimal font)
      const charsPerLine = 22
      const textLines = Math.ceil(contentLength / charsPerLine) + lineCount - 1

      // Build height from components (all as % of width)
      let h = 0
      
      // Top padding
      h += baseWidth * 0.065
      
      // Header if present
      if (hasHeader) h += baseWidth * 0.11
      
      // Gap after header
      if (hasHeader) h += baseWidth * 0.05
      
      // Main content (each line ~5.5% of width)
      h += textLines * baseWidth * 0.052
      
      // Subtitle
      if (hasSubtitle) h += baseWidth * 0.07
      
      // Gap before CTA
      if (hasCTA || hasPointer) h += baseWidth * 0.04
      
      // CTA button
      if (hasCTA) h += baseWidth * 0.08
      
      // Comment pointer
      if (hasPointer) h += baseWidth * 0.05
      
      // Bottom padding
      h += baseWidth * 0.065

      // Clamp between 55% and 120% of width
      h = Math.max(baseWidth * 0.55, Math.min(baseWidth * 1.2, h))

      return { width: baseWidth, height: Math.round(h) }
    }, [
      dimensions,
      settings.content,
      settings.creatorName,
      settings.creatorHandle,
      settings.subtitle,
      settings.showCtaButton,
      settings.showCommentPointer,
      isCreatorCard,
      isSquare,
      isStory,
    ])

    // Apply highlight to content
    const applyHighlight = (text: string): React.ReactNode => {
      if (!settings.highlightText || !text.includes(settings.highlightText)) {
        return text
      }

      const parts = text.split(
        new RegExp(
          `(${settings.highlightText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`,
          'gi'
        )
      )
      return parts.map((part, i) =>
        part.toLowerCase() === settings.highlightText.toLowerCase() ? (
          <span key={i} style={{ color: settings.highlightColor }}>
            {part}
          </span>
        ) : (
          part
        )
      )
    }

    // Format content based on selected format
    const formattedContent = useMemo(() => {
      if (!settings.content) return null

      switch (settings.format) {
        case 'list-drop':
          const lines = settings.content
            .split(/\n|(?=\d+[.\)]\s)/)
            .filter((line) => line.trim())
          return lines.map((line, i) => (
            <div
              key={i}
              className="flex items-start"
              style={{ gap: `${dimensions.width * 0.015}px` }}
            >
              <span className="opacity-60 font-medium shrink-0">{i + 1}.</span>
              <span>
                {applyHighlight(line.replace(/^\d+[.\)]\s*/, '').trim())}
              </span>
            </div>
          ))
        case 'thread-starter':
          return (
            <div className="relative">
              <span
                className="absolute opacity-40"
                style={{
                  fontSize: `${mainFontSize * 0.8}px`,
                  left: `-${dimensions.width * 0.045}px`,
                  top: 0,
                }}
              >
                🧵
              </span>
              <span>{applyHighlight(settings.content)}</span>
            </div>
          )
        default:
          return applyHighlight(settings.content)
      }
    }, [
      settings.content,
      settings.format,
      settings.highlightText,
      settings.highlightColor,
      mainFontSize,
      dimensions.width,
    ])

    // CTA button size based on export dimensions - smaller
    const ctaSize = useMemo(() => {
      const baseSize = Math.max(mainFontSize * 1.0, dimensions.width * 0.04)
      const multiplier = CTA_SIZES[settings.ctaSize].multiplier
      return Math.round(baseSize * multiplier)
    }, [mainFontSize, settings.ctaSize, dimensions.width])

    // Avatar size - proportional
    const avatarSize = Math.round(
      Math.max(mainFontSize * 1.5, dimensions.width * 0.055)
    )

    // Padding based on export dimensions - increased for better margins
    const padding = useMemo(() => {
      const w = dimensions.width
      if (isStory) return `${w * 0.08}px ${w * 0.07}px`
      if (isSquare) return `${w * 0.065}px ${w * 0.07}px`
      return `${w * 0.055}px ${w * 0.06}px`
    }, [dimensions.width, isSquare, isStory])

    return (
      <div
        className="w-full flex justify-center overflow-hidden"
        style={{
          maxHeight: isStory ? '450px' : isSquare ? '350px' : '280px',
        }}
      >
        {/* Scaled wrapper for display */}
        <div
          style={{
            transform: `scale(${displayScale})`,
            transformOrigin: 'top center',
          }}
        >
          {/* Actual canvas at export size */}
          <div
            ref={ref}
            className="preview-canvas rounded-lg overflow-hidden relative flex flex-col"
            style={{
              background,
              width: `${dynamicDimensions.width}px`,
              height: `${dynamicDimensions.height}px`,
            }}
          >
            <div
              className={`${fontClass} h-full flex flex-col justify-between`}
              style={{
                color: settings.textColor,
                padding,
              }}
            >
              {/* Top Section - Header for Creator Card */}
              <div>
                {isCreatorCard &&
                  (settings.creatorName || settings.creatorHandle) && (
                    <div
                      className="flex items-center"
                      style={{ gap: `${dimensions.width * 0.018}px` }}
                    >
                      {/* Avatar */}
                      {settings.creatorAvatar ? (
                        <img
                          src={settings.creatorAvatar}
                          alt={settings.creatorName}
                          className="rounded-full object-cover shrink-0"
                          style={{
                            width: `${avatarSize}px`,
                            height: `${avatarSize}px`,
                          }}
                          crossOrigin="anonymous"
                        />
                      ) : (
                        <div
                          className="rounded-full bg-gray-600 flex items-center justify-center text-white font-bold shrink-0"
                          style={{
                            width: `${avatarSize}px`,
                            height: `${avatarSize}px`,
                            fontSize: `${avatarSize * 0.45}px`,
                          }}
                        >
                          {settings.creatorName?.charAt(0)?.toUpperCase() ||
                            '?'}
                        </div>
                      )}
                      {/* Name & Handle */}
                      <div className="flex flex-col min-w-0 flex-1">
                        <div
                          className="flex items-center flex-wrap"
                          style={{ gap: `${dimensions.width * 0.008}px` }}
                        >
                          <span
                            className="font-semibold"
                            style={{ fontSize: `${nameFontSize}px` }}
                          >
                            {settings.creatorName || 'Your Name'}
                          </span>
                          {settings.showVerifiedBadge && (
                            <VerifiedBadge
                              size={Math.round(nameFontSize * 0.95)}
                            />
                          )}
                        </div>
                        <span
                          className="opacity-60"
                          style={{ fontSize: `${handleFontSize}px` }}
                        >
                          {settings.creatorHandle
                            ? `@${settings.creatorHandle.replace('@', '')}`
                            : '@handle'}
                        </span>
                      </div>
                    </div>
                  )}
              </div>

              {/* Middle Section - Main Content */}
              <div
                className="flex-1 flex items-center"
                style={{ padding: `${dimensions.width * 0.02}px 0` }}
              >
                <div
                  className="leading-snug font-bold w-full"
                  style={{
                    fontSize: `${mainFontSize}px`,
                    lineHeight: 1.25,
                    letterSpacing: '-0.01em',
                  }}
                >
                  {formattedContent || (
                    <span className="opacity-40 italic font-normal">
                      Your content will appear here...
                    </span>
                  )}

                  {/* Subtitle - right after content */}
                  {settings.subtitle && (
                    <div
                      className="opacity-80 font-normal"
                      style={{
                        fontSize: `${subtitleFontSize}px`,
                        lineHeight: 1.4,
                        marginTop: `${dimensions.width * 0.02}px`,
                      }}
                    >
                      {applyHighlight(settings.subtitle)}
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Section - Comment Pointer or CTA */}
              <div>
                {/* Comment Pointer */}
                {settings.showCommentPointer && settings.commentPointerText && (
                  <div
                    className="opacity-70 font-medium"
                    style={{
                      fontSize: `${pointerFontSize}px`,
                      paddingBottom: `${dimensions.width * 0.01}px`,
                    }}
                  >
                    {settings.commentPointerText}
                  </div>
                )}

                {/* CTA Button */}
                {settings.showCtaButton && (
                  <div
                    className="flex justify-center"
                    style={{ paddingTop: `${dimensions.width * 0.015}px` }}
                  >
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
        </div>
      </div>
    )
  }
)
