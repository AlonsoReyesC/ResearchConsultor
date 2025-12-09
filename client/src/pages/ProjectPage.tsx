import React, { useState, useEffect } from "react";
import { Link, useRoute, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Brain, ChevronLeft, Save, RefreshCw, Layers, BookOpen, AlertCircle, CheckCircle2 } from "lucide-react";
import { SuggestionCard } from "@/components/SuggestionCard";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface ProjectData {
  id: string;
  title: string;
  problem?: string | null;
  objectives?: string | null;
  literature?: string | null;
  methodology?: string | null;
  rigorScore?: number;
}

interface Suggestion {
  id: string;
  type: "risk" | "improvement" | "gap" | "citation";
  title: string;
  description: string;
  rationale: string;
  section?: string | null;
  status: string;
}

export default function ProjectPage() {
  const { toast } = useToast();
  const params = useParams();
  const projectId = params.id as string;
  const [activeTab, setActiveTab] = useState("problem");
  const queryClient = useQueryClient();

  const [localProject, setLocalProject] = useState<ProjectData | null>(null);

  const { data: project, isLoading: projectLoading } = useQuery({
    queryKey: ["project", projectId],
    queryFn: async () => {
      const res = await fetch(`/api/projects/${projectId}`);
      if (!res.ok) throw new Error("Failed to fetch project");
      return res.json() as Promise<ProjectData>;
    },
    enabled: projectId !== "new"
  });

  const { data: suggestions = [], isLoading: suggestionsLoading } = useQuery({
    queryKey: ["suggestions", projectId],
    queryFn: async () => {
      const res = await fetch(`/api/projects/${projectId}/suggestions`);
      if (!res.ok) throw new Error("Failed to fetch suggestions");
      return res.json() as Promise<Suggestion[]>;
    },
    enabled: projectId !== "new"
  });

  useEffect(() => {
    if (project) {
      setLocalProject(project);
    } else if (projectId === "new") {
      setLocalProject({
        id: "new",
        title: "New Research Project",
        problem: "",
        objectives: "",
        literature: "",
        methodology: "",
        rigorScore: 0
      });
    }
  }, [project, projectId]);

  const saveMutation = useMutation({
    mutationFn: async (data: Partial<ProjectData>) => {
      if (projectId === "new") {
        const res = await fetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...data, userId: "demo-user" })
        });
        if (!res.ok) throw new Error("Failed to create project");
        return res.json();
      } else {
        const res = await fetch(`/api/projects/${projectId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error("Failed to update project");
        return res.json();
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      toast({ title: "Saved", description: "Project saved successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to save project", variant: "destructive" });
    }
  });

  const diagnosisMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/projects/${projectId}/diagnose`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to diagnose project");
      }
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["suggestions", projectId] });
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      toast({
        title: "Analysis Complete",
        description: `Found ${data.suggestions.length} suggestions. Rigor Score: ${data.overallScore}/100`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Diagnosis Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const updateSuggestionMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string, status: string }) => {
      const res = await fetch(`/api/suggestions/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      if (!res.ok) throw new Error("Failed to update suggestion");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suggestions", projectId] });
    }
  });

  const handleSave = () => {
    if (!localProject) return;
    saveMutation.mutate(localProject);
  };

  const handleRunAnalysis = () => {
    diagnosisMutation.mutate();
  };

  const handleAccept = (id: string) => {
    updateSuggestionMutation.mutate({ id, status: "accepted" });
    toast({
      title: "Suggestion Accepted",
      description: "Your project draft has been updated.",
    });
  };

  const handleReject = (id: string) => {
    updateSuggestionMutation.mutate({ id, status: "rejected" });
    toast({
      title: "Suggestion Rejected",
      description: "Suggestion dismissed.",
    });
  };

  const updateField = (field: keyof ProjectData, value: string) => {
    if (!localProject) return;
    setLocalProject({ ...localProject, [field]: value });
  };

  const activeSuggestions = suggestions.filter(s => s.status === "pending");

  if (projectLoading || !localProject) {
    return (
      <div className="h-screen flex items-center justify-center">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background font-sans overflow-hidden">
      <header className="h-14 border-b border-border flex items-center justify-between px-4 bg-background z-20 shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/app/dashboard">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex flex-col">
            <span className="text-sm font-semibold truncate max-w-[300px]">{localProject.title}</span>
            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span> Draft Mode
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 gap-2"
            onClick={handleSave}
            disabled={saveMutation.isPending}
          >
            <Save className="h-3.5 w-3.5" /> Save
          </Button>
          <Button 
            size="sm" 
            className="h-8 gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={handleRunAnalysis}
            disabled={diagnosisMutation.isPending || projectId === "new"}
          >
            {diagnosisMutation.isPending ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Brain className="h-3.5 w-3.5" />}
            {diagnosisMutation.isPending ? "Analyzing..." : "Run Diagnosis"}
          </Button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
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
                <span className="text-2xl font-bold font-serif text-primary">{localProject.rigorScore || 0}</span>
                <span className="text-xs text-muted-foreground mb-1">/ 100</span>
              </div>
              <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-yellow-500 transition-all duration-500" style={{ width: `${localProject.rigorScore || 0}%` }}></div>
              </div>
            </div>
          </div>
        </div>

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
                value={(localProject[activeTab as keyof ProjectData] as string) || ""}
                onChange={(e) => updateField(activeTab as keyof ProjectData, e.target.value)}
              />
            </div>
          </div>
        </div>

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
                <Button variant="outline" size="sm" className="mt-4" onClick={handleRunAnalysis} disabled={projectId === "new"}>
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