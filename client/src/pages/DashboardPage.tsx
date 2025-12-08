import React from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, FileText, Clock, MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const MOCK_PROJECTS = [
  {
    id: 1,
    title: "Impact of Remote Work on Urban Mobility Patterns",
    updated: "2 hours ago",
    status: "In Progress",
    completeness: 65,
    area: "Urban Planning"
  },
  {
    id: 2,
    title: "Machine Learning Approaches to Early Diabetes Detection",
    updated: "2 days ago",
    status: "Review Needed",
    completeness: 80,
    area: "Health Informatics"
  },
  {
    id: 3,
    title: "Sustainable Packaging Consumer Behavior Analysis",
    updated: "1 week ago",
    status: "Draft",
    completeness: 30,
    area: "Marketing"
  }
];

export default function DashboardPage() {
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
          <Link href="/app/project/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> New Project
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_PROJECTS.map((project) => (
            <Link key={project.id} href={`/app/project/${project.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer h-full border-border/60">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <Badge variant="outline" className="mb-2">{project.area}</Badge>
                    <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 text-muted-foreground">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardTitle className="font-serif leading-snug line-clamp-2">{project.title}</CardTitle>
                  <CardDescription>Last updated {project.updated}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Methodological Rigor Score</span>
                      <span>{project.completeness}%</span>
                    </div>
                    <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary transition-all duration-500" 
                        style={{ width: `${project.completeness}%` }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-0 text-xs text-muted-foreground flex gap-2 items-center">
                   <Clock className="h-3 w-3" /> {project.status}
                </CardFooter>
              </Card>
            </Link>
          ))}

          {/* New Project Card Placeholder */}
          <Link href="/app/project/new">
            <div className="h-full border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center p-8 text-muted-foreground hover:border-primary hover:text-primary transition-colors cursor-pointer bg-background/50">
              <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center mb-4">
                <Plus className="h-6 w-6" />
              </div>
              <h3 className="font-medium">Create New Project</h3>
              <p className="text-sm mt-1 text-center opacity-70">Start a new research proposal analysis</p>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}