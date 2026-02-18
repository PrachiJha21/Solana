import * as React from "react";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavLink,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import WalletButton from "./WalletButton";

type LayoutProps = {
  children: React.ReactNode;
  className?: string;
};
export function Layout({ children, className }: LayoutProps) {
  return (
    <div className={cn("min-h-screen flex flex-col", className)}>
      {/* Top Nav */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/70 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          {/* Left: brand */}
          <div className="flex items-center gap-3">
            <span className="font-semibold text-lg">CampusDAO</span>
          </div>

          {/* Center: nav menu */}
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavLink href="/">Home</NavLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavLink href="/suggestions">Suggestions</NavLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavLink href="/notes">Notes</NavLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavLink href="/requests">Requests</NavLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavLink href="/discussion">Discussion</NavLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Right: wallet */}
          <div className="flex items-center">
            <WalletButton />
          </div>
        </div>
      </header>

      {/* Page content */}
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">
        {children}
      </main>
    </div>
  );
}
