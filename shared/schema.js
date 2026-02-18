import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
// NOTE: In a real Solana dApp, these would be on-chain accounts.
// We define them here to generate consistent TypeScript interfaces for the frontend
// and to provide a "mock" Web2 backend for demonstration purposes if the user
// hasn't set up the local Solana validator yet.
// === Suggestion System ===
export const suggestions = pgTable("suggestions", {
    id: serial("id").primaryKey(),
    pubkey: text("pubkey").notNull(), // Mimics the PDA
    author: text("author").notNull(), // Wallet address
    title: text("title").notNull(),
    description: text("description").notNull(),
    category: text("category").notNull(), // academics, infrastructure, etc.
    voteCount: integer("vote_count").default(0),
    createdAt: timestamp("created_at").defaultNow(),
});
// === Academic Notes Hub ===
export const notes = pgTable("notes", {
    id: serial("id").primaryKey(),
    pubkey: text("pubkey").notNull(),
    author: text("author").notNull(),
    subject: text("subject").notNull(),
    title: text("title").notNull(),
    ipfsHash: text("ipfs_hash").notNull(), // CID from IPFS
    createdAt: timestamp("created_at").defaultNow(),
});
// === Notes Request Feature ===
export const requests = pgTable("requests", {
    id: serial("id").primaryKey(),
    pubkey: text("pubkey").notNull(),
    author: text("author").notNull(),
    subject: text("subject").notNull(),
    description: text("description").notNull(),
    isFulfilled: boolean("is_fulfilled").default(false),
    createdAt: timestamp("created_at").defaultNow(),
});
// === Zod Schemas ===
export const insertSuggestionSchema = createInsertSchema(suggestions).omit({
    id: true,
    pubkey: true,
    voteCount: true,
    createdAt: true
});
export const insertNoteSchema = createInsertSchema(notes).omit({
    id: true,
    pubkey: true,
    createdAt: true
});
export const insertRequestSchema = createInsertSchema(requests).omit({
    id: true,
    pubkey: true,
    isFulfilled: true,
    createdAt: true
});
