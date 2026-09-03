import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/auth")({
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: typeof search.redirect === "string" ? search.redirect : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Sign In — Nathan's Clothes" },
      {
        name: "description",
        content: "Sign in or create a Nathan's Clothes account to check out and track your orders.",
      },
      { property: "og:title", content: "Sign In — Nathan's Clothes" },
      { property: "og:description", content: "Sign in or create a Nathan's Clothes account." },
    ],
  }),
  component: AuthPage,
});

const credentials = z.object({
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z.string().min(8, "Use at least 8 characters").max(72),
});

function safePath(path: string | undefined) {
  if (!path || !path.startsWith("/") || path.startsWith("//")) return "/account";
  return path;
}

function AuthPage() {
  const { redirect } = Route.useSearch();
  const { user } = useAuth();
  const navigate = useNavigate();
  const target = safePath(redirect);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (user) navigate({ to: target, replace: true });
  }, [user, target, navigate]);

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = credentials.safeParse({ email, password });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]!.message);
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword(parsed.data);
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    navigate({ to: target, replace: true });
  };

  const signUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = credentials.safeParse({ email, password });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]!.message);
      return;
    }
    setBusy(true);
    const { data, error } = await supabase.auth.signUp({
      ...parsed.data,
      options: {
        emailRedirectTo: window.location.origin,
        data: { full_name: fullName.trim() },
      },
    });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    if (!data.session) {
      toast.success("Check your email to confirm your account.");
      return;
    }
    navigate({ to: target, replace: true });
  };

  const googleSignIn = async () => {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      toast.error("Google sign-in failed. Please try again.");
      return;
    }
    if (result.redirected) return;
    navigate({ to: target, replace: true });
  };

  return (
    <div className="mx-auto max-w-md px-4 py-20 sm:px-6">
      <h1 className="text-center text-4xl">Account</h1>
      <p className="mt-3 text-center text-sm text-muted-foreground">
        Sign in to check out and follow your orders.
      </p>

      <Tabs defaultValue="signin" className="mt-10">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="signin" className="text-xs uppercase tracking-[0.2em]">
            Sign in
          </TabsTrigger>
          <TabsTrigger value="signup" className="text-xs uppercase tracking-[0.2em]">
            Create account
          </TabsTrigger>
        </TabsList>

        <TabsContent value="signin">
          <form onSubmit={signIn} className="mt-6 grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="signin-email">Email</Label>
              <Input
                id="signin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="signin-password">Password</Label>
              <Input
                id="signin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" disabled={busy} className="text-xs uppercase tracking-[0.25em]">
              {busy ? "Signing in…" : "Sign in"}
            </Button>
          </form>
        </TabsContent>

        <TabsContent value="signup">
          <form onSubmit={signUp} className="mt-6 grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="signup-name">Full name</Label>
              <Input
                id="signup-name"
                value={fullName}
                maxLength={100}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="signup-email">Email</Label>
              <Input
                id="signup-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="signup-password">Password</Label>
              <Input
                id="signup-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" disabled={busy} className="text-xs uppercase tracking-[0.25em]">
              {busy ? "Creating…" : "Create account"}
            </Button>
          </form>
        </TabsContent>
      </Tabs>

      <div className="my-8 flex items-center gap-4 text-xs uppercase tracking-[0.2em] text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        or
        <span className="h-px flex-1 bg-border" />
      </div>

      <Button
        variant="outline"
        onClick={googleSignIn}
        className="w-full text-xs uppercase tracking-[0.2em]"
      >
        Continue with Google
      </Button>
    </div>
  );
}
