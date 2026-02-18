import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function WalletButton() {
  const { connected, publicKey, disconnect } = useWallet();
  const { setVisible } = useWalletModal();

  if (connected && publicKey) {
    const address = publicKey.toBase58();
    const shortAddress = `${address.slice(0, 4)}...${address.slice(-4)}`;
    
    return (
      <Button 
        variant="outline" 
        onClick={() => disconnect()}
        className="font-mono bg-primary/5 border-primary/20 text-primary hover:bg-primary/10 transition-all duration-300"
      >
        <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse" />
        {shortAddress}
      </Button>
    );
  }

  return (
    <Button 
      onClick={() => setVisible(true)}
      className="bg-black text-white hover:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300"
    >
      <Wallet className="w-4 h-4 mr-2" />
      Connect Wallet
    </Button>
  );
}
