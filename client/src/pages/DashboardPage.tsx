import React from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Clock, MoreHorizontal, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface Project {
  id: string;
  title: string;
  area?: string | null;
  rigorScore?: number;
  status?: string | null;
  updatedAt: string;
}

export default function DashboardPage() {
  const queryClient = useQueryClient();

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const res = await fetch("/api/projects");
      if (!res.ok) throw new Error("Failed to fetch projects");
      return res.json() as Promise<Project[]>;
    }
  });

  const createProjectMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: "demo-user",
          title: "New Research Project",
          area: "General",
          status: "draft"
        })
      });
      if (!res.ok) throw new Error("Failed to create project");
      return res.json();
    },
    onSuccess: (newProject) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      window.location.href = `/app/project/${newProject.id}`;
    }
  });

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-secondary/20 flex items-center justify-center">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary/20 font-sans">
      <header className="bg-background border-b border-border sticky top-0 z-10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/">
              <span className="text-xl font-serif font-bold tracking-tight cursor-pointer">Methodolog.AI</span>
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="font-medium">Dashboard</span>
          </div>
          <div className="flex items-center gap-4">
             <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">JD</div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-serif font-bold text-foreground">My Projects</h1>
            <p className="text-muted-foreground">Manage and refine your research proposals.</p>
          </div>
          <Button 
            className="gap-2"
            onClick={() => createProjectMutation.mutate()}
            disabled={createProjectMutation.isPending}
          >
            <Plus className="h-4 w-4" /> New Project
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Link key={project.id} href={`/app/project/${project.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer h-full border-border/60">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <Badge variant="outline" className="mb-2">{project.area || "General"}</Badge>
                    <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 text-muted-foreground">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardTitle className="font-serif leading-snug line-clamp-2">{project.title}</CardTitle>
                  <CardDescription>Last updated {formatDate(project.updatedAt)}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Methodological Rigor Score</span>
                      <span>{project.rigorScore || 0}%</span>
                    </div>
                    <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary transition-all duration-500" 
                        style={{ width: `${project.rigorScore || 0}%` }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-0 text-xs text-muted-foreground flex gap-2 items-center">
                   <Clock className="h-3 w-3" /> {project.status || "draft"}
                </CardFooter>
              </Card>
            </Link>
          ))}

          <div 
            onClick={() => createProjectMutation.mutate()}
            className="h-full border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center p-8 text-muted-foreground hover:border-primary hover:text-primary transition-colors cursor-pointer bg-background/50"
          >
            <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center mb-4">
              <Plus className="h-6 w-6" />
            </div>
            <h3 className="font-medium">Create New Project</h3>
            <p className="text-sm mt-1 text-center opacity-70">Start a new research proposal analysis</p>
          </div>
        </div>
      </main>
    </div>
  );
}