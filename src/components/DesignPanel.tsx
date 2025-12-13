'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  FONT_INFO,
  GRADIENT_PRESETS,
  SOLID_COLORS,
  TEXT_COLORS,
  PLATFORM_DIMENSIONS,
  type FontFamily,
  type GradientPreset,
  type Platform,
  type PostSettings,
} from '@/lib/types'

interface DesignPanelProps {
  settings: PostSettings
  onSettingsChange: (settings: Partial<PostSettings>) => void
}

export function DesignPanel({ settings, onSettingsChange }: DesignPanelProps) {
  return (
    <div className="space-y-6">
      {/* Font Selection */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          Font Style
        </label>
        <Select
          value={settings.fontFamily}
          onValueChange={(value: FontFamily) =>
            onSettingsChange({ fontFamily: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select font" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(FONT_INFO).map(([key, info]) => (
              <SelectItem key={key} value={key}>
                <span className={info.className}>{info.name}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Platform Selection */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          Platform Size
        </label>
        <Select
          value={settings.platform}
          onValueChange={(value: Platform) =>
            onSettingsChange({ platform: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select platform" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(PLATFORM_DIMENSIONS).map(([key, info]) => (
              <SelectItem key={key} value={key}>
                <span className="flex items-center gap-2">
                  {info.name}
                  <span className="text-xs text-muted-foreground font-mono">
                    {info.width}×{info.height}
                  </span>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {/* Current platform info */}
        <p className="text-xs text-muted-foreground">
          {PLATFORM_DIMENSIONS[settings.platform].description}
        </p>
      </div>

      {/* Background Selection */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">
          Background
        </label>
        <Tabs
          value={settings.backgroundType}
          onValueChange={(value) =>
            onSettingsChange({ backgroundType: value as 'solid' | 'gradient' })
          }
        >
          <TabsList className="w-full">
            <TabsTrigger value="solid" className="flex-1">
              Solid
            </TabsTrigger>
            <TabsTrigger value="gradient" className="flex-1">
              Gradient
            </TabsTrigger>
          </TabsList>

          <TabsContent value="solid" className="mt-3">
            <div className="grid grid-cols-5 gap-2">
              {SOLID_COLORS.map((color) => (
                <button
                  key={color.value}
                  onClick={() =>
                    onSettingsChange({ backgroundColor: color.value })
                  }
                  className={`
                    aspect-square rounded-lg border-2 transition-all
                    ${
                      settings.backgroundColor === color.value
                        ? 'border-primary ring-2 ring-primary/30 scale-105'
                        : 'border-border hover:border-primary/50'
                    }
                  `}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="gradient" className="mt-3">
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(GRADIENT_PRESETS).map(([key, preset]) => (
                <button
                  key={key}
                  onClick={() =>
                    onSettingsChange({ gradientPreset: key as GradientPreset })
                  }
                  className={`
                    aspect-video rounded-lg border-2 transition-all
                    ${
                      settings.gradientPreset === key
                        ? 'border-primary ring-2 ring-primary/30 scale-105'
                        : 'border-border hover:border-primary/50'
                    }
                  `}
                  style={{ background: preset.css }}
                  title={preset.name}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Text Color */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">
          Text Color
        </label>
        <div className="grid grid-cols-6 gap-2">
          {TEXT_COLORS.map((color) => (
            <button
              key={color.value}
              onClick={() => onSettingsChange({ textColor: color.value })}
              className={`
                aspect-square rounded-lg border-2 transition-all
                ${
                  settings.textColor === color.value
                    ? 'border-primary ring-2 ring-primary/30 scale-105'
                    : 'border-border hover:border-primary/50'
                }
              `}
              style={{ backgroundColor: color.value }}
              title={color.name}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
