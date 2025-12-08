import React, { useState, useEffect } from "react";
import { Link, useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Brain, ChevronLeft, Save, Play, RefreshCw, Layers, BookOpen, AlertCircle, CheckCircle2 } from "lucide-react";
import { SuggestionCard } from "@/components/SuggestionCard";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// Types
interface ProjectData {
  title: string;
  problem: string;
  objectives: string;
  methodology: string;
}

interface Suggestion {
  id: string;
  type: "risk" | "improvement" | "gap" | "citation";
  title: string;
  description: string;
  rationale: string;
  accepted?: boolean;
}

const MOCK_SUGGESTIONS: Suggestion[] = [
  {
    id: "s1",
    type: "risk",
    title: "Critical Methodological Flaw: Sampling Bias",
    description: "Your proposed sampling method ('asking colleagues') is a form of convenience sampling that invalidates your ability to generalize to the broader urban population.",
    rationale: "Convenience sampling limits external validity. For a study on city-wide mobility patterns, you must use a probabilistic sampling method (e.g., stratified random sampling) or explicitly frame this as an exploratory case study with limited scope."
  },
  {
    id: "s2",
    type: "improvement",
    title: "Objective 2 is Not Measurable",
    description: "The verb 'To understand' in 'To understand how people feel' is cognitive and unobservable. Research objectives must be operationalizable.",
    rationale: "Change 'To understand' to 'To measure' or 'To analyze'. Example improvement: 'To analyze the correlation between weekly telecommuting hours and self-reported commuter stress levels using the Perceived Stress Scale (PSS-10).'"
  },
  {
    id: "s3",
    type: "gap",
    title: "Missing Theoretical Framework",
    description: "You are linking 'traffic' and 'remote work' without a mediating variable. The literature suggests 'modal shift' is the key mechanism here.",
    rationale: "Direct causality is hard to prove. Consider adopting the 'Activity-Based Travel Demand' theory to explain how flexible work schedules restructure—rather than just reduce—travel demand."
  },
  {
    id: "s4",
    type: "citation",
    title: "Foundational Literature Omitted",
    description: "You cannot discuss remote work mobility without citing Mokhtarian (1990) or the recent post-pandemic work by Anderson et al. (2023).",
    rationale: "Mokhtarian's 'Telecommuting and Travel' is the seminal work establishing the substitution vs. complementarity hypothesis. Ignoring it suggests a gap in your literature review."
  }
];

