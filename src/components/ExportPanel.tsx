'use client'

import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Download, Loader2, Check, Info } from 'lucide-react'
import {
  PLATFORM_DIMENSIONS,
  type Platform,
  type PostSettings,
} from '@/lib/types'
import { toPng } from 'html-to-image'

interface ExportPanelProps {
  settings: PostSettings
  previewRef: React.RefObject<HTMLDivElement | null>
}

export function ExportPanel({ settings, previewRef }: ExportPanelProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [exportedPlatform, setExportedPlatform] = useState<Platform | null>(
    null
  )
  const [exportError, setExportError] = useState<string | null>(null)

  const handleExport = useCallback(
    async (platform: Platform) => {
      if (!previewRef.current) {
        setExportError('Preview not ready. Please try again.')
        return
      }

      setIsExporting(true)
      setExportedPlatform(null)
      setExportError(null)

      try {
        const element = previewRef.current
        const targetDimensions = PLATFORM_DIMENSIONS[platform]

        // The canvas is already rendered at exact platform dimensions
        // We export it at those dimensions with 2x pixel ratio for retina quality
        const dataUrl = await toPng(element, {
          width: targetDimensions.width,
          height: targetDimensions.height,
          pixelRatio: 2, // 2x for high-quality retina display
          quality: 1.0,
          cacheBust: true, // Prevent caching issues with images
          skipFonts: false, // Include fonts
          style: {
            // Ensure no transforms affect the export
            transform: 'none',
            borderRadius: '0', // Remove border radius for clean export
          },
        })

        // Generate descriptive filename
        const timestamp = new Date().toISOString().slice(0, 10)
        const platformName = platform.replace('-', '_')
        const formatName = settings.format.replace('-', '_')
        const filename = `socialcard_${platformName}_${targetDimensions.width}x${targetDimensions.height}_${formatName}_${timestamp}.png`

        // Create and trigger download
        const link = document.createElement('a')
        link.download = filename
        link.href = dataUrl
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        setExportedPlatform(platform)

        // Clear success state after 3 seconds
        setTimeout(() => setExportedPlatform(null), 3000)
      } catch (error) {
        console.error('Export failed:', error)
        setExportError('Export failed. Please try again.')

        // Clear error after 5 seconds
        setTimeout(() => setExportError(null), 5000)
      } finally {
        setIsExporting(false)
      }
    },
    [previewRef, settings.format]
  )

  const currentPlatform = settings.platform
  const currentDimensions = PLATFORM_DIMENSIONS[currentPlatform]

  // Platform order - most common first
  const platformOrder: Platform[] = [
    'facebook',
    'linkedin',
    'twitter',
    'instagram',
    'instagram-story',
  ]
  const otherPlatforms = platformOrder.filter((p) => p !== currentPlatform)

  const canExport = settings.content.trim().length > 0

  return (
    <div className="space-y-5">
      {/* Current platform info */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-foreground">Export Image</h3>
          <Badge variant="outline" className="text-xs font-mono">
            {currentDimensions.width} × {currentDimensions.height}
          </Badge>
        </div>

        {/* Platform description */}
        <p className="text-xs text-muted-foreground">
          {currentDimensions.description}
        </p>
      </div>

      {/* Quality indicator - compact */}
      <div className="flex items-center gap-2 p-2.5 bg-primary/5 rounded-lg text-xs text-muted-foreground">
        <Info className="h-3.5 w-3.5 shrink-0 text-primary" />
        <span>
          <span className="font-medium text-foreground">2× retina quality</span>
          {' · '}
          {currentDimensions.width * 2}×{currentDimensions.height * 2}px
        </span>
      </div>

      {/* Error message */}
      {exportError && (
        <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-xs text-destructive">
          {exportError}
        </div>
      )}

      {/* Primary export button */}
      <Button
        onClick={() => handleExport(currentPlatform)}
        disabled={isExporting || !canExport}
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

      {/* Other platform sizes */}
      <div className="space-y-3">
        <p className="text-xs text-muted-foreground font-medium">
          Quick export for other platforms:
        </p>
        <div className="grid grid-cols-2 gap-2">
          {otherPlatforms.map((platformKey) => {
            const platformInfo = PLATFORM_DIMENSIONS[platformKey]
            const isExported = exportedPlatform === platformKey

            // Shorten platform names for cleaner display
            const shortName = platformInfo.name
              .replace(' Post', '')
              .replace(' Square', '')
              .replace('Story/Reels', 'Story')

            return (
              <Button
                key={platformKey}
                variant="outline"
                size="sm"
                onClick={() => handleExport(platformKey)}
                disabled={isExporting || !canExport}
                className="h-9 px-3 text-xs justify-between gap-1"
              >
                <span className="flex items-center gap-1.5 truncate">
                  {isExported ? (
                    <Check className="h-3.5 w-3.5 text-green-500 shrink-0" />
                  ) : (
                    <Download className="h-3.5 w-3.5 shrink-0" />
                  )}
                  <span className="font-medium truncate">{shortName}</span>
                </span>
                <span className="text-[10px] text-muted-foreground shrink-0">
                  {platformInfo.width}×{platformInfo.height}
                </span>
              </Button>
            )
          })}
        </div>
      </div>

      {/* No content warning */}
      {!canExport && (
        <p className="text-xs text-muted-foreground text-center py-2 italic">
          Add content to enable export
        </p>
      )}
    </div>
  )
}
