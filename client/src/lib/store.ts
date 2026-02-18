import { useWallet } from "@solana/wallet-adapter-react";
import { v4 as uuidv4 } from "uuid";

export type Suggestion = {
  id: string;
  title: string;
  description: string;
  category: "academics" | "infrastructure" | "exams" | "canteen" | "other";
  createdAt: string;
  authorId: string;
  votes: number;
  replies: Reply[];
};

export type Reply = {
  id: string;
  text: string;
  createdAt: string;
  authorId: string;
};

export type Note = {
  id: string;
  title: string;
  subject: string;
  link: string;
  createdAt: string;
  authorId: string;
  votes: number;
};

export type NoteRequest = {
  id: string;
  subject: string;
  details?: string;
  createdAt: string;
  requesterId: string;
  fulfilled: boolean;
};

export type Thread = {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  authorId: string;
  replies: Reply[];
};

const STORAGE_KEY = "campus-dao-store";

type StoreData = {
  suggestions: Suggestion[];
  notes: Note[];
  requests: NoteRequest[];
  threads: Thread[];
};

function getInitialData(): StoreData {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) return JSON.parse(saved);
  return {
    suggestions: [],
    notes: [],
    requests: [],
    threads: [],
  };
}

let data: StoreData = getInitialData();

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getUserId(walletPublicKey?: string | null): string {
  if (walletPublicKey) return walletPublicKey;
  let guestId = localStorage.getItem("guestId");
  if (!guestId) {
    guestId = `guest-${uuidv4().slice(0, 8)}`;
    localStorage.setItem("guestId", guestId);
  }
  return guestId;
}

export const SuggestionStore = {
  all: () => data.suggestions,
  add: (s: Omit<Suggestion, "id" | "createdAt" | "votes" | "replies">) => {
    const newSuggestion: Suggestion = {
      ...s,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      votes: 0,
      replies: [],
    };
    data.suggestions.unshift(newSuggestion);
    save();
    return newSuggestion;
  },
  update: (id: string, updates: Partial<Suggestion>) => {
    data.suggestions = data.suggestions.map((s) => (s.id === id ? { ...s, ...updates } : s));
    save();
  },
  remove: (id: string) => {
    data.suggestions = data.suggestions.filter((s) => s.id !== id);
    save();
  },
  vote: (id: string, delta: number) => {
    data.suggestions = data.suggestions.map((s) =>
      s.id === id ? { ...s, votes: Math.max(0, s.votes + delta) } : s
    );
    save();
  },
  reply: (id: string, reply: Omit<Reply, "id" | "createdAt">) => {
    const newReply: Reply = {
      ...reply,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
    };
    data.suggestions = data.suggestions.map((s) =>
      s.id === id ? { ...s, replies: [...s.replies, newReply] } : s
    );
    save();
  },
  removeReply: (suggestionId: string, replyId: string) => {
    data.suggestions = data.suggestions.map((s) =>
      s.id === suggestionId ? { ...s, replies: s.replies.filter((r) => r.id !== replyId) } : s
    );
    save();
  },
};

export const NoteStore = {
  all: () => data.notes,
  add: (n: Omit<Note, "id" | "createdAt" | "votes">) => {
    const newNote: Note = {
      ...n,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      votes: 0,
    };
    data.notes.unshift(newNote);
    save();
    return newNote;
  },
  update: (id: string, updates: Partial<Note>) => {
    data.notes = data.notes.map((n) => (n.id === id ? { ...n, ...updates } : n));
    save();
  },
  remove: (id: string) => {
    data.notes = data.notes.filter((n) => n.id !== id);
    save();
  },
  vote: (id: string, delta: number) => {
    data.notes = data.notes.map((n) => (n.id === id ? { ...n, votes: n.votes + delta } : n));
    save();
  },
};

export const RequestStore = {
  all: () => data.requests,
  add: (r: Omit<NoteRequest, "id" | "createdAt" | "fulfilled">) => {
    const newRequest: NoteRequest = {
      ...r,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      fulfilled: false,
    };
    data.requests.unshift(newRequest);
    save();
    return newRequest;
  },
  update: (id: string, updates: Partial<NoteRequest>) => {
    data.requests = data.requests.map((r) => (r.id === id ? { ...r, ...updates } : r));
    save();
  },
  remove: (id: string) => {
    data.requests = data.requests.filter((r) => r.id !== id);
    save();
  },
  fulfill: (id: string, fulfilled: boolean) => {
    data.requests = data.requests.map((r) => (r.id === id ? { ...r, fulfilled } : r));
    save();
  },
};

export const ThreadStore = {
  all: () => data.threads,
  add: (t: Omit<Thread, "id" | "createdAt" | "replies">) => {
    const newThread: Thread = {
      ...t,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      replies: [],
    };
    data.threads.unshift(newThread);
    save();
    return newThread;
  },
  update: (id: string, updates: Partial<Thread>) => {
    data.threads = data.threads.map((t) => (t.id === id ? { ...t, ...updates } : t));
    save();
  },
  remove: (id: string) => {
    data.threads = data.threads.filter((t) => t.id !== id);
    save();
  },
  reply: (id: string, reply: Omit<Reply, "id" | "createdAt">) => {
    const newReply: Reply = {
      ...reply,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
    };
    data.threads = data.threads.map((t) =>
      t.id === id ? { ...t, replies: [...t.replies, newReply] } : t
    );
    save();
  },
  removeReply: (threadId: string, replyId: string) => {
    data.threads = data.threads.map((t) =>
      t.id === threadId ? { ...t, replies: t.replies.filter((r) => r.id !== replyId) } : t
    );
    save();
  },
};
