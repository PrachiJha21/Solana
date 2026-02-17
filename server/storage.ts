import {
  type Suggestion,
  type InsertSuggestion,
  type Note,
  type InsertNote,
  type Request,
  type InsertRequest,
  suggestions,
  notes,
  requests,
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // Suggestions
  getSuggestions(): Promise<Suggestion[]>;
  createSuggestion(suggestion: InsertSuggestion): Promise<Suggestion>;

  // Notes
  getNotes(): Promise<Note[]>;
  createNote(note: InsertNote): Promise<Note>;

  // Requests
  getRequests(): Promise<Request[]>;
  createRequest(request: InsertRequest): Promise<Request>;
}

export class DatabaseStorage implements IStorage {
  // Suggestions
  async getSuggestions(): Promise<Suggestion[]> {
    return await db.select().from(suggestions);
  }

  async createSuggestion(insertSuggestion: InsertSuggestion): Promise<Suggestion> {
    const [suggestion] = await db
      .insert(suggestions)
      .values({
        ...insertSuggestion,
        pubkey: "MockPubkey-" + Math.random().toString(36).substring(7),
      })
      .returning();
    return suggestion;
  }

  // Notes
  async getNotes(): Promise<Note[]> {
    return await db.select().from(notes);
  }

  async createNote(insertNote: InsertNote): Promise<Note> {
    const [note] = await db
      .insert(notes)
      .values({
        ...insertNote,
        pubkey: "MockPubkey-" + Math.random().toString(36).substring(7),
      })
      .returning();
    return note;
  }

  // Requests
  async getRequests(): Promise<Request[]> {
    return await db.select().from(requests);
  }

  async createRequest(insertRequest: InsertRequest): Promise<Request> {
    const [request] = await db
      .insert(requests)
      .values({
        ...insertRequest,
        pubkey: "MockPubkey-" + Math.random().toString(36).substring(7),
      })
      .returning();
    return request;
  }
}

export const storage = new DatabaseStorage();
