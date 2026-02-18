import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { SuggestionStore, getUserId, type Suggestion } from "@/lib/store";
import { useWallet } from "@solana/wallet-adapter-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Plus, ThumbsUp, Tag, Clock, User, MessageSquare, Edit2, Trash2, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";

export default function Suggestions() {
  const { publicKey, connected } = useWallet();
  const userId = getUserId(publicKey?.toBase58());
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    setSuggestions(SuggestionStore.all());
  }, []);

  const refreshSuggestions = () => setSuggestions([...SuggestionStore.all()]);

  const filteredSuggestions = suggestions.filter(s => 
    filter === "all" || s.category.toLowerCase() === filter.toLowerCase()
  );

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-display font-bold text-foreground">Campus Suggestions</h1>
            <p className="text-muted-foreground mt-2 text-lg">Vote on proposals to improve campus life.</p>
          </div>
          <CreateSuggestionDialog userId={userId} onCreated={refreshSuggestions} />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {["All", "Academics", "Infrastructure", "Exams", "Canteen", "Other"].map((category) => (
            <button
              key={category}
              onClick={() => setFilter(category.toLowerCase())}
              className={`
                px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all
                ${filter === category.toLowerCase() 
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25" 
                  : "bg-card border border-border hover:border-primary/50 text-muted-foreground hover:text-foreground"}
              `}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
          <AnimatePresence>
            {filteredSuggestions.map((suggestion) => (
              <SuggestionCard 
                key={suggestion.id} 
                suggestion={suggestion} 
                userId={userId} 
                connected={connected}
                onUpdate={refreshSuggestions} 
              />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </Layout>
  );
}

function SuggestionCard({ suggestion, userId, connected, onUpdate }: any) {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(suggestion.title);
  const [editDesc, setEditDesc] = useState(suggestion.description);
  const [replyText, setReplyText] = useState("");
  const isOwner = suggestion.authorId === userId;

  const handleVote = () => {
    SuggestionStore.vote(suggestion.id, 1);
    onUpdate();
  };

  const handleDelete = () => {
    if (confirm("Delete this suggestion?")) {
      SuggestionStore.remove(suggestion.id);
      onUpdate();
      toast({ title: "Deleted" });
    }
  };

  const handleEdit = () => {
    SuggestionStore.update(suggestion.id, { title: editTitle, description: editDesc });
    setIsEditing(false);
    onUpdate();
    toast({ title: "Updated" });
  };

  const handleReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText) return;
    SuggestionStore.reply(suggestion.id, { text: replyText, authorId: userId });
    setReplyText("");
    onUpdate();
  };

  const handleSolanaPublish = async () => {
    toast({ title: "Solana Transaction Simulation", description: "Suggestion data hash published to Devnet." });
  };

  return (
    <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Card className="h-full p-6 flex flex-col hover:shadow-xl transition-all border-border/50 rounded-3xl overflow-hidden relative">
        <div className="flex-1 space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded">
                {suggestion.category}
              </span>
              <h3 className="text-xl font-bold font-display">{suggestion.title}</h3>
            </div>
            {isOwner && (
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)}><Edit2 className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon" onClick={handleDelete} className="text-destructive"><Trash2 className="w-4 h-4" /></Button>
              </div>
            )}
          </div>
          <p className="text-muted-foreground leading-relaxed">{suggestion.description}</p>
          
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="bg-muted px-2 py-1 rounded">@{suggestion.authorId.slice(0, 8)}</span>
            <span>{formatDistanceToNow(new Date(suggestion.createdAt), { addSuffix: true })}</span>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-border/50 space-y-4">
          <div className="flex items-center justify-between">
            <Button variant="outline" size="sm" onClick={handleVote} className="rounded-full">
              <ThumbsUp className="w-4 h-4 mr-2" />
              {suggestion.votes} Votes
            </Button>
            {connected && (
              <Button size="sm" variant="outline" onClick={handleSolanaPublish} className="text-[10px] uppercase font-bold">
                Publish on Solana
              </Button>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <MessageSquare className="w-4 h-4" />
              Replies ({suggestion.replies.length})
            </div>
            <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
              {suggestion.replies.map((reply: any) => (
                <div key={reply.id} className="text-sm bg-muted/30 p-2 rounded-xl relative group">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-bold">@{reply.authorId.slice(0, 8)}</span>
                    {reply.authorId === userId && (
                      <button onClick={() => { SuggestionStore.removeReply(suggestion.id, reply.id); onUpdate(); }} className="text-destructive text-[10px] hover:underline">Delete</button>
                    )}
                  </div>
                  {reply.text}
                </div>
              ))}
            </div>
            <form onSubmit={handleReply} className="flex gap-2">
              <Input 
                placeholder="Write a reply..." 
                value={replyText} 
                onChange={e => setReplyText(e.target.value)}
                className="rounded-full h-8 text-xs"
              />
              <Button type="submit" size="icon" className="h-8 w-8 rounded-full shrink-0"><Send className="w-3 h-3" /></Button>
            </form>
          </div>
        </div>
      </Card>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="rounded-3xl">
          <DialogHeader><DialogTitle>Edit Suggestion</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <Input value={editTitle} onChange={e => setEditTitle(e.target.value)} />
            <Textarea value={editDesc} onChange={e => setEditDesc(e.target.value)} />
          </div>
          <DialogFooter>
            <Button onClick={handleEdit}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}

function CreateSuggestionDialog({ userId, onCreated }: any) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<any>("academics");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.length < 3) return;
    SuggestionStore.add({ title, description, category, authorId: userId });
    toast({ title: "Suggestion posted" });
    setOpen(false);
    setTitle("");
    setDescription("");
    onCreated();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="rounded-full shadow-lg"><Plus className="w-5 h-5 mr-2" />New Suggestion</Button>
      </DialogTrigger>
      <DialogContent className="rounded-3xl">
        <DialogHeader><DialogTitle>Submit Proposal</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="academics">Academics</SelectItem>
              <SelectItem value="infrastructure">Infrastructure</SelectItem>
              <SelectItem value="exams">Exams</SelectItem>
              <SelectItem value="canteen">Canteen</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          <Textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
          <Button type="submit" className="w-full">Submit</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
