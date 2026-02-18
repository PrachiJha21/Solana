import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { ThreadStore, getUserId, type Thread } from "@/lib/store";
import { useWallet } from "@solana/wallet-adapter-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { MessageSquare, Send, Trash2, Edit2, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

export default function Discussion() {
  const { publicKey } = useWallet();
  const userId = getUserId(publicKey?.toBase58());
  const [threads, setThreads] = useState<Thread[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    setThreads(ThreadStore.all());
  }, []);

  const refreshThreads = () => setThreads([...ThreadStore.all()]);

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-display font-bold text-foreground">Academic Discussion Hub</h1>
            <p className="text-muted-foreground mt-2 text-lg">Discuss lectures, research, and exams with peers.</p>
          </div>
          <CreateThreadDialog userId={userId} onCreated={refreshThreads} />
        </div>

        <div className="space-y-6">
          {threads.length === 0 ? (
            <div className="text-center py-20 bg-card rounded-3xl border border-dashed border-border">
              <MessageCircle className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-xl font-semibold">No discussions yet</h3>
              <p className="text-muted-foreground">Start a thread to begin the academic conversation.</p>
            </div>
          ) : (
            threads.map((thread) => (
              <ThreadCard 
                key={thread.id} 
                thread={thread} 
                userId={userId} 
                onUpdate={refreshThreads} 
              />
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}

function CreateThreadDialog({ userId, onCreated }: { userId: string, onCreated: () => void }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.length < 3 || title.length > 100) {
      toast({ title: "Error", description: "Title must be 3-100 chars.", variant: "destructive" });
      return;
    }
    if (body.length < 10 || body.length > 600) {
      toast({ title: "Error", description: "Body must be 10-600 chars.", variant: "destructive" });
      return;
    }

    ThreadStore.add({ title, body, authorId: userId });
    toast({ title: "Thread created", description: "Your discussion has been posted." });
    setOpen(false);
    setTitle("");
    setBody("");
    onCreated();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="rounded-full shadow-lg">
          <MessageSquare className="w-5 h-5 mr-2" />
          Start Discussion
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] rounded-3xl">
        <DialogHeader>
          <DialogTitle>New Discussion Thread</DialogTitle>
          <DialogDescription>Start a conversation about your academics.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Thread Title</Label>
            <Input 
              id="title" 
              placeholder="e.g., Doubts about Midterm Physics Chapter 4" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="body">Body Content</Label>
            <Textarea 
              id="body" 
              placeholder="Explain your topic or question in detail..." 
              className="min-h-[150px] resize-none"
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full">Post Thread</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function ThreadCard({ thread, userId, onUpdate }: { thread: Thread, userId: string, onUpdate: () => void }) {
  const [replyText, setReplyText] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(thread.title);
  const [editBody, setEditBody] = useState(thread.body);
  const { toast } = useToast();

  const handleReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (replyText.length < 1 || replyText.length > 300) {
      toast({ title: "Error", description: "Reply must be 1-300 chars.", variant: "destructive" });
      return;
    }
    ThreadStore.reply(thread.id, { text: replyText, authorId: userId });
    setReplyText("");
    onUpdate();
  };

  const handleEdit = () => {
    ThreadStore.update(thread.id, { title: editTitle, body: editBody });
    setIsEditing(false);
    onUpdate();
    toast({ title: "Thread updated" });
  };

  const handleDelete = () => {
    if (confirm("Delete this thread?")) {
      ThreadStore.remove(thread.id);
      onUpdate();
      toast({ title: "Thread deleted" });
    }
  };

  const isOwner = thread.authorId === userId;

  return (
    <Card className="rounded-3xl border-border/50 overflow-hidden">
      <CardHeader className="flex flex-row items-start justify-between">
        <div className="space-y-1">
          <CardTitle className="text-2xl font-display">{thread.title}</CardTitle>
          <div className="flex items-center text-xs text-muted-foreground gap-2">
            <span className="bg-muted px-2 py-0.5 rounded">@{thread.authorId.slice(0, 8)}</span>
            <span>{formatDistanceToNow(new Date(thread.createdAt), { addSuffix: true })}</span>
          </div>
        </div>
        {isOwner && (
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)}><Edit2 className="w-4 h-4" /></Button>
            <Button variant="ghost" size="icon" onClick={handleDelete} className="text-destructive"><Trash2 className="w-4 h-4" /></Button>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <p className="text-foreground leading-relaxed whitespace-pre-wrap">{thread.body}</p>
        
        <div className="mt-8 space-y-4">
          <h4 className="text-sm font-semibold flex items-center gap-2">
            <MessageCircle className="w-4 h-4" />
            Replies ({thread.replies.length})
          </h4>
          <div className="space-y-4 pl-4 border-l-2 border-border/50">
            {thread.replies.map((reply) => (
              <div key={reply.id} className="space-y-1">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-bold">@{reply.authorId.slice(0, 8)}</span>
                  <span className="text-muted-foreground">{formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}</span>
                  {reply.authorId === userId && (
                    <button 
                      onClick={() => { ThreadStore.removeReply(thread.id, reply.id); onUpdate(); }}
                      className="text-destructive hover:underline ml-auto"
                    >
                      Delete
                    </button>
                  )}
                </div>
                <p className="text-sm bg-muted/30 p-3 rounded-2xl">{reply.text}</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-muted/10 border-t border-border/50 p-4">
        <form onSubmit={handleReply} className="flex gap-2 w-full">
          <Input 
            placeholder="Write a reply..." 
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            className="rounded-full bg-background"
          />
          <Button type="submit" size="icon" className="rounded-full shrink-0"><Send className="w-4 h-4" /></Button>
        </form>
      </CardFooter>

      {/* Edit Dialog */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="rounded-3xl">
          <DialogHeader><DialogTitle>Edit Thread</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Body</Label>
              <Textarea className="min-h-[150px]" value={editBody} onChange={(e) => setEditBody(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
            <Button onClick={handleEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
