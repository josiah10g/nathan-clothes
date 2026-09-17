import { useState } from "react";
import { Link, useRouter } from "@tanstack/react-router";
import { Menu, ShoppingBag, User, X } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ProfileDialog } from "@/components/site/ProfileDialog";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const { count } = useCart();
  const { user, isAdmin, signOut } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    setOpen(false);
    setAvatarMenuOpen(false);
    router.navigate({ to: "/", replace: true });
  };

  const toggleHamburger = () => {
    if (!open) {
      setAvatarMenuOpen(false); // Close avatar dropdown if opening hamburger
    }
    setOpen((v) => !v);
  };

  const handleAvatarOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      setOpen(false); // Close hamburger if opening avatar dropdown
    }
    setAvatarMenuOpen(nextOpen);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Top Left: Business Name - clean standard link to Home */}
        <div className="flex items-center min-w-0">
          <Link
            to="/"
            onClick={() => {
              setOpen(false);
              setAvatarMenuOpen(false);
            }}
            className="text-display text-base tracking-[0.15em] sm:text-xl sm:tracking-brand truncate hover:opacity-90 transition-opacity"
          >
            NATHAN&apos;S CLOTHES
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden items-center gap-8 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="text-xs uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground [&.active]:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Desktop Logged-Out Actions */}
          {!user && (
            <div className="hidden md:flex items-center gap-2">
              <Link to="/auth" search={{ mode: "signin", redirect: undefined }}>
                <Button variant="ghost" size="sm" className="text-xs uppercase tracking-[0.2em]">
                  Log in
                </Button>
              </Link>
              <Link to="/auth" search={{ mode: "signup", redirect: undefined }}>
                <Button variant="default" size="sm" className="text-xs uppercase tracking-[0.2em]">
                  Sign up
                </Button>
              </Link>
            </div>
          )}

          {/* User Avatar Dropdown (Desktop & Mobile) */}
          {user && (
            <DropdownMenu open={avatarMenuOpen} onOpenChange={handleAvatarOpenChange}>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="group relative flex size-9 items-center justify-center rounded-full border border-border bg-surface transition-all hover:border-foreground/50 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-foreground/20 cursor-pointer"
                  aria-label="User menu"
                >
                  <Avatar className="size-full pointer-events-none">
                    <AvatarImage
                      src={(user.user_metadata?.["avatar_url"] as string) || ""}
                      alt="User avatar"
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-primary/10 text-[11px] font-bold text-primary">
                      {((user.user_metadata?.["full_name"] as string) || user.email || "U")
                        .slice(0, 2)
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 mt-2 border-border bg-background p-1.5 shadow-xl">
                <div className="px-2 py-1.5 border-b border-border/60 mb-1">
                  <p className="text-xs font-semibold text-foreground truncate">
                    {(user.user_metadata?.["full_name"] as string) || "User"}
                  </p>
                  <p className="text-[11px] text-muted-foreground truncate">{user.email}</p>
                </div>
                <DropdownMenuItem asChild>
                  <Link
                    to={isAdmin ? "/admin" : "/account"}
                    onClick={() => setAvatarMenuOpen(false)}
                    className="cursor-pointer text-xs uppercase tracking-[0.15em] font-medium"
                  >
                    {isAdmin ? "Admin Dashboard" : "Customer Dashboard"}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setAvatarMenuOpen(false);
                    setProfileOpen(true);
                  }}
                  className="cursor-pointer text-xs uppercase tracking-[0.15em] font-medium"
                >
                  Manage Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="cursor-pointer text-xs uppercase tracking-[0.15em] text-destructive focus:text-destructive font-medium"
                >
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Desktop Cart Button */}
          <Link to="/cart" aria-label="Cart" className="hidden md:inline-flex relative shrink-0">
            <Button variant="ghost" size="sm" className="flex items-center gap-1.5 px-3 text-xs uppercase tracking-[0.2em]">
              <ShoppingBag className="size-4" />
              <span>Cart</span>
              {count > 0 && (
                <span className="flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {count}
                </span>
              )}
            </Button>
          </Link>

          {/* Mobile Hamburger Menu button at the top right corner (only visible on mobile) */}
          <button
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-md text-foreground hover:bg-surface md:hidden"
            onClick={toggleHamburger}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Slide-down Hamburger Drawer Content (Mobile only) */}
      <div className={cn("border-t border-border bg-background/95 backdrop-blur md:hidden", open ? "block" : "hidden")}>
        <nav className="mx-auto flex max-w-7xl flex-col px-4 py-3 divide-y divide-border/40">
          {/* Main navigation links */}
          <div className="flex flex-col py-1">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="py-2.5 text-xs sm:text-sm uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors font-medium"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Cart button inside the Hamburger content */}
          <div className="py-2">
            <Link
              to="/cart"
              onClick={() => setOpen(false)}
              className="flex items-center justify-between py-2 text-xs sm:text-sm uppercase tracking-[0.2em] text-foreground font-medium hover:text-primary transition-colors"
            >
              <div className="flex items-center gap-2">
                <ShoppingBag className="size-4" />
                <span>My Cart</span>
              </div>
              {count > 0 ? (
                <span className="flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {count}
                </span>
              ) : (
                <span className="text-[11px] text-muted-foreground lowercase tracking-normal">0 items</span>
              )}
            </Link>
          </div>

          {/* When logged out: Log in and Sign up inside the Hamburger content */}
          {!user && (
            <div className="flex flex-col gap-2 pt-3 pb-1">
              <Link
                to="/auth"
                search={{ mode: "signin", redirect: undefined }}
                onClick={() => setOpen(false)}
                className="w-full"
              >
                <Button variant="outline" className="w-full justify-center text-xs uppercase tracking-[0.2em] h-10">
                  Log in
                </Button>
              </Link>
              <Link
                to="/auth"
                search={{ mode: "signup", redirect: undefined }}
                onClick={() => setOpen(false)}
                className="w-full"
              >
                <Button variant="default" className="w-full justify-center text-xs uppercase tracking-[0.2em] h-10">
                  Sign up
                </Button>
              </Link>
            </div>
          )}
        </nav>
      </div>

      <ProfileDialog open={profileOpen} onOpenChange={setProfileOpen} />
    </header>
  );
}
