import { useState } from "react";
import { Layout } from "@/components/Layout";
import { useRequests, useCreateRequest } from "@/hooks/use-requests";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { HelpCircle, MessageSquare, CheckCircle2, Circle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import type { InsertRequest } from "@shared/schema";

export default function Requests() {
  const { data: requests, isLoading } = useRequests();

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-display font-bold text-foreground">Note Requests</h1>
            <p className="text-muted-foreground mt-2 text-lg">Ask the community for specific study materials.</p>
          </div>
          <CreateRequestDialog />
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 rounded-3xl bg-muted/20 animate-pulse border border-border/50" />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {requests?.map((request) => (
              <RequestCard key={request.id} request={request} />
            ))}
            
            {requests?.length === 0 && (
              <div className="py-20 text-center bg-card rounded-3xl border border-border/50">
                <div className="w-20 h-20 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <HelpCircle className="w-10 h-10 text-muted-foreground/50" />
                </div>
                <h3 className="text-xl font-bold mb-2">No active requests</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Looking for something? Create a request!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}

function RequestCard({ request }: { request: any }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      layout
    >
      <Card className="p-6 md:p-8 rounded-3xl border-border/50 hover:border-primary/20 hover:shadow-lg transition-all duration-300">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full uppercase tracking-wider">
                    {request.subject}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}
                  </span>
                </div>
                <p className="text-lg text-foreground font-medium leading-relaxed">
                  {request.description}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 mr-2" />
                <span>{request.author.slice(0, 4)}...{request.author.slice(-4)}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center md:border-l border-border/50 md:pl-6">
            <Button 
              className={`w-full md:w-auto rounded-xl h-12 px-6 ${request.isFulfilled ? 'bg-green-500/10 text-green-600 hover:bg-green-500/20' : ''}`}
              variant={request.isFulfilled ? "ghost" : "default"}
              disabled={request.isFulfilled}
            >
              {request.isFulfilled ? (
                <>
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  Fulfilled
                </>
              ) : (
                <>
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Upload Response
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

function CreateRequestDialog() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const createRequest = useCreateRequest();
  
  const [formData, setFormData] = useState<Partial<InsertRequest>>({
    subject: "",
    description: "",
    author: "8xM...3k9L", // Mock wallet
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const subject = formData.subject?.trim() || "";
    const description = formData.description?.trim() || "";

    // Validation
    if (subject.length < 2 || subject.length > 50) {
      toast({ title: "Invalid Subject", description: "Subject must be 2-50 characters.", variant: "destructive" });
      return;
    }
    if (description.length < 10 || description.length > 500) {
      toast({ title: "Invalid Description", description: "Description must be 10-500 characters.", variant: "destructive" });
      return;
    }

    const sanitize = (str: string) => str.replace(/<[^>]*>?/gm, '');
    const sanitizedData = {
      ...formData,
      subject: sanitize(subject),
      description: sanitize(description),
    };

    try {
      console.log("Simulating transaction for request...");
      await createRequest.mutateAsync(sanitizedData as InsertRequest);
      toast({
        title: "Request Posted",
        description: "Community members can now fulfill your request.",
      });
      setOpen(false);
      setFormData({ ...formData, subject: "", description: "" });
    } catch (error: any) {
      toast({
        title: "Transaction Failed",
        description: error.message || "Failed to create request.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="rounded-full shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30">
          <HelpCircle className="w-5 h-5 mr-2" />
          Request Help
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] rounded-3xl p-8">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-2xl font-display font-bold">Request Materials</DialogTitle>
          <DialogDescription>
            What do you need help with?
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input 
              id="subject"
              placeholder="e.g., Linear Algebra"
              value={formData.subject}
              onChange={e => setFormData({...formData, subject: e.target.value})}
              className="rounded-xl h-12"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">What do you need?</Label>
            <Textarea 
              id="description"
              placeholder="e.g., Looking for past year exam papers from 2023..."
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              className="rounded-xl min-h-[120px] resize-none"
              required
            />
          </div>

          <div className="pt-2">
            <Button 
              type="submit" 
              className="w-full h-12 text-lg rounded-xl"
              disabled={createRequest.isPending}
            >
              {createRequest.isPending ? "Posting..." : "Post Request"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
