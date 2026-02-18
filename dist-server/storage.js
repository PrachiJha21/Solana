import { suggestions, notes, requests, } from "@shared/schema";
import { db } from "./db";
export class DatabaseStorage {
    // Suggestions
    async getSuggestions() {
        return await db.select().from(suggestions);
    }
    async createSuggestion(insertSuggestion) {
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
    async getNotes() {
        return await db.select().from(notes);
    }
    async createNote(insertNote) {
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
    async getRequests() {
        return await db.select().from(requests);
    }
    async createRequest(insertRequest) {
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
