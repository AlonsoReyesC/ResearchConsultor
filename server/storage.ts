import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { 
  users, 
  projects, 
  suggestions,
  type User, 
  type InsertUser,
  type Project,
  type InsertProject,
  type UpdateProject,
  type Suggestion,
  type InsertSuggestion
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool);

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getProject(id: string): Promise<Project | undefined>;
  getProjectsByUser(userId: string): Promise<Project[]>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: string, project: UpdateProject): Promise<Project | undefined>;
  deleteProject(id: string): Promise<void>;
  
  getSuggestionsByProject(projectId: string): Promise<Suggestion[]>;
  createSuggestion(suggestion: InsertSuggestion): Promise<Suggestion>;
  updateSuggestionStatus(id: string, status: string): Promise<Suggestion | undefined>;
  deleteSuggestionsByProject(projectId: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  async getProject(id: string): Promise<Project | undefined> {
    const result = await db.select().from(projects).where(eq(projects.id, id)).limit(1);
    return result[0];
  }

  async getProjectsByUser(userId: string): Promise<Project[]> {
    return await db.select().from(projects).where(eq(projects.userId, userId)).orderBy(desc(projects.updatedAt));
  }

  async createProject(project: InsertProject): Promise<Project> {
    const result = await db.insert(projects).values(project).returning();
    return result[0];
  }

  async updateProject(id: string, project: UpdateProject): Promise<Project | undefined> {
    const result = await db.update(projects)
      .set({ ...project, updatedAt: new Date() })
      .where(eq(projects.id, id))
      .returning();
    return result[0];
  }

  async deleteProject(id: string): Promise<void> {
    await db.delete(projects).where(eq(projects.id, id));
  }

  async getSuggestionsByProject(projectId: string): Promise<Suggestion[]> {
    return await db.select().from(suggestions).where(eq(suggestions.projectId, projectId)).orderBy(desc(suggestions.createdAt));
  }

  async createSuggestion(suggestion: InsertSuggestion): Promise<Suggestion> {
    const result = await db.insert(suggestions).values(suggestion).returning();
    return result[0];
  }

  async updateSuggestionStatus(id: string, status: string): Promise<Suggestion | undefined> {
    const result = await db.update(suggestions)
      .set({ status })
      .where(eq(suggestions.id, id))
      .returning();
    return result[0];
  }

  async deleteSuggestionsByProject(projectId: string): Promise<void> {
    await db.delete(suggestions).where(eq(suggestions.projectId, projectId));
  }
}

export const storage = new DatabaseStorage();