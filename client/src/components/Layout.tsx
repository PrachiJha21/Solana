import { Link, useLocation } from "wouter";
import { WalletButton } from "./WalletButton";
import { 
  GraduationCap, 
  Lightbulb, 
  BookOpen, 
  HelpCircle,
  Menu,
  X 
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { href: "/suggestions", label: "Suggestions", icon: Lightbulb },
    { href: "/notes", label: "Notes Hub", icon: BookOpen },
    { href: "/requests", label: "Requests", icon: HelpCircle },
  ];

  const isActive = (path: string) => location === path;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 mx-auto">
          <div className="flex items-center gap-2 md:gap-4">
            <Link href="/">
              <div className="flex items-center space-x-2 cursor-pointer group">
                <div className="bg-primary/10 p-2 rounded-xl group-hover:bg-primary/20 transition-colors">
                  <GraduationCap className="h-6 w-6 text-primary" />
                </div>
                <span className="hidden font-display font-bold text-xl sm:inline-block">
                  Campus<span className="text-primary">DAO</span>
                </span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center space-x-1 ml-6">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <div className={`
                    flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer
                    ${isActive(item.href) 
                      ? "bg-primary/10 text-primary" 
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"}
                  `}>
                    <item.icon className="w-4 h-4 mr-2" />
                    {item.label}
                  </div>
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:block">
              <WalletButton />
            </div>

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col gap-8 mt-8">
                  <Link href="/" onClick={() => setIsOpen(false)}>
                    <div className="flex items-center space-x-2 cursor-pointer">
                      <div className="bg-primary/10 p-2 rounded-xl">
                        <GraduationCap className="h-6 w-6 text-primary" />
                      </div>
                      <span className="font-display font-bold text-xl">
                        Campus<span className="text-primary">DAO</span>
                      </span>
                    </div>
                  </Link>
                  <nav className="flex flex-col gap-2">
                    {navItems.map((item) => (
                      <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)}>
                        <div className={`
                          flex items-center px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 cursor-pointer
                          ${isActive(item.href) 
                            ? "bg-primary/10 text-primary" 
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"}
                        `}>
                          <item.icon className="w-5 h-5 mr-3" />
                          {item.label}
                        </div>
                      </Link>
                    ))}
                  </nav>
                  <div className="mt-auto">
                    <WalletButton />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="flex-1 container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {children}
      </main>

      <footer className="border-t border-border/40 py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm text-muted-foreground">
            Built with Solana & Anchor. Open source education.
          </p>
          <p className="text-sm text-muted-foreground">
            © 2024 CampusDAO
          </p>
        </div>
      </footer>
    </div>
  );
}
