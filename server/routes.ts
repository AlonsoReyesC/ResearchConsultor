import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { diagnoseProject } from "./ai";
import { insertProjectSchema, updateProjectSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Projects
  app.get("/api/projects", async (req, res) => {
    try {
      const userId = "demo-user"; // In production, get from auth session
      const projects = await storage.getProjectsByUser(userId);
      res.json(projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ error: "Failed to fetch projects" });
    }
  });

  app.get("/api/projects/:id", async (req, res) => {
    try {
      const project = await storage.getProject(req.params.id);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      console.error("Error fetching project:", error);
      res.status(500).json({ error: "Failed to fetch project" });
    }
  });

  app.post("/api/projects", async (req, res) => {
    try {
      const validated = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(validated);
      res.status(201).json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid project data", details: error.errors });
      }
      console.error("Error creating project:", error);
      res.status(500).json({ error: "Failed to create project" });
    }
  });

  app.patch("/api/projects/:id", async (req, res) => {
    try {
      const validated = updateProjectSchema.parse(req.body);
      const project = await storage.updateProject(req.params.id, validated);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid project data", details: error.errors });
      }
      console.error("Error updating project:", error);
      res.status(500).json({ error: "Failed to update project" });
    }
  });

  app.delete("/api/projects/:id", async (req, res) => {
    try {
      await storage.deleteProject(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting project:", error);
      res.status(500).json({ error: "Failed to delete project" });
    }
  });

  // AI Diagnosis
  app.post("/api/projects/:id/diagnose", async (req, res) => {
    try {
      const project = await storage.getProject(req.params.id);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }

      // Clear old suggestions
      await storage.deleteSuggestionsByProject(project.id);

      // Run AI diagnosis
      const diagnosis = await diagnoseProject({
        title: project.title,
        problem: project.problem || undefined,
        objectives: project.objectives || undefined,
        literature: project.literature || undefined,
        methodology: project.methodology || undefined,
      });

      // Save suggestions to database
      const suggestions = await Promise.all(
        diagnosis.suggestions.map(s => 
          storage.createSuggestion({
            projectId: project.id,
            type: s.type,
            title: s.title,
            description: s.description,
            rationale: s.rationale,
            section: s.section,
            status: "pending"
          })
        )
      );

      // Update project rigor score
      await storage.updateProject(project.id, {
        rigorScore: diagnosis.overallScore
      });

      res.json({
        suggestions,
        overallScore: diagnosis.overallScore,
        summary: diagnosis.summary
      });
    } catch (error) {
      console.error("Error diagnosing project:", error);
      res.status(500).json({ error: "Failed to diagnose project: " + (error as Error).message });
    }
  });

  // Suggestions
  app.get("/api/projects/:id/suggestions", async (req, res) => {
    try {
      const suggestions = await storage.getSuggestionsByProject(req.params.id);
      res.json(suggestions);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      res.status(500).json({ error: "Failed to fetch suggestions" });
    }
  });

  app.patch("/api/suggestions/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      if (!["pending", "accepted", "rejected"].includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
      }
      const suggestion = await storage.updateSuggestionStatus(req.params.id, status);
      if (!suggestion) {
        return res.status(404).json({ error: "Suggestion not found" });
      }
      res.json(suggestion);
    } catch (error) {
      console.error("Error updating suggestion:", error);
      res.status(500).json({ error: "Failed to update suggestion" });
    }
  });

  return httpServer;
}

app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    // Simula login (en futuro agrega Passport real)
    if (username === "demo" && password === "demo") {
      res.json({ userId: "demo-user", message: "Login exitoso" });
    } else {
      res.status(401).json({ error: "Credenciales inválidas" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error en login" });
  }
});