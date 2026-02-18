import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { NoteStore, getUserId, type Note } from "@/lib/store";
import { PdfUploader } from "@/components/PdfUploader";
import { useWallet } from "@solana/wallet-adapter-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { FileText, Download, ExternalLink, Search, Trash2, ArrowBigUp, ArrowBigDown, Edit2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

export default function Notes() {
  const { publicKey } = useWallet();
  const userId = getUserId(publicKey?.toBase58());
  const [notes, setNotes] = useState<Note[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setNotes(NoteStore.all());
  }, []);

  const refreshNotes = () => setNotes([...NoteStore.all()]);

  const filteredNotes = notes.filter(note => 
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
          <UploadNoteDialog userId={userId} onCreated={refreshNotes} />
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <Input 
            placeholder="Search by title or subject..." 
            className="pl-12 h-12 rounded-full border-border/60"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredNotes.map((note) => (
            <NoteCard 
              key={note.id} 
              note={note} 
              userId={userId}
              onUpdate={refreshNotes} 
            />
          ))}
        </div>
      </div>
    </Layout>
  );
}

function NoteCard({ note, userId, onUpdate }: any) {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(note.title);
  const [editSubject, setEditSubject] = useState(note.subject);
  const isOwner = note.authorId === userId;

  const handleVote = (delta: number) => {
    NoteStore.vote(note.id, delta);
    onUpdate();
  };

  const handleDelete = () => {
    if (confirm("Delete this note?")) {
      NoteStore.remove(note.id);
      onUpdate();
      toast({ title: "Deleted" });
    }
  };

  const handleEdit = () => {
    NoteStore.update(note.id, { title: editTitle, subject: editSubject });
    setIsEditing(false);
    onUpdate();
    toast({ title: "Updated" });
  };

  return (
    <motion.div whileHover={{ y: -5 }}>
      <Card className="h-full flex flex-col overflow-hidden border-border/50 group rounded-3xl bg-card">
        <div className="aspect-[4/3] bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center relative p-6">
          <div className="absolute top-4 left-4 bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-muted-foreground shadow-sm">
            {note.subject}
          </div>
          {isOwner && (
            <div className="absolute top-4 right-4 flex gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8 bg-background/50" onClick={() => setIsEditing(true)}><Edit2 className="w-4 h-4" /></Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 bg-background/50 text-destructive" onClick={handleDelete}><Trash2 className="w-4 h-4" /></Button>
            </div>
          )}
          <FileText className="w-16 h-16 text-primary/40 group-hover:scale-110 transition-transform" />
        </div>
        
        <div className="p-6 flex-1 flex flex-col">
          <h3 className="text-lg font-bold font-display leading-tight mb-2 line-clamp-2">{note.title}</h3>
          <p className="text-[10px] text-muted-foreground mb-4">By @{note.authorId.slice(0, 8)}</p>
          
          <div className="flex items-center gap-2 mb-4">
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => handleVote(1)}><ArrowBigUp className="w-5 h-5" /></Button>
            <span className="text-sm font-bold min-w-[20px] text-center">{note.votes}</span>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => handleVote(-1)}><ArrowBigDown className="w-5 h-5" /></Button>
          </div>

          <div className="mt-auto flex gap-2">
            <a href={note.link} target="_blank" rel="noreferrer" className="w-full">
              <Button variant="outline" size="sm" className="w-full rounded-xl">
                <Download className="w-4 h-4 mr-2" /> Download
              </Button>
            </a>
          </div>
        </div>
      </Card>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="rounded-3xl">
          <DialogHeader><DialogTitle>Edit Note</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <Input value={editTitle} onChange={e => setEditTitle(e.target.value)} />
            <Input value={editSubject} onChange={e => setEditSubject(e.target.value)} />
          </div>
          <DialogFooter><Button onClick={handleEdit}>Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}

function UploadNoteDialog({ userId, onCreated }: any) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [link, setLink] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !subject || (!file && !link)) return;

    let finalLink = link;
    if (file) {
      finalLink = URL.createObjectURL(file);
    }

    NoteStore.add({ title, subject, link: finalLink, authorId: userId });
    toast({ title: "Note uploaded" });
    setOpen(false);
    setTitle("");
    setSubject("");
    setLink("");
    setFile(null);
    onCreated();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="rounded-full shadow-lg"><Plus className="w-5 h-5 mr-2" />Upload Notes</Button>
      </DialogTrigger>
      <DialogContent className="rounded-3xl max-w-md">
        <DialogHeader><DialogTitle>Upload Materials</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <Label>PDF File</Label>
            <PdfUploader onSelect={setFile} />
          </div>
          <div className="relative text-center py-2">
            <span className="bg-background px-2 text-xs text-muted-foreground uppercase font-bold relative z-10">Or Provide Link</span>
            <div className="absolute top-1/2 left-0 w-full h-px bg-border" />
          </div>
          <div className="space-y-1">
            <Label>Note URL</Label>
            <Input placeholder="Google Drive / Dropbox / IPFS Link" value={link} onChange={e => setLink(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label>Title</Label>
            <Input placeholder="Note Title" value={title} onChange={e => setTitle(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label>Subject</Label>
            <Input placeholder="Subject" value={subject} onChange={e => setSubject(e.target.value)} />
          </div>
          <Button type="submit" className="w-full">Publish</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
