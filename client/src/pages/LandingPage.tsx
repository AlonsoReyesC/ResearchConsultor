import React from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Shield, BookOpen, Brain, Sparkles, Lock } from "lucide-react";
import academicBg from "@assets/generated_images/minimalist_academic_abstract_background_with_connected_nodes.png";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* Navigation */}
      <nav className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-primary" />
            <span className="text-xl font-serif font-bold tracking-tight">Methodolog.AI</span>
          </div>
          <div className="flex gap-4 items-center">
            <Link href="/login" className="text-sm font-medium hover:text-primary transition-colors">Log in</Link>
            <Link href="/app/dashboard">
              <Button>Try Consultant Demo <ArrowRight className="ml-2 h-4 w-4" /></Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 -z-10 opacity-20">
          <img src={academicBg} alt="Background" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background"></div>
        </div>
        
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Sparkles className="mr-2 h-3.5 w-3.5" />
            <span>Ethical AI for Academia</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-serif font-bold tracking-tight text-foreground mb-6 animate-in fade-in slide-in-from-bottom-5 duration-700 delay-100">
            Your Research Consultant, <br />
            <span className="text-primary italic">Not Your Ghostwriter.</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
            Rigorous methodological guidance for researchers, thesis students, and faculty. 
            We diagnose risks, refine objectives, and suggest improvements—without writing the project for you.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-7 duration-700 delay-300">
            <Link href="/app/dashboard">
              <Button size="lg" className="h-12 px-8 text-base">Start Project Diagnosis</Button>
            </Link>
            <Button variant="outline" size="lg" className="h-12 px-8 text-base">How it Works</Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-serif font-bold mb-4">Scientific Rigor Meets AI Intelligence</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our human-in-the-loop approach ensures you stay in control while elevating the quality of your research design.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<CheckCircle className="h-8 w-8 text-primary" />}
              title="Methodological Diagnosis"
              description="Identify weak points, methodological risks, and conceptual gaps in your research proposal before you submit."
            />
            <FeatureCard 
              icon={<BookOpen className="h-8 w-8 text-primary" />}
              title="Bibliographic Support"
              description="Get recommendations for real, existing literature relevant to your topic. No hallucinations, only verified sources."
            />
            <FeatureCard 
              icon={<Shield className="h-8 w-8 text-primary" />}
              title="Ethical & Transparent"
              description="We explain every suggestion. You decide what to accept. The intellectual authorship remains 100% yours."
            />
          </div>
        </div>
      </section>

      {/* Ethics/Philosophy */}
      <section className="py-24">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-16">
          <div className="md:w-1/2">
            <div className="bg-primary/5 p-8 rounded-2xl border border-primary/10">
              <h3 className="text-2xl font-serif font-bold mb-4 flex items-center gap-2">
                <Lock className="h-5 w-5" /> The "No-Ghostwriting" Guarantee
              </h3>
              <p className="text-muted-foreground mb-6">
                Unlike generic LLMs that generate plausible but often hollow text, Methodolog.AI is built to <strong>guide</strong>. 
                We provide the scaffolding for your critical thinking, offering questions and structural improvements rather than finished paragraphs.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center shrink-0 text-xs">✓</div>
                  <span className="text-sm">Enhances student learning outcomes</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center shrink-0 text-xs">✓</div>
                  <span className="text-sm">Promotes academic integrity</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center shrink-0 text-xs">✓</div>
                  <span className="text-sm">Transparent reasoning for every edit</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="md:w-1/2">
            <h2 className="text-4xl font-serif font-bold mb-6">Empowering the Researcher, Not Replacing Them.</h2>
            <p className="text-lg text-muted-foreground mb-8">
              "The goal of research is discovery. If an AI does the discovery for you, you haven't learned anything. Methodolog.AI acts as a senior colleague—challenging your assumptions and refining your methods."
            </p>
            <Button variant="outline">Read our Ethical Manifesto</Button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-primary text-primary-foreground text-center">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">Ready to refine your research proposal?</h2>
          <p className="text-primary-foreground/80 text-lg mb-10">
            Join thousands of researchers using Methodolog.AI to build stronger, more rigorous projects.
          </p>
          <Link href="/app/dashboard">
            <Button size="lg" variant="secondary" className="h-14 px-8 text-lg font-medium text-primary">
              Start Free Consultation
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border bg-background text-sm text-muted-foreground">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 Methodolog.AI. Dedicated to scientific excellence.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-8 rounded-xl bg-background border border-border shadow-sm hover:shadow-md transition-shadow">
      <div className="mb-4 bg-primary/5 w-16 h-16 rounded-full flex items-center justify-center">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}