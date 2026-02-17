import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertSuggestionSchema, insertNoteSchema, insertRequestSchema } from "@shared/schema";
import { seedDatabase } from "./seed";

export async function registerRoutes(
  httpServer: Server,
  app: Express,
): Promise<Server> {
  // Seed the database on startup
  await seedDatabase();

  // Suggestions
  app.get("/api/suggestions", async (_req, res) => {
    const suggestions = await storage.getSuggestions();
    res.json(suggestions);
  });

  app.post("/api/suggestions", async (req, res) => {
    const parsed = insertSuggestionSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json(parsed.error);
    }
    const suggestion = await storage.createSuggestion(parsed.data);
    res.status(201).json(suggestion);
  });

  // Notes
  app.get("/api/notes", async (_req, res) => {
    const notes = await storage.getNotes();
    res.json(notes);
  });

  app.post("/api/notes", async (req, res) => {
    const parsed = insertNoteSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json(parsed.error);
    }
    const note = await storage.createNote(parsed.data);
    res.status(201).json(note);
  });

  // Requests
  app.get("/api/requests", async (_req, res) => {
    const requests = await storage.getRequests();
    res.json(requests);
  });

  app.post("/api/requests", async (req, res) => {
    const parsed = insertRequestSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json(parsed.error);
    }
    const request = await storage.createRequest(parsed.data);
    res.status(201).json(request);
  });

  return httpServer;
}
