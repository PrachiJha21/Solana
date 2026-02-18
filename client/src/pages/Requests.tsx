import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { RequestStore, getUserId, type NoteRequest } from "@/lib/store";
import { useWallet } from "@solana/wallet-adapter-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { HelpCircle, MessageSquare, CheckCircle2, Edit2, Trash2, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";

export default function Requests() {
  const { publicKey } = useWallet();
  const userId = getUserId(publicKey?.toBase58());
  const [requests, setRequests] = useState<NoteRequest[]>([]);

  useEffect(() => {
    setRequests(RequestStore.all());
  }, []);

  const refreshRequests = () => setRequests([...RequestStore.all()]);

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-display font-bold text-foreground">Note Requests</h1>
            <p className="text-muted-foreground mt-2 text-lg">Ask the community for specific study materials.</p>
          </div>
          <CreateRequestDialog userId={userId} onCreated={refreshRequests} />
        </div>

        <div className="space-y-4">
          {requests.map((request) => (
            <RequestCard 
              key={request.id} 
              request={request} 
              userId={userId} 
              onUpdate={refreshRequests} 
            />
          ))}
          {requests.length === 0 && (
            <div className="py-20 text-center bg-card rounded-3xl border border-dashed border-border">
              <HelpCircle className="w-10 h-10 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-xl font-bold">No requests found</h3>
              <p className="text-muted-foreground">Be the first to ask for help!</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

function RequestCard({ request, userId, onUpdate }: any) {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editSubject, setEditSubject] = useState(request.subject);
  const [editDetails, setEditDetails] = useState(request.details || "");
  const isOwner = request.requesterId === userId;

  const handleToggleFulfilled = () => {
    RequestStore.fulfill(request.id, !request.fulfilled);
    onUpdate();
    toast({ title: request.fulfilled ? "Request reopened" : "Request marked as fulfilled" });
  };

  const handleDelete = () => {
    if (confirm("Delete this request?")) {
      RequestStore.remove(request.id);
      onUpdate();
      toast({ title: "Deleted" });
    }
  };

  const handleEdit = () => {
    RequestStore.update(request.id, { subject: editSubject, details: editDetails });
    setIsEditing(false);
    onUpdate();
    toast({ title: "Updated" });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} layout>
      <Card className={`p-6 md:p-8 rounded-3xl border-border/50 transition-all ${request.fulfilled ? 'opacity-60 bg-muted/20' : 'hover:shadow-lg'}`}>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider ${request.fulfilled ? 'bg-muted text-muted-foreground' : 'bg-primary/10 text-primary'}`}>
                    {request.subject}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}
                  </span>
                </div>
                <p className={`text-lg font-medium leading-relaxed ${request.fulfilled ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                  {request.details || "No further details provided."}
                </p>
                <p className="text-xs text-muted-foreground">Requested by @{request.requesterId.slice(0, 8)}</p>
              </div>
              {isOwner && (
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)}><Edit2 className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={handleDelete} className="text-destructive"><Trash2 className="w-4 h-4" /></Button>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center md:border-l border-border/50 md:pl-6 shrink-0">
            {isOwner ? (
              <Button 
                onClick={handleToggleFulfilled}
                variant={request.fulfilled ? "outline" : "default"}
                className="rounded-xl h-12 px-6 w-full md:w-auto"
              >
                {request.fulfilled ? "Reopen Request" : "Mark Fulfilled"}
              </Button>
            ) : (
              <Button variant="outline" className="rounded-xl h-12 px-6 w-full md:w-auto" disabled={request.fulfilled}>
                <MessageSquare className="w-4 h-4 mr-2" /> {request.fulfilled ? "Fulfilled" : "I can help!"}
              </Button>
            )}
          </div>
        </div>
      </Card>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="rounded-3xl">
          <DialogHeader><DialogTitle>Edit Request</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <Input value={editSubject} onChange={e => setEditSubject(e.target.value)} />
            <Textarea value={editDetails} onChange={e => setEditDetails(e.target.value)} />
          </div>
          <DialogFooter><Button onClick={handleEdit}>Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}

function CreateRequestDialog({ userId, onCreated }: any) {
  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [details, setDetails] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject) return;
    RequestStore.add({ subject, details, requesterId: userId });
    toast({ title: "Request posted" });
    setOpen(false);
    setSubject("");
    setDetails("");
    onCreated();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="rounded-full shadow-lg"><Plus className="w-5 h-5 mr-2" />New Request</Button>
      </DialogTrigger>
      <DialogContent className="rounded-3xl">
        <DialogHeader><DialogTitle>Request Materials</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input placeholder="Subject" value={subject} onChange={e => setSubject(e.target.value)} />
          <Textarea placeholder="Details (optional)" value={details} onChange={e => setDetails(e.target.value)} />
          <Button type="submit" className="w-full">Post Request</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
