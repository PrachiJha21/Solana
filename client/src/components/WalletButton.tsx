import { useState } from "react";
import { Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";

export function WalletButton() {
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState<string>("");

  const connect = () => {
    // Mock connection
    setConnected(true);
    setAddress("8x...3k9L");
  };

  const disconnect = () => {
    setConnected(false);
    setAddress("");
  };

  if (connected) {
    return (
      <Button 
        variant="outline" 
        onClick={disconnect}
        className="font-mono bg-primary/5 border-primary/20 text-primary hover:bg-primary/10 transition-all duration-300"
      >
        <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse" />
        {address}
      </Button>
    );
  }

  return (
    <Button 
      onClick={connect}
      className="bg-black text-white hover:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300"
    >
      <Wallet className="w-4 h-4 mr-2" />
      Connect Wallet
    </Button>
  );
}
