import { useState } from "react";
import { Link, useRouter } from "@tanstack/react-router";
import { Menu, ShoppingBag, User, X } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const { count } = useCart();
  const { user, isAdmin, signOut } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    setOpen(false);
    router.navigate({ to: "/", replace: true });
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <button
          className="mr-2 inline-flex size-9 items-center justify-center text-foreground md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>

        <Link to="/" className="text-display text-lg tracking-brand sm:text-xl">
          NATHAN&apos;S CLOTHES
        </Link>

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
          {isAdmin && (
            <Link
              to="/admin"
              className="text-xs uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground"
            >
              Admin
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          {user ? (
            <>
              <Link to="/account" aria-label="Your account">
                <Button variant="ghost" size="icon">
                  <User className="size-5" />
                </Button>
              </Link>
              <Button
                variant="ghost"
                onClick={handleSignOut}
                className="hidden text-xs uppercase tracking-[0.2em] sm:inline-flex"
              >
                Sign out
              </Button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/auth" search={{ mode: "signin", redirect: undefined }}>
                <Button variant="ghost" className="text-xs uppercase tracking-[0.2em]">
                  Log in
                </Button>
              </Link>
              <Link to="/auth" search={{ mode: "signup", redirect: undefined }}>
                <Button variant="default" className="text-xs uppercase tracking-[0.2em]">
                  Sign up
                </Button>
              </Link>
            </div>
          )}
          <Link to="/cart" aria-label="Cart" className="relative">
            <Button variant="ghost" className="flex items-center gap-1.5 px-2.5 text-xs uppercase tracking-[0.2em]">
              <ShoppingBag className="size-4" />
              <span>Cart</span>
              {count > 0 && (
                <span className="flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {count}
                </span>
              )}
            </Button>
          </Link>
        </div>
      </div>

      <div className={cn("border-t border-border md:hidden", open ? "block" : "hidden")}>
        <nav className="mx-auto flex max-w-7xl flex-col px-4 py-2">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className="py-3 text-sm uppercase tracking-[0.2em] text-muted-foreground"
            >
              {item.label}
            </Link>
          ))}
          {isAdmin && (
            <Link
              to="/admin"
              onClick={() => setOpen(false)}
              className="py-3 text-sm uppercase tracking-[0.2em] text-muted-foreground"
            >
              Admin
            </Link>
          )}
          {!user && (
            <div className="flex flex-col gap-1 border-t border-border pt-2">
              <Link
                to="/auth"
                search={{ mode: "signin", redirect: undefined }}
                onClick={() => setOpen(false)}
                className="py-2.5 text-sm uppercase tracking-[0.2em] text-muted-foreground"
              >
                Log in
              </Link>
              <Link
                to="/auth"
                search={{ mode: "signup", redirect: undefined }}
                onClick={() => setOpen(false)}
                className="py-2.5 text-sm uppercase tracking-[0.2em] text-foreground font-medium"
              >
                Sign up
              </Link>
            </div>
          )}
          {user && (
            <button
              onClick={handleSignOut}
              className="py-3 text-left text-sm uppercase tracking-[0.2em] text-muted-foreground"
            >
              Sign out
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
