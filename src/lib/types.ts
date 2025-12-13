export type PostFormat =
    | "hook-only"
    | "hook-comments"
    | "thread-starter"
    | "long-thought"
    | "list-drop"
    | "creator-card";

export type FontFamily =
    | "dm-sans"
    | "sora"
    | "playfair"
    | "instrument"
    | "jetbrains";

export type BackgroundType = "solid" | "gradient";

export type GradientPreset =
    | "sunset"
    | "ocean"
    | "forest"
    | "midnight"
    | "coral"
    | "slate";

export type Platform = "facebook" | "linkedin" | "twitter" | "instagram" | "instagram-story";

export type CtaSize = "sm" | "md" | "lg";

export interface PlatformDimensions {
    width: number;
    height: number;
    name: string;
    aspectRatio: string;
    description: string;
}

// Official social media image sizes (2024/2025 standards)
// Sources: Buffer, Hootsuite, Sprout Social, HubSpot
export const PLATFORM_DIMENSIONS: Record<Platform, PlatformDimensions> = {
    facebook: {
        width: 1200,
        height: 630,
        name: "Facebook Post",
        aspectRatio: "1.91:1",
        description: "Optimized for Facebook feed posts and link shares",
    },
    linkedin: {
        width: 1200,
        height: 627,
        name: "LinkedIn Post",
        aspectRatio: "1.91:1",
        description: "Optimized for LinkedIn feed and article shares",
    },
    twitter: {
        width: 1200,
        height: 675,
        name: "X (Twitter)",
        aspectRatio: "16:9",
        description: "Optimized for X/Twitter timeline posts",
    },
    instagram: {
        width: 1080,
        height: 1080,
        name: "Instagram Square",
        aspectRatio: "1:1",
        description: "Classic square format for Instagram feed",
    },
    "instagram-story": {
        width: 1080,
        height: 1920,
        name: "Story/Reels",
        aspectRatio: "9:16",
        description: "Full-screen vertical for Stories and Reels",
    },
};

export interface PostSettings {
    content: string;
    subtitle: string;
    format: PostFormat;
    showCommentPointer: boolean;
    commentPointerText: string;
    fontFamily: FontFamily;
    backgroundType: BackgroundType;
    backgroundColor: string;
    gradientPreset: GradientPreset;
    textColor: string;
    platform: Platform;
    // Creator Card specific
    creatorName: string;
    creatorHandle: string;
    creatorAvatar: string;
    showVerifiedBadge: boolean;
    showCtaButton: boolean;
    ctaSize: CtaSize;
    highlightText: string;
    highlightColor: string;
}

export const DEFAULT_SETTINGS: PostSettings = {
    content: "",
    subtitle: "",
    format: "creator-card",
    showCommentPointer: false,
    commentPointerText: "👇 Read the full breakdown in comments",
    fontFamily: "dm-sans",
    backgroundType: "solid",
    backgroundColor: "#000000",
    gradientPreset: "ocean",
    textColor: "#ffffff",
    platform: "facebook", // Facebook post size (1200x630) as default
    // Creator Card defaults
    creatorName: "",
    creatorHandle: "",
    creatorAvatar: "",
    showVerifiedBadge: true,
    showCtaButton: false,
    ctaSize: "md",
    highlightText: "",
    highlightColor: "#FACC15",
};

export const FORMAT_INFO: Record<
    PostFormat,
    { name: string; description: string; icon: string }
> = {
    "creator-card": {
        name: "Creator Card",
        description: "Profile header + hook",
        icon: "👤",
    },
    "hook-only": {
        name: "Hook Only",
        description: "Single powerful statement",
        icon: "⚡",
    },
    "hook-comments": {
        name: "Hook → Comments",
        description: "Hook with comment pointer",
        icon: "👇",
    },
    "thread-starter": {
        name: "Thread Starter",
        description: "Beginning of a story",
        icon: "🧵",
    },
    "long-thought": {
        name: "Long Thought",
        description: "Extended reflection",
        icon: "💭",
    },
    "list-drop": {
        name: "List Drop",
        description: "Numbered points",
        icon: "📋",
    },
};

export const FONT_INFO: Record<FontFamily, { name: string; className: string }> =
{
    "dm-sans": { name: "DM Sans", className: "font-dm-sans" },
    sora: { name: "Sora", className: "font-sora" },
    playfair: { name: "Playfair", className: "font-playfair" },
    instrument: { name: "Instrument", className: "font-instrument" },
    jetbrains: { name: "JetBrains", className: "font-jetbrains" },
};

export const GRADIENT_PRESETS: Record<
    GradientPreset,
    { name: string; colors: string[]; css: string }
> = {
    sunset: {
        name: "Sunset",
        colors: ["#ff6b6b", "#feca57"],
        css: "linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)",
    },
    ocean: {
        name: "Ocean",
        colors: ["#667eea", "#764ba2"],
        css: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    },
    forest: {
        name: "Forest",
        colors: ["#11998e", "#38ef7d"],
        css: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
    },
    midnight: {
        name: "Midnight",
        colors: ["#232526", "#414345"],
        css: "linear-gradient(135deg, #232526 0%, #414345 100%)",
    },
    coral: {
        name: "Coral",
        colors: ["#ff9a9e", "#fecfef"],
        css: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
    },
    slate: {
        name: "Slate",
        colors: ["#536976", "#292E49"],
        css: "linear-gradient(135deg, #536976 0%, #292E49 100%)",
    },
};

export const SOLID_COLORS = [
    { name: "Pure Black", value: "#000000" },
    { name: "Charcoal", value: "#1a1a2e" },
    { name: "Navy", value: "#16213e" },
    { name: "Deep Purple", value: "#2d1b4e" },
    { name: "Forest", value: "#1b3a2f" },
    { name: "Burgundy", value: "#4a1c2c" },
    { name: "Slate", value: "#2c3e50" },
    { name: "Soft White", value: "#f8f9fa" },
    { name: "Cream", value: "#fef9e7" },
    { name: "Light Blue", value: "#e8f4f8" },
];

export const TEXT_COLORS = [
    { name: "White", value: "#ffffff" },
    { name: "Light Gray", value: "#e0e0e0" },
    { name: "Warm White", value: "#f5f5dc" },
    { name: "Black", value: "#000000" },
    { name: "Dark Gray", value: "#333333" },
    { name: "Navy", value: "#1a1a2e" },
];

export const HIGHLIGHT_COLORS = [
    { name: "Yellow", value: "#FACC15" },
    { name: "Cyan", value: "#22D3EE" },
    { name: "Green", value: "#4ADE80" },
    { name: "Pink", value: "#F472B6" },
    { name: "Orange", value: "#FB923C" },
    { name: "Blue", value: "#60A5FA" },
];

export const CTA_SIZES: Record<CtaSize, { name: string; multiplier: number }> = {
    sm: { name: "Small", multiplier: 0.8 },
    md: { name: "Medium", multiplier: 1.1 },
    lg: { name: "Large", multiplier: 1.4 },
};
