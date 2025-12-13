'use client'

import {
  forwardRef,
  useMemo,
  useCallback,
  useState,
  useEffect,
  useRef,
} from 'react'
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

// Twitter/X verified badge - exact replica
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

/**
 * Smart Auto-Scaling System
 *
 * This system calculates optimal font sizes based on:
 * 1. Canvas dimensions (different platforms have different sizes)
 * 2. Content length and complexity
 * 3. Format type (creator card needs header space, etc.)
 *
 * The goal is WYSIWYG - preview looks exactly like export
 */
function useSmartScaling(settings: PostSettings) {
  const dimensions = PLATFORM_DIMENSIONS[settings.platform]
  const { width, height } = dimensions
  const aspectRatio = width / height

  // Determine canvas type for scaling strategy
  const canvasType = useMemo(() => {
    if (aspectRatio > 1.5) return 'landscape' // Facebook, LinkedIn, Twitter
    if (aspectRatio < 0.7) return 'portrait' // Stories
    return 'square' // Instagram
  }, [aspectRatio])

  // Calculate content metrics with better granularity
  const contentMetrics = useMemo(() => {
    const content = settings.content || ''
    const charCount = content.length
    const wordCount = content.split(/\s+/).filter(Boolean).length
    const lineBreaks = (content.match(/\n/g) || []).length

    // Estimate visual lines needed based on canvas and typical char width
    const usableWidth = width * 0.86 // Account for padding
    const avgCharWidth = width * 0.025 // Rough estimate per character at base size
    const charsPerLine = Math.floor(usableWidth / avgCharWidth)
    const estimatedLines =
      Math.ceil(charCount / Math.max(charsPerLine, 20)) + lineBreaks

    return {
      charCount,
      wordCount,
      lineBreaks,
      estimatedLines,
      isEmpty: charCount === 0,
      isShort: charCount < 60,
      isMedium: charCount >= 60 && charCount < 150,
      isLong: charCount >= 150 && charCount < 280,
      isVeryLong: charCount >= 280 && charCount < 450,
      isExtraLong: charCount >= 450 && charCount < 650,
      isUltraLong: charCount >= 650,
    }
  }, [settings.content, width])

  // Calculate base unit (relative to canvas size)
  // This is the foundation for all proportional sizing
  const baseUnit = useMemo(() => {
    // Use the smaller dimension as base for consistent scaling
    const smallerDim = Math.min(width, height)
    return smallerDim / 100 // 1 unit = 1% of smaller dimension
  }, [width, height])

  // Smart font size calculation
  const fontSize = useMemo(() => {
    // Base font size as percentage of canvas width
    // Adjusted for each canvas type
    let baseSizePercent: number

    switch (canvasType) {
      case 'landscape':
        // Landscape: height is limiting factor, use larger relative font
        baseSizePercent = 5.5
        break
      case 'portrait':
        // Portrait: width is limiting factor, use smaller relative font
        baseSizePercent = 4.5
        break
      case 'square':
      default:
        baseSizePercent = 5
        break
    }

    // Calculate BASE font size (used for header elements - stays stable)
    const baseSize = width * (baseSizePercent / 100)

    // Header elements use a stable size that doesn't scale with content length
    // This maintains the visual rhythm and keeps the profile card prominent
    const headerSize = baseSize * (canvasType === 'landscape' ? 0.9 : 1.0)

    // Main content size scales based on content length
    let mainSize = baseSize

    // Content-aware scaling - only affects the main body text
    let contentMultiplier: number
    if (contentMetrics.isShort) {
      // Short content (< 60 chars) - larger for impact
      contentMultiplier = 1.05
    } else if (contentMetrics.isMedium) {
      // Medium content (60-150 chars)
      contentMultiplier = canvasType === 'landscape' ? 0.88 : 0.95
    } else if (contentMetrics.isLong) {
      // Long content (150-280 chars)
      contentMultiplier = canvasType === 'landscape' ? 0.72 : 0.82
    } else if (contentMetrics.isVeryLong) {
      // Very long content (280-450 chars)
      contentMultiplier = canvasType === 'landscape' ? 0.58 : 0.68
    } else if (contentMetrics.isExtraLong) {
      // Extra long content (450-650 chars)
      contentMultiplier = canvasType === 'landscape' ? 0.48 : 0.55
    } else {
      // Ultra long content (650+ chars)
      contentMultiplier = canvasType === 'landscape' ? 0.4 : 0.45
    }

    mainSize *= contentMultiplier

    // Format-specific adjustments for main content only
    if (settings.format === 'list-drop') {
      mainSize *= 0.9
    } else if (settings.format === 'long-thought') {
      mainSize *= 0.88
    }

    // Bounds for main content text
    const minSize = width * 0.018
    const maxSize = canvasType === 'landscape' ? width * 0.052 : width * 0.065
    mainSize = Math.max(minSize, Math.min(maxSize, mainSize))

    return {
      main: Math.round(mainSize),
      subtitle: Math.round(mainSize * 0.52),
      // Header elements use the stable headerSize, not mainSize
      handle: Math.round(headerSize * 0.38),
      name: Math.round(headerSize * 0.48),
      pointer: Math.round(mainSize * 0.45),
    }
  }, [width, canvasType, contentMetrics, settings.format])

  // Spacing and padding (consistent percentages)
  const spacing = useMemo(() => {
    // Use percentage-based spacing for consistency
    const paddingPercent = canvasType === 'landscape' ? 6 : 7
    const horizontalPadding = width * (paddingPercent / 100)
    const verticalPadding = height * (paddingPercent / 100)

    return {
      padding: {
        horizontal: Math.round(horizontalPadding),
        vertical: Math.round(verticalPadding),
      },
      gap: {
        small: Math.round(baseUnit * 1.5),
        medium: Math.round(baseUnit * 3),
        large: Math.round(baseUnit * 5),
      },
    }
  }, [width, height, baseUnit, canvasType])

  // Element sizes - avatar uses stable sizing for visual consistency
  const elementSizes = useMemo(() => {
    // Avatar size should be stable and prominent, based on canvas not content
    const minAvatar = canvasType === 'landscape' ? baseUnit * 5.5 : baseUnit * 6
    const avatarSize = Math.round(Math.max(fontSize.name * 1.8, minAvatar))

    const ctaBaseSize = Math.round(Math.max(fontSize.main * 1.0, baseUnit * 4))
    const ctaMultiplier = CTA_SIZES[settings.ctaSize].multiplier

    return {
      avatar: avatarSize,
      cta: Math.round(ctaBaseSize * ctaMultiplier),
      badge: Math.round(fontSize.name * 0.85),
    }
  }, [fontSize, baseUnit, settings.ctaSize, canvasType])

  return {
    dimensions,
    canvasType,
    contentMetrics,
    fontSize,
    spacing,
    elementSizes,
    baseUnit,
  }
}

