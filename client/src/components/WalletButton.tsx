// client/src/components/ui/WalletButton.tsx
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";

export default function WalletButton() {
  const { connected, publicKey, disconnect } = useWallet();
  const { setVisible } = useWalletModal();

  if (connected) {
    const short =
      publicKey?.toBase58().slice(0, 4) + "…" + publicKey?.toBase58().slice(-4);
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">{short}</span>
        <button
          className="rounded-md border px-3 py-1 text-sm hover:bg-accent"
          onClick={() => disconnect()}
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      className="rounded-md bg-primary px-3 py-1 text-sm text-primary-foreground hover:opacity-90"
      onClick={() => setVisible(true)}
    >
      Connect Wallet
    </button>
  );
}
