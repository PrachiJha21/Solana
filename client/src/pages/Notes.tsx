import { useState } from "react";
import { Layout } from "@/components/Layout";
import { useNotes, useCreateNote } from "@/hooks/use-notes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Upload, FileText, Download, ExternalLink, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import type { InsertNote } from "@shared/schema";

export default function Notes() {
  const { data: notes, isLoading } = useNotes();
  const [search, setSearch] = useState("");

  const filteredNotes = notes?.filter(note => 
    note.title.toLowerCase().includes(search.toLowerCase()) ||
    note.subject.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-display font-bold text-foreground">Academic Notes</h1>
            <p className="text-muted-foreground mt-2 text-lg">Decentralized library of student resources.</p>
          </div>
          <UploadNoteDialog />
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <Input 
            placeholder="Search by title or subject..." 
            className="pl-12 h-12 rounded-full border-border/60 focus:border-primary bg-card shadow-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="aspect-[3/4] rounded-3xl bg-muted/20 animate-pulse border border-border/50" />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredNotes?.map((note) => (
              <NoteCard key={note.id} note={note} />
            ))}
            
            {filteredNotes?.length === 0 && (
              <div className="col-span-full py-20 text-center">
                <div className="w-20 h-20 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FileText className="w-10 h-10 text-muted-foreground/50" />
                </div>
                <h3 className="text-xl font-bold mb-2">No notes found</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Try a different search term or upload the first note!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}

function NoteCard({ note }: { note: any }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Card className="h-full flex flex-col overflow-hidden hover:shadow-xl transition-all duration-300 border-border/50 group rounded-3xl bg-card">
        <div className="aspect-[4/3] bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center relative group-hover:from-primary/10 group-hover:to-accent/10 transition-colors p-6">
          <div className="absolute top-4 left-4 bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-muted-foreground shadow-sm">
            {note.subject}
          </div>
          <FileText className="w-16 h-16 text-primary/40 group-hover:scale-110 group-hover:text-primary transition-all duration-300" />
        </div>
        
        <div className="p-6 flex-1 flex flex-col">
          <h3 className="text-lg font-bold font-display leading-tight mb-2 line-clamp-2" title={note.title}>
            {note.title}
          </h3>
          <p className="text-xs text-muted-foreground mb-4">
            Uploaded by {note.author.slice(0, 4)}...{note.author.slice(-4)}
          </p>
          
          <div className="mt-auto pt-4 border-t border-border/50 flex gap-2">
            <Button variant="outline" size="sm" className="w-full rounded-xl hover:text-primary hover:border-primary/50 group/btn">
              <Download className="w-4 h-4 mr-2 group-hover/btn:translate-y-0.5 transition-transform" />
              Download
            </Button>
            <Button variant="ghost" size="icon" className="rounded-xl shrink-0" title="View on IPFS">
              <ExternalLink className="w-4 h-4 text-muted-foreground" />
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

function UploadNoteDialog() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const createNote = useCreateNote();
  
  const [formData, setFormData] = useState<Partial<InsertNote>>({
    title: "",
    subject: "",
    ipfsHash: "QmHash...", // Mock hash
    author: "8xM...3k9L", // Mock wallet
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.subject) return;

    try {
      await createNote.mutateAsync(formData as InsertNote);
      toast({
        title: "Note Uploaded",
        description: "Metadata stored on Solana. Files on IPFS.",
      });
      setOpen(false);
      setFormData({ ...formData, title: "", subject: "" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload note.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="rounded-full shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30">
          <Upload className="w-5 h-5 mr-2" />
          Upload Notes
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] rounded-3xl p-8">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-2xl font-display font-bold">Upload Materials</DialogTitle>
          <DialogDescription>
            Files are stored permanently on IPFS.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="border-2 border-dashed border-border rounded-2xl p-8 flex flex-col items-center justify-center text-center hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Upload className="w-6 h-6 text-primary" />
            </div>
            <p className="font-medium text-foreground">Click to select PDF</p>
            <p className="text-sm text-muted-foreground mt-1">or drag and drop here</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input 
              id="title"
              placeholder="e.g., Physics 101 Lecture Notes"
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
              className="rounded-xl h-12"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input 
              id="subject"
              placeholder="e.g., Physics"
              value={formData.subject}
              onChange={e => setFormData({...formData, subject: e.target.value})}
              className="rounded-xl h-12"
              required
            />
          </div>

          <div className="pt-2">
            <Button 
              type="submit" 
              className="w-full h-12 text-lg rounded-xl"
              disabled={createNote.isPending}
            >
              {createNote.isPending ? "Uploading..." : "Publish to IPFS"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
