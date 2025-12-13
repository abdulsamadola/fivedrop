"use client";

import Link from "next/link";
import { Droplets } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Droplets className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-semibold text-lg tracking-tight">FiveDrop</span>
        </Link>
        
        <nav className="flex items-center gap-4">
          <Link
            href="/create"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Create
          </Link>
          <a
            href="https://github.com/fivedrop"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            GitHub
          </a>
        </nav>
      </div>
    </header>
  );
}

