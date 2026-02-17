import { z } from 'zod';
import { insertSuggestionSchema, insertNoteSchema, insertRequestSchema, suggestions, notes, requests } from './schema';

// ============================================
// API CONTRACT
// ============================================
export const api = {
  suggestions: {
    list: {
      method: 'GET' as const,
      path: '/api/suggestions' as const,
      responses: {
        200: z.array(z.custom<typeof suggestions.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/suggestions' as const,
      input: insertSuggestionSchema,
      responses: {
        201: z.custom<typeof suggestions.$inferSelect>(),
      },
    },
  },
  notes: {
    list: {
      method: 'GET' as const,
      path: '/api/notes' as const,
      responses: {
        200: z.array(z.custom<typeof notes.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/notes' as const,
      input: insertNoteSchema,
      responses: {
        201: z.custom<typeof notes.$inferSelect>(),
      },
    },
  },
  requests: {
    list: {
      method: 'GET' as const,
      path: '/api/requests' as const,
      responses: {
        200: z.array(z.custom<typeof requests.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/requests' as const,
      input: insertRequestSchema,
      responses: {
        201: z.custom<typeof requests.$inferSelect>(),
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
