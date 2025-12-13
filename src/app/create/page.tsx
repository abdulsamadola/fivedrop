"use client";

import { useState, useRef } from "react";
import { Header } from "@/components/Header";
import { ContentInput } from "@/components/ContentInput";
import { FormatSelector } from "@/components/FormatSelector";
import { DesignPanel } from "@/components/DesignPanel";
import { PreviewCanvas } from "@/components/PreviewCanvas";
import { ExportPanel } from "@/components/ExportPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { DEFAULT_SETTINGS, type PostSettings } from "@/lib/types";
import { PenLine, Palette, ImageDown, LayoutTemplate } from "lucide-react";

export default function CreatePage() {
  const [settings, setSettings] = useState<PostSettings>(DEFAULT_SETTINGS);
  const previewRef = useRef<HTMLDivElement>(null);

  const updateSettings = (newSettings: Partial<PostSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="max-w-7xl mx-auto">
          {/* Mobile Layout */}
          <div className="lg:hidden space-y-4">
            {/* Preview at top on mobile - compact */}
            <div className="bg-card rounded-xl border border-border/50 p-4">
              <PreviewCanvas ref={previewRef} settings={settings} />
            </div>

            {/* Tabs for controls - 4 tabs with Format first */}
            <Tabs defaultValue="format" className="w-full">
              <TabsList className="w-full grid grid-cols-4 h-12">
                <TabsTrigger value="format" className="gap-1.5 text-xs px-2">
                  <LayoutTemplate className="w-4 h-4" />
                  <span className="hidden xs:inline">Format</span>
                </TabsTrigger>
                <TabsTrigger value="content" className="gap-1.5 text-xs px-2">
                  <PenLine className="w-4 h-4" />
                  <span className="hidden xs:inline">Content</span>
                </TabsTrigger>
                <TabsTrigger value="design" className="gap-1.5 text-xs px-2">
                  <Palette className="w-4 h-4" />
                  <span className="hidden xs:inline">Design</span>
                </TabsTrigger>
                <TabsTrigger value="export" className="gap-1.5 text-xs px-2">
                  <ImageDown className="w-4 h-4" />
                  <span className="hidden xs:inline">Export</span>
                </TabsTrigger>
              </TabsList>

              {/* Format Tab - First and prominent */}
              <TabsContent value="format" className="mt-4">
                <div className="bg-card rounded-xl border border-border/50 p-4">
                  <h2 className="text-base font-semibold mb-3 flex items-center gap-2">
                    <LayoutTemplate className="w-4 h-4 text-primary" />
                    Choose Post Format
                  </h2>
                  <FormatSelector
                    settings={settings}
                    onSettingsChange={updateSettings}
                  />
                </div>
              </TabsContent>

              <TabsContent value="content" className="mt-4">
                <div className="bg-card rounded-xl border border-border/50 p-4">
                  <ContentInput
                    settings={settings}
                    onSettingsChange={updateSettings}
                  />
                </div>
              </TabsContent>

              <TabsContent value="design" className="mt-4">
                <div className="bg-card rounded-xl border border-border/50 p-4">
                  <DesignPanel
                    settings={settings}
                    onSettingsChange={updateSettings}
                  />
                </div>
              </TabsContent>

              <TabsContent value="export" className="mt-4">
                <div className="bg-card rounded-xl border border-border/50 p-4">
                  <ExportPanel settings={settings} previewRef={previewRef} />
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Desktop Layout */}
          <div className="hidden lg:grid lg:grid-cols-12 gap-8">
            {/* Left Panel - Controls */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-card rounded-xl border border-border/50 p-6 space-y-6">
                {/* Format Selector at top */}
                <div>
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <LayoutTemplate className="w-5 h-5 text-primary" />
                    Post Format
                  </h2>
                  <FormatSelector
                    settings={settings}
                    onSettingsChange={updateSettings}
                  />
                </div>

                <Separator />

                <div>
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <PenLine className="w-5 h-5 text-primary" />
                    Content
                  </h2>
                  <ContentInput
                    settings={settings}
                    onSettingsChange={updateSettings}
                  />
                </div>
              </div>
            </div>

            {/* Center - Preview */}
            <div className="lg:col-span-5">
              <div className="sticky top-20">
                <div className="bg-card rounded-xl border border-border/50 p-6">
                  <h2 className="text-lg font-semibold mb-4">Preview</h2>
                  <PreviewCanvas ref={previewRef} settings={settings} />
                </div>
              </div>
            </div>

            {/* Right Panel - Design & Export */}
            <div className="lg:col-span-3 space-y-6">
              <div className="bg-card rounded-xl border border-border/50 p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Palette className="w-5 h-5 text-primary" />
                  Design
                </h2>
                <DesignPanel
                  settings={settings}
                  onSettingsChange={updateSettings}
                />
              </div>

              <div className="bg-card rounded-xl border border-border/50 p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <ImageDown className="w-5 h-5 text-primary" />
                  Export
                </h2>
                <ExportPanel settings={settings} previewRef={previewRef} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
