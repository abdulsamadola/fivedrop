"use client";

import { FORMAT_INFO, type PostFormat, type PostSettings } from "@/lib/types";

interface FormatSelectorProps {
  settings: PostSettings;
  onSettingsChange: (settings: Partial<PostSettings>) => void;
}

export function FormatSelector({ settings, onSettingsChange }: FormatSelectorProps) {
  const formats = Object.entries(FORMAT_INFO) as [PostFormat, typeof FORMAT_INFO[PostFormat]][];

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-foreground">Post Format</label>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
        {formats.map(([key, info]) => (
          <button
            key={key}
            onClick={() => onSettingsChange({ format: key })}
            className={`
              flex items-center gap-3 p-3 rounded-lg text-left transition-all
              ${
                settings.format === key
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-secondary/50 hover:bg-secondary text-foreground"
              }
            `}
          >
            <span className="text-xl flex-shrink-0">{info.icon}</span>
            <div className="min-w-0">
              <p className="font-medium text-sm">{info.name}</p>
              <p
                className={`text-xs truncate ${
                  settings.format === key
                    ? "text-primary-foreground/80"
                    : "text-muted-foreground"
                }`}
              >
                {info.description}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

