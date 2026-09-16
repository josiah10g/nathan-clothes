import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, EyeOff } from "lucide-react";

export const Route = createFileRoute("/auth")({
  validateSearch: (search: Record<string, unknown>): {
    redirect?: string | undefined;
    mode?: "signin" | "signup" | undefined;
  } => ({
    redirect: typeof search["redirect"] === "string" ? search["redirect"] : undefined,
    mode: search["mode"] === "signup" ? "signup" : search["mode"] === "signin" ? "signin" : undefined,
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

const signInSchema = z.object({
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z.string().min(6, "Password must be at least 6 characters").max(72),
});

const signUpSchema = z
  .object({
    fullName: z.string().trim().max(100).optional(),
    email: z.string().trim().email("Enter a valid email").max(255),
    phone: z
      .string()
      .trim()
      .min(7, "Phone number must be at least 7 digits")
      .max(15, "Phone number too long")
      .regex(/^[0-9]+$/, "Phone number must contain numbers only"),
    password: z.string().min(6, "Password must be at least 6 characters").max(72),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

function safePath(path: string | undefined) {
  if (!path || !path.startsWith("/") || path.startsWith("//")) return "/account";
  return path;
}

function AuthPage() {
  const { redirect, mode } = Route.useSearch();
  const { user } = useAuth();
  const navigate = useNavigate();
  const target = safePath(redirect);
  const [activeTab, setActiveTab] = useState<string>(mode || "signin");

  useEffect(() => {
    if (mode) setActiveTab(mode);
  }, [mode]);

  // Sign In fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showSignInPassword, setShowSignInPassword] = useState(false);

  // Sign Up fields
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPhone, setSignUpPhone] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState("");
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [showSignUpConfirmPassword, setShowSignUpConfirmPassword] = useState(false);
  const [fullName, setFullName] = useState("");

  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (user) navigate({ to: target, replace: true });
  }, [user, target, navigate]);

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = signInSchema.safeParse({ email, password });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]!.message);
      return;
    }
    setBusy(true);
    const { data: authData, error } = await supabase.auth.signInWithPassword(parsed.data);
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }

    const userName =
      (authData.user?.user_metadata?.["full_name"] as string) ||
      authData.user?.email?.split("@")[0] ||
      "User";

    // Check if user is admin to route to admin dashboard directly
    let destPath = target;
    if (!redirect) {
      const { data: adminRole } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", authData.user.id)
        .eq("role", "admin")
        .maybeSingle();

      destPath = adminRole ? "/admin" : "/account";
    }

    // Trigger cool 4-second loading screen
    window.dispatchEvent(new Event("nc:show-loading-screen"));

    // Welcoming toast
    toast.success(`Welcome back, ${userName}! Loading your dashboard…`, {
      duration: 5000,
    });

    navigate({ to: destPath, replace: true });
  };

  const signUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = signUpSchema.safeParse({
      fullName,
      email: signUpEmail,
      phone: signUpPhone,
      password: signUpPassword,
      confirmPassword: signUpConfirmPassword,
    });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]!.message);
      return;
    }
    setBusy(true);
    // Only phone and full_name (if entered) are stored in user_metadata in Supabase auth
    const { data, error } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: {
        emailRedirectTo: window.location.origin,
        data: {
          phone: parsed.data.phone.trim(),
          ...(fullName.trim() ? { full_name: fullName.trim() } : {}),
        },
      },
    });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    if (!data.session) {
      toast.success("Account created! Check your email to confirm your account.");
      return;
    }
    toast.success("Account created successfully!");
    navigate({ to: target, replace: true });
  };

  return (
    <div className="mx-auto max-w-md px-4 py-20 sm:px-6">
      <h1 className="text-center text-4xl">Account</h1>
      <p className="mt-3 text-center text-sm text-muted-foreground">
        Sign in to manage your orders or track your purchases.
      </p>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-10">
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
              <div className="relative">
                <Input
                  id="signin-password"
                  type={showSignInPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowSignInPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground focus:outline-none"
                  aria-label={showSignInPassword ? "Hide password" : "Show password"}
                >
                  {showSignInPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" disabled={busy} className="text-xs uppercase tracking-[0.25em]">
              {busy ? "Signing in…" : "Sign in"}
            </Button>
          </form>
        </TabsContent>

        <TabsContent value="signup">
          <form onSubmit={signUp} className="mt-6 grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="signup-name">Full name (optional)</Label>
              <Input
                id="signup-name"
                placeholder="Nathan Doe"
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
                required
                placeholder="example@gmail.com"
                value={signUpEmail}
                onChange={(e) => setSignUpEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="signup-phone">Phone number (numbers only)</Label>
              <Input
                id="signup-phone"
                type="tel"
                inputMode="numeric"
                pattern="[0-9]*"
                required
                placeholder="08012345678"
                value={signUpPhone}
                onChange={(e) => setSignUpPhone(e.target.value.replace(/[^0-9]/g, ""))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="signup-password">Password</Label>
              <div className="relative">
                <Input
                  id="signup-password"
                  type={showSignUpPassword ? "text" : "password"}
                  required
                  placeholder="At least 6 characters"
                  value={signUpPassword}
                  onChange={(e) => setSignUpPassword(e.target.value)}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowSignUpPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground focus:outline-none"
                  aria-label={showSignUpPassword ? "Hide password" : "Show password"}
                >
                  {showSignUpPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="signup-confirm-password">Confirm password</Label>
              <div className="relative">
                <Input
                  id="signup-confirm-password"
                  type={showSignUpConfirmPassword ? "text" : "password"}
                  required
                  placeholder="Re-enter your password"
                  value={signUpConfirmPassword}
                  onChange={(e) => setSignUpConfirmPassword(e.target.value)}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowSignUpConfirmPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground focus:outline-none"
                  aria-label={showSignUpConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showSignUpConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" disabled={busy} className="text-xs uppercase tracking-[0.25em]">
              {busy ? "Creating…" : "Create account"}
            </Button>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
}
