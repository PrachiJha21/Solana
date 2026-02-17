import { useState } from "react";
import Layout from "@/components/Layout";
import { useSuggestions, useCreateSuggestion } from "@/hooks/use-suggestions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Plus, ThumbsUp, Tag, Clock, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import type { InsertSuggestion } from "@shared/schema";

export default function Suggestions() {
  const { data: suggestions, isLoading } = useSuggestions();
  const [filter, setFilter] = useState("all");

  const filteredSuggestions = suggestions?.filter(s => 
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
          <CreateSuggestionDialog />
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {["All", "Academics", "Infrastructure", "Events", "Cafeteria", "Other"].map((category) => (
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

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 rounded-3xl bg-muted/20 animate-pulse border border-border/50" />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence>
              {filteredSuggestions?.map((suggestion) => (
                <SuggestionCard key={suggestion.id} suggestion={suggestion} />
              ))}
            </AnimatePresence>
            
            {filteredSuggestions?.length === 0 && (
              <div className="col-span-full py-20 text-center">
                <div className="w-20 h-20 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Tag className="w-10 h-10 text-muted-foreground/50" />
                </div>
                <h3 className="text-xl font-bold mb-2">No suggestions found</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Be the first to submit a suggestion for this category!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}

function SuggestionCard({ suggestion }: { suggestion: any }) {
  // Mock voting state for UI
  const [votes, setVotes] = useState(suggestion.voteCount || 0);
  const [hasVoted, setHasVoted] = useState(false);

  const handleVote = () => {
    if (hasVoted) {
      setVotes(votes - 1);
      setHasVoted(false);
    } else {
      setVotes(votes + 1);
      setHasVoted(true);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="h-full p-6 flex flex-col hover:shadow-xl transition-all duration-300 border-border/50 hover:border-primary/20 group rounded-3xl overflow-hidden relative">
        <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="bg-primary/5 text-primary text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wide">
            {suggestion.category}
          </div>
        </div>

        <div className="flex-1 space-y-4">
          <div className="flex items-start justify-between">
            <h3 className="text-xl font-bold font-display leading-tight group-hover:text-primary transition-colors">
              {suggestion.title}
            </h3>
          </div>
          <p className="text-muted-foreground line-clamp-3 leading-relaxed">
            {suggestion.description}
          </p>
          
          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground pt-2">
            <div className="flex items-center bg-muted/30 px-2 py-1 rounded-md">
              <User className="w-3 h-3 mr-1" />
              {suggestion.author.slice(0, 4)}...{suggestion.author.slice(-4)}
            </div>
            <div className="flex items-center bg-muted/30 px-2 py-1 rounded-md">
              <Clock className="w-3 h-3 mr-1" />
              {formatDistanceToNow(new Date(suggestion.createdAt), { addSuffix: true })}
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-border/50 flex items-center justify-between">
          <Button 
            variant={hasVoted ? "default" : "outline"} 
            size="sm"
            onClick={handleVote}
            className={`rounded-full px-4 transition-all ${hasVoted ? 'bg-primary hover:bg-primary/90' : 'hover:border-primary/50 hover:text-primary'}`}
          >
            <ThumbsUp className={`w-4 h-4 mr-2 ${hasVoted ? 'fill-current' : ''}`} />
            {votes} Votes
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}

function CreateSuggestionDialog() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const createSuggestion = useCreateSuggestion();
  
  const [formData, setFormData] = useState<Partial<InsertSuggestion>>({
    title: "",
    description: "",
    category: "Academics",
    author: "8xM...3k9L", // Mock wallet
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Frontend validation
    const title = formData.title?.trim() || "";
    const description = formData.description?.trim() || "";
    
    if (title.length < 3 || title.length > 100) {
      toast({ title: "Invalid Title", description: "Title must be 3-100 characters.", variant: "destructive" });
      return;
    }
    if (description.length < 10 || description.length > 500) {
      toast({ title: "Invalid Description", description: "Description must be 10-500 characters.", variant: "destructive" });
      return;
    }
    if (!formData.category) {
      toast({ title: "Invalid Category", description: "Please select a category.", variant: "destructive" });
      return;
    }

    // Basic sanitization to prevent simple script injection
    const sanitize = (str: string) => str.replace(/<[^>]*>?/gm, '');
    const sanitizedData = {
      ...formData,
      title: sanitize(title),
      description: sanitize(description),
    };

    try {
      // Simulation placeholder (In a real Solana app, we'd use connection.simulateTransaction)
      console.log("Simulating transaction for suggestion...");
      
      await createSuggestion.mutateAsync(sanitizedData as InsertSuggestion);
      toast({
        title: "Suggestion Submitted",
        description: "Your proposal has been recorded on-chain.",
      });
      setOpen(false);
      setFormData({ ...formData, title: "", description: "" });
    } catch (error: any) {
      toast({
        title: "Transaction Failed",
        description: error.message || "Failed to submit suggestion.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="rounded-full shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30">
          <Plus className="w-5 h-5 mr-2" />
          New Suggestion
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] rounded-3xl p-8">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-2xl font-display font-bold">Submit Proposal</DialogTitle>
          <DialogDescription>
            Share your idea with the campus community.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input 
              id="title"
              placeholder="e.g., Extend Library Hours"
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
              className="rounded-xl h-12"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select 
              value={formData.category} 
              onValueChange={val => setFormData({...formData, category: val})}
            >
              <SelectTrigger className="rounded-xl h-12">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Academics">Academics</SelectItem>
                <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                <SelectItem value="Events">Events</SelectItem>
                <SelectItem value="Cafeteria">Cafeteria</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description"
              placeholder="Describe your suggestion in detail..."
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
              disabled={createSuggestion.isPending}
            >
              {createSuggestion.isPending ? "Submitting..." : "Submit Proposal"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