export default function ProjectPage() {
  const { toast } = useToast();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState("problem");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [project, setProject] = useState<ProjectData>({
    title: "Impact of Remote Work on Urban Mobility Patterns",
    problem: "I think traffic is getting better because everyone is working from home now. But some people say it's worse. I want to find out who is right because it affects my commute.",
    objectives: "1. To see if remote work is good for the city.\n2. To understand how people feel about not driving to work anymore.\n3. To prove that working from home reduces pollution.",
    methodology: "I will send a Google Form to my co-workers and ask them if they like working from home. I will also stand at the corner of Main St. for an hour on Monday to count cars."
  });

  const handleRunAnalysis = () => {
    setIsAnalyzing(true);
    // Simulate AI analysis delay
    setTimeout(() => {
      setIsAnalyzing(false);
      setSuggestions(MOCK_SUGGESTIONS);
      toast({
        title: "Analysis Complete",
        description: "The consultant has identified 3 potential improvements.",
      });
    }, 2000);
  };

  const handleAccept = (id: string) => {
    setSuggestions(prev => prev.map(s => s.id === id ? { ...s, accepted: true } : s));
    toast({
      title: "Suggestion Accepted",
      description: "Your project draft has been updated.",
    });
    // In a real app, this would modify the text content
  };

  const handleReject = (id: string) => {
    setSuggestions(prev => prev.map(s => s.id === id ? { ...s, accepted: false } : s));
    toast({
      title: "Suggestion Rejected",
      description: "Suggestion dismissed.",
    });
  };

  const activeSuggestions = suggestions.filter(s => s.accepted === undefined);

  return (
    <div className="h-screen flex flex-col bg-background font-sans overflow-hidden">
      {/* Header */}
      <header className="h-14 border-b border-border flex items-center justify-between px-4 bg-background z-20 shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/app/dashboard">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex flex-col">
            <span className="text-sm font-semibold truncate max-w-[300px]">{project.title}</span>
            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span> Draft Mode
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8 gap-2">
            <Save className="h-3.5 w-3.5" /> Save
          </Button>
          <Button 
            size="sm" 
            className="h-8 gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={handleRunAnalysis}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Brain className="h-3.5 w-3.5" />}
            {isAnalyzing ? "Analyzing..." : "Run Diagnosis"}
          </Button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Navigation */}
        <div className="w-64 border-r border-border bg-sidebar hidden md:flex flex-col">
          <div className="p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Project Sections
          </div>
          <nav className="space-y-1 px-2">
            {[
              { id: "problem", label: "Problem Statement", icon: AlertCircle },
              { id: "objectives", label: "Objectives & Hypotheses", icon: CheckCircle2 },
              { id: "literature", label: "Literature Review", icon: BookOpen },
              { id: "methodology", label: "Methodology", icon: Layers },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  activeTab === item.id 
                    ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                    : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </button>
            ))}
          </nav>
          
          <div className="mt-auto p-4 border-t border-border">
            <div className="bg-background rounded-lg p-3 border border-border shadow-sm">
              <div className="text-xs font-medium text-muted-foreground mb-2">Overall Rigor Score</div>
              <div className="flex items-end gap-2 mb-1">
                <span className="text-2xl font-bold font-serif text-primary">65</span>
                <span className="text-xs text-muted-foreground mb-1">/ 100</span>
              </div>
              <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-yellow-500 w-[65%]"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Center - Editor */}
        <div className="flex-1 flex flex-col min-w-0 bg-background">
          <div className="p-6 max-w-3xl mx-auto w-full h-full flex flex-col">
            <div className="mb-6">
              <h2 className="text-2xl font-serif font-bold text-foreground mb-2">
                {activeTab === "problem" && "Problem Statement"}
                {activeTab === "objectives" && "Objectives & Hypotheses"}
                {activeTab === "literature" && "Literature Review"}
                {activeTab === "methodology" && "Methodology"}
              </h2>
              <p className="text-sm text-muted-foreground">
                {activeTab === "problem" && "Define the specific research problem, context, and significance."}
                {activeTab === "objectives" && "Ideally 1 General Objective and 3-4 Specific Objectives."}
                {activeTab === "methodology" && "Detail your population, sample, instruments, and procedure."}
              </p>
            </div>

            <div className="flex-1 bg-card border border-border rounded-lg shadow-sm p-1">
              <Textarea 
                className="w-full h-full resize-none border-0 focus-visible:ring-0 p-4 text-base leading-relaxed font-serif text-foreground/90"
                placeholder="Start writing your section here..."
                value={project[activeTab as keyof ProjectData] || ""}
                onChange={(e) => setProject({...project, [activeTab]: e.target.value})}
              />
            </div>
          </div>
        </div>

        {/* Right Sidebar - AI Consultant */}
        <div className="w-80 border-l border-border bg-secondary/10 flex flex-col">
          <div className="p-4 border-b border-border flex items-center justify-between bg-background">
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-primary" />
              <span className="font-semibold text-sm">Consultant Remarks</span>
            </div>
            <Badge variant="secondary" className="text-xs font-normal">
              {activeSuggestions.length} pending
            </Badge>
          </div>

          <ScrollArea className="flex-1 p-4">
            {activeSuggestions.length === 0 ? (
              <div className="text-center py-10 px-4">
                <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="font-medium text-foreground mb-1">All Clear</h3>
                <p className="text-xs text-muted-foreground">
                  No active suggestions. Run a new diagnosis when you've made changes.
                </p>
                <Button variant="outline" size="sm" className="mt-4" onClick={handleRunAnalysis}>
                  Run Diagnosis
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {activeSuggestions.map((suggestion) => (
                  <SuggestionCard 
                    key={suggestion.id} 
                    suggestion={suggestion} 
                    onAccept={handleAccept} 
                    onReject={handleReject}
                  />
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}