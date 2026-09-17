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
  const [profileOpen, setProfileOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    setOpen(false);
    router.navigate({ to: "/", replace: true });
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-3 sm:px-6">
        <div className="flex items-center gap-1 sm:gap-2 min-w-0">
          <button
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-md text-foreground hover:bg-surface md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>

          {/* Logo routes to dashboard if logged in, otherwise home */}
          <Link
            to={user ? (isAdmin ? "/admin" : "/account") : "/"}
            className="text-display text-sm tracking-[0.18em] sm:text-xl sm:tracking-brand truncate"
          >
            NATHAN&apos;S CLOTHES
          </Link>
        </div>

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

        <div className="flex items-center gap-1 sm:gap-2">
          {user ? (
            <div className="flex items-center">
              {/* Single User Icon Dropdown */}
              <DropdownMenu>
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
                <DropdownMenuContent align="end" className="w-56 mt-1 border-border bg-background p-1.5 shadow-xl">
                  <div className="px-2 py-1.5 border-b border-border/60 mb-1">
                    <p className="text-xs font-semibold text-foreground truncate">
                      {(user.user_metadata?.["full_name"] as string) || "User"}
                    </p>
                    <p className="text-[11px] text-muted-foreground truncate">{user.email}</p>
                  </div>
                  <DropdownMenuItem asChild>
                    <Link
                      to={isAdmin ? "/admin" : "/account"}
                      className="cursor-pointer text-xs uppercase tracking-[0.15em] font-medium"
                    >
                      {isAdmin ? "Admin Dashboard" : "Customer Dashboard"}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setProfileOpen(true)}
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
            </div>
          ) : (
            <div className="flex items-center gap-1 sm:gap-2">
              <Link to="/auth" search={{ mode: "signin", redirect: undefined }}>
                <Button variant="ghost" size="sm" className="px-2 sm:px-3 text-xs uppercase tracking-[0.15em] sm:tracking-[0.2em]">
                  Log in
                </Button>
              </Link>
              <Link to="/auth" search={{ mode: "signup", redirect: undefined }}>
                <Button variant="default" size="sm" className="px-2.5 sm:px-3 text-xs uppercase tracking-[0.15em] sm:tracking-[0.2em]">
                  Sign up
                </Button>
              </Link>
            </div>
          )}
          <Link to="/cart" aria-label="Cart" className="relative shrink-0">
            <Button variant="ghost" size="sm" className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 text-xs uppercase tracking-[0.15em] sm:tracking-[0.2em]">
              <ShoppingBag className="size-4" />
              <span className="hidden xs:inline sm:inline">Cart</span>
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
          {user && (
            <>
              <Link
                to={isAdmin ? "/admin" : "/account"}
                onClick={() => setOpen(false)}
                className="py-3 text-left text-sm uppercase tracking-[0.2em] text-foreground font-semibold flex items-center gap-2"
              >
                <Avatar className="size-6 border border-border">
                  <AvatarImage
                    src={(user.user_metadata?.["avatar_url"] as string) || ""}
                    alt="Profile"
                    className="object-cover"
                  />
                  <AvatarFallback className="text-[9px] font-bold">
                    {((user.user_metadata?.["full_name"] as string) || user.email || "U")
                      .slice(0, 2)
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span>{isAdmin ? "Admin Dashboard" : "Customer Dashboard"}</span>
              </Link>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  setProfileOpen(true);
                }}
                className="py-3 text-left text-sm uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground font-medium flex items-center gap-2"
              >
                <User className="size-4" />
                <span>Manage Profile</span>
              </button>
              <button
                onClick={handleSignOut}
                className="py-3 text-left text-sm uppercase tracking-[0.2em] text-destructive"
              >
                Sign out
              </button>
            </>
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
        </nav>
      </div>

      <ProfileDialog open={profileOpen} onOpenChange={setProfileOpen} />
    </header>
  );
}
