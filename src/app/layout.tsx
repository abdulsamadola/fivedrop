import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { DM_Sans, Sora, Playfair_Display, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "FiveDrop — Content to Image Generator for Social Media",
  description:
    "Create stunning, high-engagement images for Facebook, LinkedIn, X, and Instagram in seconds. Paste your hook, choose a format, and download instantly.",
  keywords: [
    "social media image generator",
    "content to image",
    "facebook post generator",
    "linkedin post image",
    "twitter image creator",
    "instagram post maker",
    "engagement posts",
    "hook generator",
    "content creator tools",
  ],
  authors: [{ name: "FiveDrop" }],
  creator: "FiveDrop",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://fivedrop.app",
    siteName: "FiveDrop",
    title: "FiveDrop — Content to Image Generator for Social Media",
    description:
      "Create stunning, high-engagement images for Facebook, LinkedIn, X, and Instagram in seconds. Paste your hook, choose a format, and download instantly.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "FiveDrop - Content to Image Generator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FiveDrop — Content to Image Generator for Social Media",
    description:
      "Create stunning, high-engagement images for Facebook, LinkedIn, X, and Instagram in seconds.",
    images: ["/og-image.png"],
    creator: "@fivedrop",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${dmSans.variable} ${sora.variable} ${playfair.variable} ${jetbrains.variable} antialiased min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
