import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { Wallet, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

export default function WalletButton() {
  const { connected, publicKey, disconnect, select, wallet } = useWallet();
  const { setVisible } = useWalletModal();
  const { toast } = useToast();

  useEffect(() => {
    if (connected && publicKey) {
      toast({
        title: "Wallet Connected",
        description: `Authenticated as ${publicKey.toBase58().slice(0, 4)}...${publicKey.toBase58().slice(-4)}`,
      });
    }
  }, [connected, publicKey, toast]);

  const handleConnect = () => {
    setVisible(true);
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
      toast({
        title: "Wallet Disconnected",
        description: "Your session has ended.",
      });
    } catch (error) {
      console.error("Disconnect error", error);
    }
  };

  if (connected && publicKey) {
    const address = publicKey.toBase58();
    const shortAddress = `${address.slice(0, 4)}...${address.slice(-4)}`;
    
    return (
      <Button 
        variant="outline" 
        onClick={handleDisconnect}
        className="font-mono bg-primary/5 border-primary/20 text-primary hover:bg-primary/10 transition-all duration-300"
      >
        <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse" />
        {shortAddress}
        <LogOut className="w-3 h-3 ml-2 opacity-50" />
      </Button>
    );
  }

  return (
    <Button 
      onClick={handleConnect}
      className="bg-black text-white hover:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300"
    >
      <Wallet className="w-4 h-4 mr-2" />
      Connect Wallet
    </Button>
  );
}
