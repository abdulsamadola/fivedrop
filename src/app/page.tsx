import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Zap,
  Download,
  Palette,
  Smartphone,
  Clock,
  Sparkles,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
          </div>

          <div className="container mx-auto px-4 py-20 md:py-32">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
                <Sparkles className="w-4 h-4" />
                <span>Content to image in 5 seconds</span>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text">
                Turn your hooks into
                <span className="block text-primary">scroll-stopping images</span>
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
                FiveDrop helps content creators transform text into beautiful,
                engagement-optimized images for Facebook, LinkedIn, X, and Instagram.
                No design skills needed.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="text-base h-12 px-8">
                  <Link href="/create">
                    Start Creating
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="text-base h-12 px-8"
                >
                  <a href="#features">See Features</a>
                </Button>
              </div>
            </div>
          </div>

          {/* Preview mockup */}
          <div className="container mx-auto px-4 pb-20">
            <div className="max-w-4xl mx-auto">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-border/50 bg-card">
                <div className="absolute top-0 left-0 right-0 h-10 bg-secondary/50 flex items-center px-4 gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="pt-10 p-6">
                  <div className="aspect-video rounded-xl overflow-hidden" style={{
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                  }}>
                    <div className="w-full h-full flex flex-col justify-center p-8 md:p-12">
                      <p className="text-white text-xl md:text-3xl lg:text-4xl font-semibold leading-tight font-dm-sans">
                        Most people think they need more time.
                        <br />
                        <span className="opacity-90">They don&apos;t.</span>
                        <br />
                        <span className="opacity-90">They need more focus.</span>
                      </p>
                      <p className="text-white/70 mt-6 text-sm md:text-base">
                        👇 Read the full breakdown in comments
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Everything you need, nothing you don&apos;t
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Built for speed. Designed for engagement. Made for creators who
                value their time.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <FeatureCard
                icon={<Zap className="w-6 h-6" />}
                title="Lightning Fast"
                description="Paste your content, pick a style, download. Done in under 5 seconds."
              />
              <FeatureCard
                icon={<Palette className="w-6 h-6" />}
                title="Pro Designs"
                description="Clean typography, balanced layouts, and colors that pop. No design degree required."
              />
              <FeatureCard
                icon={<Smartphone className="w-6 h-6" />}
                title="All Platforms"
                description="Optimized sizes for Facebook, LinkedIn, X, and Instagram. One click export."
              />
              <FeatureCard
                icon={<Download className="w-6 h-6" />}
                title="Instant Download"
                description="High-quality PNG files ready to post. No watermarks, no catches."
              />
              <FeatureCard
                icon={<Clock className="w-6 h-6" />}
                title="No Sign-up"
                description="Start creating immediately. No accounts, no friction, no data collection."
              />
              <FeatureCard
                icon={<Sparkles className="w-6 h-6" />}
                title="Smart Formatting"
                description="Auto-adjusts font size, line spacing, and layout based on your content."
              />
            </div>
          </div>
        </section>

        {/* Format Examples */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Formats that drive engagement
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Choose from proven formats designed to stop the scroll and spark
                conversations.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <FormatCard
                emoji="⚡"
                title="Hook Only"
                description="Single powerful statement that demands attention"
              />
              <FormatCard
                emoji="👇"
                title="Hook → Comments"
                description="Tease the full story and drive people to comments"
              />
              <FormatCard
                emoji="🧵"
                title="Thread Starter"
                description="Perfect opener for longer narrative posts"
              />
              <FormatCard
                emoji="💭"
                title="Long Thought"
                description="Extended reflections with balanced typography"
              />
              <FormatCard
                emoji="📋"
                title="List Drop"
                description="Numbered points for maximum scanability"
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary/5">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to create?
              </h2>
              <p className="text-muted-foreground text-lg mb-8">
                Stop wasting time in complex editors. Start creating
                scroll-stopping content now.
              </p>
              <Button asChild size="lg" className="text-base h-12 px-8">
                <Link href="/create">
                  Create Your First Image
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="p-6 rounded-xl bg-card border border-border/50 hover:border-primary/30 transition-colors">
      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
        {icon}
      </div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">
        {description}
      </p>
    </div>
  );
}

function FormatCard({
  emoji,
  title,
  description,
}: {
  emoji: string;
  title: string;
  description: string;
}) {
  return (
    <div className="p-6 rounded-xl bg-card border border-border/50 hover:border-primary/30 transition-colors group">
      <span className="text-3xl mb-4 block group-hover:scale-110 transition-transform">
        {emoji}
      </span>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">
        {description}
      </p>
    </div>
  );
}