export const PreviewCanvas = forwardRef<HTMLDivElement, PreviewCanvasProps>(
  function PreviewCanvas({ settings }, ref) {
    const scaling = useSmartScaling(settings)
    const { dimensions, fontSize, spacing, elementSizes } = scaling

    const fontClass = FONT_INFO[settings.fontFamily].className
    const isCreatorCard = settings.format === 'creator-card'

    // Container ref for measuring available width
    const containerRef = useRef<HTMLDivElement>(null)
    const [containerWidth, setContainerWidth] = useState(0)

    // Measure container width on mount and resize
    useEffect(() => {
      const updateWidth = () => {
        if (containerRef.current) {
          setContainerWidth(containerRef.current.offsetWidth)
        }
      }

      updateWidth()
      window.addEventListener('resize', updateWidth)
      return () => window.removeEventListener('resize', updateWidth)
    }, [])

    // Background style
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

    // Calculate preview scale to fit container - responsive to actual container width
    const previewScale = useMemo(() => {
      // Use container width with padding buffer, fallback to reasonable defaults
      const availableWidth = containerWidth > 0 ? containerWidth - 16 : 350

      // Calculate scale to fit the canvas width into available space
      // Add a small buffer to prevent edge clipping
      const scale = Math.min(availableWidth / dimensions.width, 1)

      // For very wide containers (desktop), cap the scale to avoid huge previews
      const aspectRatio = dimensions.width / dimensions.height
      let maxScale: number
      if (aspectRatio > 1.5) {
        maxScale = 480 / dimensions.width // Landscape max
      } else if (aspectRatio < 0.7) {
        maxScale = 280 / dimensions.width // Portrait/Story max
      } else {
        maxScale = 400 / dimensions.width // Square max
      }

      return Math.min(scale, maxScale)
    }, [dimensions, containerWidth])

    // Max preview container height
    const previewContainerHeight = useMemo(() => {
      const scaledHeight = dimensions.height * previewScale
      return Math.min(scaledHeight + 20, 500)
    }, [dimensions.height, previewScale])

    // Apply highlight to text
    const applyHighlight = useCallback(
      (text: string): React.ReactNode => {
        if (!settings.highlightText || !text.includes(settings.highlightText)) {
          return text
        }

        const escapedHighlight = settings.highlightText.replace(
          /[.*+?^${}()|[\]\\]/g,
          '\\$&'
        )
        const parts = text.split(new RegExp(`(${escapedHighlight})`, 'gi'))

        return parts.map((part, i) =>
          part.toLowerCase() === settings.highlightText.toLowerCase() ? (
            <span key={i} style={{ color: settings.highlightColor }}>
              {part}
            </span>
          ) : (
            part
          )
        )
      },
      [settings.highlightText, settings.highlightColor]
    )

    // Format content based on format type
    const formattedContent = useMemo(() => {
      if (!settings.content) return null

      switch (settings.format) {
        case 'list-drop': {
          const lines = settings.content
            .split(/\n|(?=\d+[.\)]\s)/)
            .filter((line) => line.trim())
          return lines.map((line, i) => (
            <div
              key={i}
              className="flex items-start"
              style={{ gap: `${spacing.gap.small}px` }}
            >
              <span
                className="opacity-60 font-semibold shrink-0"
                style={{ minWidth: `${fontSize.main * 0.8}px` }}
              >
                {i + 1}.
              </span>
              <span>
                {applyHighlight(line.replace(/^\d+[.\)]\s*/, '').trim())}
              </span>
            </div>
          ))
        }
        case 'thread-starter':
          return (
            <div className="relative">
              <span
                className="absolute opacity-40"
                style={{
                  fontSize: `${fontSize.main * 0.75}px`,
                  left: `-${fontSize.main * 1.2}px`,
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
    }, [settings.content, settings.format, applyHighlight, fontSize, spacing])

    return (
      <div ref={containerRef} className="w-full flex flex-col items-center">
        {/* Platform indicator */}
        <div className="mb-3 text-xs text-muted-foreground text-center">
          <span className="font-medium">
            {PLATFORM_DIMENSIONS[settings.platform].name}
          </span>
          <span className="mx-2">•</span>
          <span>
            {dimensions.width} × {dimensions.height}
          </span>
        </div>

        {/* Preview container with responsive scaling */}
        <div
          className="relative flex justify-center items-center w-full"
          style={{
            maxHeight: `${previewContainerHeight}px`,
            minHeight:
              containerWidth > 0
                ? `${dimensions.height * previewScale}px`
                : '200px',
          }}
        >
          {/* Scaled wrapper - this applies the preview scale */}
          <div
            className="flex-shrink-0"
            style={{
              transform: `scale(${previewScale})`,
              transformOrigin: 'center center',
              width: `${dimensions.width}px`,
              height: `${dimensions.height}px`,
            }}
          >
            {/* Actual canvas at export dimensions - THIS IS WHAT GETS EXPORTED */}
            <div
              ref={ref}
              className="preview-canvas rounded-lg overflow-hidden"
              style={{
                background,
                width: `${dimensions.width}px`,
                height: `${dimensions.height}px`,
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              }}
            >
              {/* Content container with consistent padding */}
              <div
                className={`${fontClass} w-full h-full flex flex-col`}
                style={{
                  color: settings.textColor,
                  padding: `${spacing.padding.vertical}px ${spacing.padding.horizontal}px`,
                }}
              >
                {/* Header Section - Creator Card */}
                {isCreatorCard &&
                  (settings.creatorName || settings.creatorHandle) && (
                    <div
                      className="shrink-0"
                      style={{ marginBottom: `${spacing.gap.medium}px` }}
                    >
                      <div
                        className="flex items-center"
                        style={{ gap: `${spacing.gap.small}px` }}
                      >
                        {/* Avatar */}
                        {settings.creatorAvatar ? (
                          <img
                            src={settings.creatorAvatar}
                            alt={settings.creatorName}
                            className="rounded-full object-cover shrink-0"
                            style={{
                              width: `${elementSizes.avatar}px`,
                              height: `${elementSizes.avatar}px`,
                            }}
                            crossOrigin="anonymous"
                          />
                        ) : (
                          <div
                            className="rounded-full bg-gray-600 flex items-center justify-center text-white font-bold shrink-0"
                            style={{
                              width: `${elementSizes.avatar}px`,
                              height: `${elementSizes.avatar}px`,
                              fontSize: `${elementSizes.avatar * 0.45}px`,
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
                            style={{ gap: `${spacing.gap.small * 0.5}px` }}
                          >
                            <span
                              className="font-semibold"
                              style={{ fontSize: `${fontSize.name}px` }}
                            >
                              {settings.creatorName || 'Your Name'}
                            </span>
                            {settings.showVerifiedBadge && (
                              <VerifiedBadge size={elementSizes.badge} />
                            )}
                          </div>
                          <span
                            className="opacity-60"
                            style={{ fontSize: `${fontSize.handle}px` }}
                          >
                            {settings.creatorHandle
                              ? `@${settings.creatorHandle.replace('@', '')}`
                              : '@handle'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                {/* Main Content Section */}
                <div className="flex-1 flex flex-col justify-center min-h-0 overflow-hidden">
                  <div
                    className="font-bold leading-tight overflow-hidden"
                    style={{
                      fontSize: `${fontSize.main}px`,
                      lineHeight: 1.3,
                      letterSpacing: '-0.01em',
                      wordBreak: 'break-word',
                    }}
                  >
                    {formattedContent || (
                      <span className="opacity-40 italic font-normal">
                        Your content will appear here...
                      </span>
                    )}
                  </div>

                  {/* Subtitle */}
                  {settings.subtitle && (
                    <div
                      className="opacity-80 font-normal"
                      style={{
                        fontSize: `${fontSize.subtitle}px`,
                        lineHeight: 1.5,
                        marginTop: `${spacing.gap.medium}px`,
                      }}
                    >
                      {applyHighlight(settings.subtitle)}
                    </div>
                  )}
                </div>

                {/* Footer Section - CTA and Pointer */}
                {(settings.showCommentPointer || settings.showCtaButton) && (
                  <div
                    className="shrink-0"
                    style={{ marginTop: `${spacing.gap.medium}px` }}
                  >
                    {/* Comment Pointer */}
                    {settings.showCommentPointer &&
                      settings.commentPointerText && (
                        <div
                          className="opacity-70 font-medium"
                          style={{
                            fontSize: `${fontSize.pointer}px`,
                            marginBottom: settings.showCtaButton
                              ? `${spacing.gap.small}px`
                              : 0,
                          }}
                        >
                          {settings.commentPointerText}
                        </div>
                      )}

                    {/* CTA Button */}
                    {settings.showCtaButton && (
                      <div className="flex justify-center">
                        <div
                          className="rounded-full flex items-center justify-center"
                          style={{
                            backgroundColor: settings.highlightColor,
                            width: `${elementSizes.cta}px`,
                            height: `${elementSizes.cta}px`,
                          }}
                        >
                          <ArrowDown
                            className="text-black"
                            style={{
                              width: `${elementSizes.cta * 0.5}px`,
                              height: `${elementSizes.cta * 0.5}px`,
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Helpful hint */}
        <div className="mt-3 text-xs text-muted-foreground text-center opacity-70">
          Preview scales to fit • Export is full resolution
        </div>
      </div>
    )
  }
)
