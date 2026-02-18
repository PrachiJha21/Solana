import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import { clusterApiUrl } from "@solana/web3.js";
import { useMemo } from "react";
import "@solana/wallet-adapter-react-ui/styles.css";

import Home from "@/pages/Home";
import Suggestions from "@/pages/Suggestions";
import Notes from "@/pages/Notes";
import Requests from "@/pages/Requests";
import Discussion from "@/pages/Discussion";
import NotFound from "@/pages/not-found";

/* ---------- Router ---------- */
function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/suggestions" component={Suggestions} />
      <Route path="/notes" component={Notes} />
      <Route path="/requests" component={Requests} />
      <Route path="/discussion" component={Discussion} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const network = clusterApiUrl("devnet");
  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  return (
    <ConnectionProvider endpoint={network}>
      <WalletProvider wallets={wallets} autoConnect={true}>
        <WalletModalProvider>
          <QueryClientProvider client={queryClient}>
            <TooltipProvider>
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