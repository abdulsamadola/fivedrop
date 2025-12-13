"use client";

import { useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Toggle } from "@/components/ui/toggle";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { MessageSquare, Smile, User, ArrowDown, Upload, Link, X, BadgeCheck } from "lucide-react";
import { CTA_SIZES, type PostSettings, type CtaSize } from "@/lib/types";

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

const HIGHLIGHT_COLOR_OPTIONS = [
  { name: "Yellow", value: "#FACC15" },
  { name: "Cyan", value: "#22D3EE" },
  { name: "Green", value: "#4ADE80" },
  { name: "Pink", value: "#F472B6" },
  { name: "Orange", value: "#FB923C" },
  { name: "Blue", value: "#60A5FA" },
];

export function ContentInput({ settings, onSettingsChange }: ContentInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const characterCount = settings.content.length;
  const maxChars = 500;
  const isNearLimit = characterCount > maxChars * 0.8;
  const isOverLimit = characterCount > maxChars;
  const isCreatorCard = settings.format === "creator-card";

  const insertEmoji = (emoji: string) => {
    onSettingsChange({ content: settings.content + emoji });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        onSettingsChange({ creatorAvatar: dataUrl });
      };
      reader.readAsDataURL(file);
    }
  };

  const clearAvatar = () => {
    onSettingsChange({ creatorAvatar: "" });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-4">
      {/* Creator Card Profile Section */}
      {isCreatorCard && (
        <div className="space-y-3 p-4 bg-secondary/50 rounded-lg">
          <div className="flex items-center gap-2 text-sm font-medium">
            <User className="h-4 w-4" />
            Profile Header
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground">Display Name</label>
              <input
                type="text"
                placeholder="Your Name"
                value={settings.creatorName}
                onChange={(e) => onSettingsChange({ creatorName: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-md border border-input bg-background"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground">Handle</label>
              <input
                type="text"
                placeholder="username"
                value={settings.creatorHandle}
                onChange={(e) => onSettingsChange({ creatorHandle: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-md border border-input bg-background"
              />
            </div>
          </div>

          {/* Avatar Section */}
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground">Profile Picture</label>
            
            {settings.creatorAvatar ? (
              <div className="flex items-center gap-3">
                <img
                  src={settings.creatorAvatar}
                  alt="Avatar preview"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAvatar}
                  className="text-destructive hover:text-destructive"
                >
                  <X className="h-4 w-4 mr-1" />
                  Remove
                </Button>
              </div>
            ) : (
              <div className="flex gap-2">
                {/* Upload Button */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </Button>
                
                {/* URL Input */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Link className="h-4 w-4 mr-2" />
                      URL
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-72 p-3" align="start">
                    <div className="space-y-2">
                      <label className="text-xs font-medium">Image URL</label>
                      <input
                        type="text"
                        placeholder="https://example.com/avatar.jpg"
                        value={settings.creatorAvatar}
                        onChange={(e) => onSettingsChange({ creatorAvatar: e.target.value })}
                        className="w-full px-3 py-2 text-sm rounded-md border border-input bg-background"
                      />
                      <p className="text-xs text-muted-foreground">
                        Paste the URL of your profile picture
                      </p>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <BadgeCheck className="h-4 w-4 fill-[#1D9BF0] text-white" />
              <span className="text-sm">Verified Badge</span>
            </div>
            <Toggle
              pressed={settings.showVerifiedBadge}
              onPressedChange={(pressed) =>
                onSettingsChange({ showVerifiedBadge: pressed })
              }
              aria-label="Toggle verified badge"
              size="sm"
              className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
            >
              {settings.showVerifiedBadge ? "On" : "Off"}
            </Toggle>
          </div>
        </div>
      )}

      {/* Main Content */}
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
          className="min-h-[120px] resize-none text-base leading-relaxed"
        />
      </div>

      {/* Highlight Text */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          Highlight Text <span className="text-muted-foreground font-normal">(color a word/phrase)</span>
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="e.g. Plots of Land"
            value={settings.highlightText}
            onChange={(e) => onSettingsChange({ highlightText: e.target.value })}
            className="flex-1 px-3 py-2 text-sm rounded-md border border-input bg-background"
          />
          <Popover>
            <PopoverTrigger asChild>
              <button
                className="w-10 h-10 rounded-md border border-input flex-shrink-0"
                style={{ backgroundColor: settings.highlightColor }}
              />
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2" align="end">
              <div className="flex gap-1">
                {HIGHLIGHT_COLOR_OPTIONS.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => onSettingsChange({ highlightColor: color.value })}
                    className={`w-8 h-8 rounded-md border-2 transition-all ${
                      settings.highlightColor === color.value
                        ? "border-foreground scale-110"
                        : "border-transparent"
                    }`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Subtitle */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          Subtitle <span className="text-muted-foreground font-normal">(optional)</span>
        </label>
        <Textarea
          placeholder="Add context or a secondary line..."
          value={settings.subtitle}
          onChange={(e) => onSettingsChange({ subtitle: e.target.value })}
          className="min-h-[50px] resize-none text-sm"
        />
      </div>

      {/* CTA Button */}
      <div className="space-y-2 p-3 bg-secondary/50 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ArrowDown className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">CTA Arrow Button</span>
          </div>
          <Toggle
            pressed={settings.showCtaButton}
            onPressedChange={(pressed) =>
              onSettingsChange({ showCtaButton: pressed })
            }
            aria-label="Toggle CTA button"
            className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
          >
            {settings.showCtaButton ? "On" : "Off"}
          </Toggle>
        </div>
        
        {settings.showCtaButton && (
          <div className="flex items-center gap-2 pt-2">
            <span className="text-xs text-muted-foreground">Size:</span>
            <div className="flex gap-1">
              {(Object.keys(CTA_SIZES) as CtaSize[]).map((size) => (
                <button
                  key={size}
                  onClick={() => onSettingsChange({ ctaSize: size })}
                  className={`px-3 py-1 text-xs rounded-md transition-all ${
                    settings.ctaSize === size
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary hover:bg-secondary/80"
                  }`}
                >
                  {CTA_SIZES[size].name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Comment Pointer */}
      <div className="flex items-center justify-between py-3 px-4 bg-secondary/50 rounded-lg">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">Post continues in comments</span>
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
