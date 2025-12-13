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
import { PenLine, Palette, ImageDown } from "lucide-react";

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
          <div className="lg:hidden space-y-6">
            {/* Preview at top on mobile */}
            <div className="sticky top-16 z-10 bg-background py-4 -mx-4 px-4 border-b border-border/50">
              <PreviewCanvas ref={previewRef} settings={settings} />
            </div>

            {/* Tabs for controls */}
            <Tabs defaultValue="content" className="w-full">
              <TabsList className="w-full grid grid-cols-3">
                <TabsTrigger value="content" className="gap-2">
                  <PenLine className="w-4 h-4" />
                  <span className="hidden sm:inline">Content</span>
                </TabsTrigger>
                <TabsTrigger value="design" className="gap-2">
                  <Palette className="w-4 h-4" />
                  <span className="hidden sm:inline">Design</span>
                </TabsTrigger>
                <TabsTrigger value="export" className="gap-2">
                  <ImageDown className="w-4 h-4" />
                  <span className="hidden sm:inline">Export</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="content" className="mt-6 space-y-6">
                <ContentInput
                  settings={settings}
                  onSettingsChange={updateSettings}
                />
                <Separator />
                <FormatSelector
                  settings={settings}
                  onSettingsChange={updateSettings}
                />
              </TabsContent>

              <TabsContent value="design" className="mt-6">
                <DesignPanel
                  settings={settings}
                  onSettingsChange={updateSettings}
                />
              </TabsContent>

              <TabsContent value="export" className="mt-6">
                <ExportPanel settings={settings} previewRef={previewRef} />
              </TabsContent>
            </Tabs>
          </div>

          {/* Desktop Layout */}
          <div className="hidden lg:grid lg:grid-cols-12 gap-8">
            {/* Left Panel - Controls */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-card rounded-xl border border-border/50 p-6 space-y-6">
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

                <Separator />

                <FormatSelector
                  settings={settings}
                  onSettingsChange={updateSettings}
                />
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

