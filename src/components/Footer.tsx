import { Droplets } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-secondary/30">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
              <Droplets className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-sm">FiveDrop</span>
          </div>
          
          <p className="text-sm text-muted-foreground text-center">
            Create stunning social media images in seconds.
          </p>
          
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} FiveDrop. Open source.
          </p>
        </div>
      </div>
    </footer>
  );
}

