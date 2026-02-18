import { Connection, clusterApiUrl } from "@solana/web3.js";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Database } from "lucide-react";

export function SolanaStatus() {
  const [slot, setSlot] = useState<number | null>(null);
  const [blockhash, setBlockhash] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
    
    const fetchData = async () => {
      try {
        const [currentSlot, latestBlockhash] = await Promise.all([
          connection.getSlot(),
          connection.getLatestBlockhash()
        ]);
        setSlot(currentSlot);
        setBlockhash(latestBlockhash.blockhash);
      } catch (error) {
        console.error("Failed to fetch Solana status:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 10000); // Update every 10s
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="bg-primary/5 border-primary/20 rounded-2xl overflow-hidden shadow-sm">
      <CardHeader className="pb-2 pt-4 px-4">
        <CardTitle className="text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-2">
          <Activity className="w-3 h-3" />
          Solana Devnet Status
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        {loading ? (
          <div className="h-10 flex items-center justify-center">
            <div className="animate-pulse flex space-x-2">
              <div className="h-1.5 w-1.5 bg-primary rounded-full"></div>
              <div className="h-1.5 w-1.5 bg-primary rounded-full"></div>
              <div className="h-1.5 w-1.5 bg-primary rounded-full"></div>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-muted-foreground font-medium uppercase">Current Slot</span>
              <span className="text-xs font-mono font-bold text-foreground">{slot?.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-[10px] text-muted-foreground font-medium uppercase">Latest Hash</span>
              <span className="text-[10px] font-mono truncate text-muted-foreground max-w-[120px]">{blockhash}</span>
            </div>
            <div className="pt-1 flex items-center gap-1.5 text-[9px] font-bold text-green-600 uppercase">
              <Database className="w-2.5 h-2.5" />
              Live Connection Established
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
