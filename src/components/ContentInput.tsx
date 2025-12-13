"use client";

import { Textarea } from "@/components/ui/textarea";
import { Toggle } from "@/components/ui/toggle";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { MessageSquare, Smile } from "lucide-react";
import type { PostSettings } from "@/lib/types";

interface ContentInputProps {
  settings: PostSettings;
  onSettingsChange: (settings: Partial<PostSettings>) => void;
}

const EMOJI_GROUPS = {
  "Attention": ["👇", "⬇️", "🔥", "⚠️", "🚨", "💡", "✨", "⭐"],
  "Actions": ["👉", "➡️", "📌", "🎯", "💪", "🙌", "👏", "🤝"],
  "Emotions": ["🤔", "😮", "🤯", "😱", "💭", "❤️", "💯", "🔑"],
  "Objects": ["📈", "📉", "💰", "🎁", "📚", "🧵", "📋", "✅"],
};

export function ContentInput({ settings, onSettingsChange }: ContentInputProps) {
  const characterCount = settings.content.length;
  const maxChars = 500;
  const isNearLimit = characterCount > maxChars * 0.8;
  const isOverLimit = characterCount > maxChars;

  const insertEmoji = (emoji: string) => {
    onSettingsChange({ content: settings.content + emoji });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-foreground">
            Your Hook / Content
          </label>
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Smile className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-72 p-3" align="end">
                <div className="space-y-3">
                  {Object.entries(EMOJI_GROUPS).map(([group, emojis]) => (
                    <div key={group}>
                      <p className="text-xs font-medium text-muted-foreground mb-1.5">
                        {group}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {emojis.map((emoji) => (
                          <button
                            key={emoji}
                            onClick={() => insertEmoji(emoji)}
                            className="text-lg hover:bg-secondary p-1.5 rounded-md transition-colors"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
            <Badge
              variant={isOverLimit ? "destructive" : isNearLimit ? "secondary" : "outline"}
              className="text-xs"
            >
              {characterCount}/{maxChars}
            </Badge>
          </div>
        </div>
        <Textarea
          placeholder="Type or paste your hook here...

Example: Most people think they need more time. They don't. They need more focus."
          value={settings.content}
          onChange={(e) => onSettingsChange({ content: e.target.value })}
          className="min-h-[140px] resize-none text-base leading-relaxed"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          Subtitle <span className="text-muted-foreground font-normal">(optional)</span>
        </label>
        <Textarea
          placeholder="Add context or a secondary line..."
          value={settings.subtitle}
          onChange={(e) => onSettingsChange({ subtitle: e.target.value })}
          className="min-h-[60px] resize-none text-sm"
        />
      </div>

      <div className="flex items-center justify-between py-3 px-4 bg-secondary/50 rounded-lg">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">This post continues in comments</span>
        </div>
        <Toggle
          pressed={settings.showCommentPointer}
          onPressedChange={(pressed) =>
            onSettingsChange({ showCommentPointer: pressed })
          }
          aria-label="Toggle comment pointer"
          className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
        >
          {settings.showCommentPointer ? "On" : "Off"}
        </Toggle>
      </div>

      {settings.showCommentPointer && (
        <div className="space-y-2 pl-4 border-l-2 border-primary/30">
          <label className="text-sm font-medium text-foreground">
            Comment Pointer Text
          </label>
          <Textarea
            placeholder="👇 Read more in comments"
            value={settings.commentPointerText}
            onChange={(e) => onSettingsChange({ commentPointerText: e.target.value })}
            className="min-h-[50px] resize-none text-sm"
          />
        </div>
      )}
    </div>
  );
}

