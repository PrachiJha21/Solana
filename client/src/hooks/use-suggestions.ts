import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { insertSuggestionSchema } from "@shared/schema";
import type { Suggestion, InsertSuggestion } from "@shared/schema";

// GET /api/suggestions
export function useSuggestions() {
  return useQuery({
    queryKey: [api.suggestions.list.path],
    queryFn: async () => {
      const res = await fetch(api.suggestions.list.path);
      if (!res.ok) throw new Error("Failed to fetch suggestions");
      return api.suggestions.list.responses[200].parse(await res.json());
    },
  });
}

// POST /api/suggestions
export function useCreateSuggestion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertSuggestion) => {
      const validated = insertSuggestionSchema.parse(data);
      const res = await fetch(api.suggestions.create.path, {
        method: api.suggestions.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
      });
      
      if (!res.ok) throw new Error("Failed to create suggestion");
      return api.suggestions.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.suggestions.list.path] });
    },
  });
}
