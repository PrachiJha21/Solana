import * as React from "react";
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import { cva } from "class-variance-authority";
import { ChevronDown } from "lucide-react";
import { Link } from "wouter";

import { cn } from "@/lib/utils";

/* -----------------------------------------------------------------------------
 * Root
 * ---------------------------------------------------------------------------*/
const NavigationMenu = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <NavigationMenuPrimitive.Root
    ref={ref}
    className={cn(
      "relative z-10 flex max-w-max flex-1 items-center justify-center",
      className
    )}
    {...props}
  >
    {children}
    <NavigationMenuViewport />
  </NavigationMenuPrimitive.Root>
));
NavigationMenu.displayName = NavigationMenuPrimitive.Root.displayName;

/* -----------------------------------------------------------------------------
 * List
 * ---------------------------------------------------------------------------*/
const NavigationMenuList = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.List>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.List
    ref={ref}
    className={cn(
      "group flex flex-1 list-none items-center justify-center space-x-1",
      className
    )}
    {...props}
  />
));
NavigationMenuList.displayName = NavigationMenuPrimitive.List.displayName;

/* -----------------------------------------------------------------------------
 * Item
 * ---------------------------------------------------------------------------*/
const NavigationMenuItem = NavigationMenuPrimitive.Item;

/* -----------------------------------------------------------------------------
 * Trigger style
 * ---------------------------------------------------------------------------*/
const navigationMenuTriggerStyle = cva(
  "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors " +
    "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none " +
    "disabled:pointer-events-none disabled:opacity-50 " +
    "data-[state=open]:text-accent-foreground data-[state=open]:bg-accent/50 data-[state=open]:hover:bg-accent data-[state=open]:focus:bg-accent"
);

/* -----------------------------------------------------------------------------
 * Trigger
 * ---------------------------------------------------------------------------*/
const NavigationMenuTrigger = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <NavigationMenuPrimitive.Trigger
    ref={ref}
    className={cn(navigationMenuTriggerStyle(), "group", className)}
    {...props}
  >
    {children}{" "}
    <ChevronDown
      className="relative top-[1px] ml-1 h-3 w-3 transition duration-200 group-data-[state=open]:rotate-180"
      aria-hidden="true"
    />
  </NavigationMenuPrimitive.Trigger>
));
NavigationMenuTrigger.displayName =
  NavigationMenuPrimitive.Trigger.displayName;

/* -----------------------------------------------------------------------------
 * Content
 * ---------------------------------------------------------------------------*/
const NavigationMenuContent = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Content>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Content
    ref={ref}
    className={cn(
      "left-0 top-0 w-full " +
        "data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out " +
        "data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out " +
        "data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 " +
        "data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 " +
        "md:absolute md:w-auto",
      className
    )}
    {...props}
  />
));
NavigationMenuContent.displayName =
  NavigationMenuPrimitive.Content.displayName;

/* -----------------------------------------------------------------------------
 * Viewport
 * ---------------------------------------------------------------------------*/
const NavigationMenuViewport = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Viewport>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Viewport>
>(({ className, ...props }, ref) => (
  <div className={cn("absolute left-0 top-full flex justify-center")}>
    <NavigationMenuPrimitive.Viewport
      className={cn(
        "origin-top-center relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-md border " +
          "bg-popover text-popover-foreground shadow-lg " +
          "data-[state=open]:animate-in data-[state=closed]:animate-out " +
          "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 md:w-[var(--radix-navigation-menu-viewport-width)]",
        className
      )}
      ref={ref}
      {...props}
    />
  </div>
));
NavigationMenuViewport.displayName =
  NavigationMenuPrimitive.Viewport.displayName;

/* -----------------------------------------------------------------------------
 * Indicator
 * ---------------------------------------------------------------------------*/
const NavigationMenuIndicator = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Indicator>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Indicator>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Indicator
    ref={ref}
    className={cn(
      "top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden " +
        "data-[state=visible]:animate-in data-[state=hidden]:animate-out " +
        "data-[state=hidden]:fade-out data-[state=visible]:fade-in",
      className
    )}
    {...props}
  >
    <div className="relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm bg-border shadow-md" />
  </NavigationMenuPrimitive.Indicator>
));
NavigationMenuIndicator.displayName =
  NavigationMenuPrimitive.Indicator.displayName;

/* -----------------------------------------------------------------------------
 * Links
 * ---------------------------------------------------------------------------*/

/**
 * Raw Radix link export (kept for external links or advanced cases).
 * For internal app routes, prefer <NavLink /> below to ensure SPA navigation.
 */
const NavigationMenuLink = NavigationMenuPrimitive.Link;

/**
 * SPA-safe NavLink for internal routes.
 * Uses Wouter's <Link> with Radix's `asChild` so it does NOT cause a full page reload.
 * This keeps your React tree (and wallet providers) mounted on navigation.
 */
type NavLinkProps = {
  href: string;
  className?: string;
  children: React.ReactNode;
  /** When true, applies the trigger look (button-like). Otherwise, pass your own classes. */
  triggerStyle?: boolean;
};

const NavLink = ({ href, className, children, triggerStyle = true }: NavLinkProps) => {
  return (
    <NavigationMenuPrimitive.Link asChild>
      <Link
        href={href}
        className={cn(triggerStyle ? navigationMenuTriggerStyle() : "", className)}
      >
        {children}
      </Link>
    </NavigationMenuPrimitive.Link>
  );
};

/* -----------------------------------------------------------------------------
 * Exports
 * ---------------------------------------------------------------------------*/
export {
  navigationMenuTriggerStyle,
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink, // raw Radix link (external)
  NavigationMenuIndicator,
  NavigationMenuViewport,
  NavLink, // SPA-safe internal link (use this for in-app routes)
};