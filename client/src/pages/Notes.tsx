import React, { useEffect, useState } from "react";

type Note = {
  id: string;
  title: string;
  subject: string;
  url: string;
  createdAt: string; // ISO
};

type NoteDraft = {
  title: string;
  subject: string;
  file: File | null;
  url: string;
};

const STORAGE_KEY = "campusdao_notes";

export default function Notes() {
  const [draft, setDraft] = useState<NoteDraft>({
    title: "",
    subject: "",
    file: null,
    url: "",
  });
  const [notes, setNotes] = useState<Note[]>([]);
  const [isUploading, setUploading] = useState(false);
  const [isPublishing, setPublishing] = useState(false);
  const [error, setError] = useState<string>("");

  // ---- Load saved notes on mount
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as Note[];
        setNotes(parsed);
      } catch {}
    }
  }, []);

  // ---- Persist notes when they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  }, [notes]);

  // ---- File change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.currentTarget.files?.[0] ?? null;
    setDraft((d) => ({ ...d, file: f }));
  };

  // ---- Upload (mock; replace with your real uploader)
  const handleUpload = async () => {
    try {
      if (!draft.file) {
        setError("Choose a PDF first");
        return;
      }
      setError("");
      setUploading(true);

      // TODO: replace with your storage upload. For now, use a blob URL
      await new Promise((r) => setTimeout(r, 500));
      const url = URL.createObjectURL(draft.file);
      setDraft((d) => ({ ...d, url }));
    } catch (err: any) {
      setError(err?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  // ---- Publish (client-only: add to local list)
  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!draft.title.trim() || !draft.subject.trim()) {
      setError("Title & Subject are required");
      return;
    }
    if (!draft.url) {
      setError("Upload the PDF first to get a link");
      return;
    }

    try {
      setPublishing(true);
      // Create a new note item
      const newNote: Note = {
        id: crypto.randomUUID(),
        title: draft.title.trim(),
        subject: draft.subject.trim(),
        url: draft.url,
        createdAt: new Date().toISOString(),
      };
      setNotes((prev) => [newNote, ...prev]);

      // Reset the draft
      setDraft({ title: "", subject: "", file: null, url: "" });
      alert("Published!");
    } catch (err: any) {
      setError(err?.message || "Publish failed");
    } finally {
      setPublishing(false);
    }
  };

  const canPublish =
    !!draft.title.trim() && !!draft.subject.trim() && !!draft.url && !isPublishing;

  // ---- Remove a note (client-only)
  const removeNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="mx-auto max-w-5xl p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Academic Notes</h1>

      {/* FORM CARD */}
      <form
        onSubmit={handlePublish}
        className="rounded-xl border border-border bg-card text-card-foreground p-4 space-y-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="flex flex-col">
            <label className="text-sm text-muted-foreground mb-1">Title</label>
            <input
              className="h-10 rounded-md border border-border bg-background px-3"
              value={draft.title}
              onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
              placeholder="e.g., Linear Algebra – Unit 2"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm text-muted-foreground mb-1">Subject</label>
            <input
              className="h-10 rounded-md border border-border bg-background px-3"
              value={draft.subject}
              onChange={(e) => setDraft((d) => ({ ...d, subject: e.target.value }))}
              placeholder="e.g., Mathematics"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm text-muted-foreground mb-1">PDF</label>
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="h-10 rounded-md border border-border bg-background px-3 py-1"
            />
            <button
              type="button"
              onClick={handleUpload}
              disabled={!draft.file || isUploading}
              className="mt-2 h-9 rounded-md bg-secondary text-secondary-foreground disabled:opacity-50"
            >
              {isUploading ? "Uploading…" : "Upload"}
            </button>
          </div>

          <button
            type="submit"
            disabled={!canPublish}
            className="h-10 rounded-md bg-primary text-primary-foreground disabled:opacity-50"
            title={!draft.url ? "Upload a PDF first" : "Publish"}
          >
            {isPublishing ? "Publishing…" : "Publish"}
          </button>
        </div>

        {draft.url && (
          <p className="text-sm">
            Link:{" "}
            <a className="text-primary underline" href={draft.url} target="_blank" rel="noreferrer">
              {draft.url}
            </a>
          </p>
        )}

        {error && <p className="text-sm text-destructive">{error}</p>}
      </form>

      {/* LIST CARD */}
      <div className="rounded-xl border border-border bg-card text-card-foreground p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-medium">Published Notes</h2>
          <span className="text-sm text-muted-foreground">{notes.length} total</span>
        </div>

        {notes.length === 0 ? (
          <p className="text-sm text-muted-foreground">No notes yet. Publish one above.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-muted-foreground">
                <tr className="text-left">
                  <th className="py-2 pr-2">Title</th>
                  <th className="py-2 pr-2">Subject</th>
                  <th className="py-2 pr-2">Link</th>
                  <th className="py-2 pr-2">Date</th>
                  <th className="py-2 pr-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {notes.map((n) => (
                  <tr key={n.id} className="border-t border-border">
                    <td className="py-2 pr-2">{n.title}</td>
                    <td className="py-2 pr-2">{n.subject}</td>
                    <td className="py-2 pr-2">
                      <a className="text-primary underline" href={n.url} target="_blank" rel="noreferrer">
                        open
                      </a>
                    </td>
                    <td className="py-2 pr-2">
                      {new Date(n.createdAt).toLocaleString()}
                    </td>
                    <td className="py-2 pr-2">
                      <button
                        onClick={() => removeNote(n.id)}
                        className="h-8 px-3 rounded-md border border-border hover:bg-muted/40"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}