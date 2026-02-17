import * as React from "react";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import WalletButton from "./WalletButton";
import { Link, useLocation } from "wouter"; // or react-router-dom if that's what you use

type LayoutProps = {
  children: React.ReactNode;
  className?: string;
};

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/suggestions", label: "Suggestions" },
  { href: "/notes", label: "Notes" },
  { href: "/requests", label: "Requests" },
];

export default function Layout({ children, className }: LayoutProps) {
  const [location] = useLocation();
  const [menuOpen, setMenuOpen] = React.useState(false);

  React.useEffect(() =>{
    if (menuOpen) setMenuOpen(false);
  }, [location]);

  return (
    <div className={cn("min-h-screen flex flex-col", className)}>
      {/* Top Nav */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/70 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">

          {/* Left: brand */}
          <div className="flex items-center gap-3">
            <span className="font-semibold text-lg">CampusDAO</span>
          </div>

          {/* Center: nav menu — hidden on mobile */}
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList className="flex gap-1">
              {navLinks.map(({ href, label }) => (
                <NavigationMenuItem key={href}>
                  <Link href={href}>
                    <NavigationMenuLink
                      className={cn(
                        "px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                        location === href
                          ? "bg-accent text-accent-foreground font-semibold"
                          : "text-muted-foreground"
                      )}
                    >
                      {label}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Right: wallet + mobile hamburger */}
          <div className="flex items-center gap-3">
            <WalletButton />

            {/* Hamburger — visible only on mobile */}
            <button
              className="md:hidden flex flex-col gap-1 p-2"
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label="Toggle menu"
            >
              <span className={cn("block w-5 h-0.5 bg-foreground transition-transform", menuOpen && "rotate-45 translate-y-1.5")} />
              <span className={cn("block w-5 h-0.5 bg-foreground transition-opacity", menuOpen && "opacity-0")} />
              <span className={cn("block w-5 h-0.5 bg-foreground transition-transform", menuOpen && "-rotate-45 -translate-y-1.5")} />
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {menuOpen && (
          <div className="md:hidden border-t bg-background px-4 py-3 flex flex-col gap-2">
            {navLinks.map(({ href, label }) => (
              <Link key={href} href={href}>
                <a
                  className={cn(
                    "block px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent",
                    location === href
                      ? "bg-accent text-accent-foreground font-semibold"
                      : "text-muted-foreground"
                  )}
                  onClick={() => setMenuOpen(false)}
                >
                  {label}
                </a>
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* Page content */}
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">
        {children}
      </main>
    </div>
  );
}