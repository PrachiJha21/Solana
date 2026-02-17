import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import { clusterApiUrl } from "@solana/web3.js";
import { useMemo, useEffect } from "react";
import "@solana/wallet-adapter-react-ui/styles.css";

import Home from "@/pages/Home";
import Suggestions from "@/pages/Suggestions";
import Notes from "@/pages/Notes";
import Requests from "@/pages/Requests";
import NotFound from "@/pages/not-found";

/* ---------- Router ---------- */
function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/suggestions" component={Suggestions} />
      <Route path="/notes" component={Notes} />
      <Route path="/requests" component={Requests} />
      <Route component={NotFound} />
    </Switch>
  );
}

/* ---------- Optional: Wallet connect/disconnect logs (helps debug) ---------- */
// import { useWallet } from "@solana/wallet-adapter-react";
// function WalletEvents() {
//   const { wallet, publicKey } = useWallet();
//   useEffect(() => {
//     if (!wallet) return;
//     const onConnect = () => console.log("Wallet connected", publicKey?.toBase58());
//     const onDisconnect = () => console.log("Wallet disconnected");
//     wallet.adapter.on("connect", onConnect);
//     wallet.adapter.on("disconnect", onDisconnect);
//     return () => {
//       wallet.adapter.off("connect", onConnect);
//       wallet.adapter.off("disconnect", onDisconnect);
//     };
//   }, [wallet, publicKey]);
//   return null;
// }

function App() {
  const network = clusterApiUrl("devnet");
  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  // One-time cleanup to prevent silent reconnects from cached wallet
  useEffect(() => {
    try {
      localStorage.removeItem("walletName");
      localStorage.removeItem("walletAdapter");
      // If your template used different keys, you can nuke session storage too:
      // sessionStorage.clear();
    } catch {}
  }, []);

  return (
    <ConnectionProvider endpoint={network}>
      {/* IMPORTANT: disable autoConnect */}
      <WalletProvider wallets={wallets} autoConnect={false}>
        <WalletModalProvider>
          <QueryClientProvider client={queryClient}>
            <TooltipProvider>
              {/* <WalletEvents /> */}
              <Router />
              <Toaster />
            </TooltipProvider>
          </QueryClientProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;