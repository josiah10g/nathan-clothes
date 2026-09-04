import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/admin-setup")({
  head: () => ({
    meta: [
      { title: "Owner Setup — Nathan's Clothing" },
      { name: "description", content: "One-time setup step to claim the store owner account." },
      { property: "og:title", content: "Owner Setup — Nathan's Clothing" },
      { property: "og:description", content: "One-time setup step to claim the store owner account." },
    ],
  }),
  component: AdminSetup,
});

function AdminSetup() {
  const { isAdmin, refreshRole, user } = useAuth();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);

  const { data: adminExists, refetch } = useQuery({
    queryKey: ["admin-exists"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("admin_exists");
      if (error) throw error;
      return !!data;
    },
  });

  const claim = async () => {
    setBusy(true);
    const { data, error } = await supabase.rpc("claim_first_admin");
    setBusy(false);
    if (error) {
      toast.error("Setup failed. Please try again.");
      return;
    }
    if (!data) {
      toast.error("An owner account already exists for this store.");
      void refetch();
      return;
    }
    await refreshRole();
    toast.success("You are now the store owner.");
    navigate({ to: "/admin" });
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-20 sm:px-6">
      <h1 className="text-4xl">Owner setup</h1>
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
        The store has no built-in admin password. Instead, the first person to sign in and claim the
        store becomes the owner &mdash; and after that, this page is permanently closed. You are
        signed in as <span className="text-foreground">{user?.email}</span>.
      </p>

      <div className="mt-10 border border-border bg-surface p-6">
        {isAdmin ? (
          <p className="text-sm">You already have owner access.</p>
        ) : adminExists ? (
          <p className="text-sm text-muted-foreground">
            An owner has already been set up for this store. Ask them to grant you access.
          </p>
        ) : (
          <>
            <p className="text-sm text-muted-foreground">
              No owner exists yet. Claim ownership to unlock the admin dashboard.
            </p>
            <Button
              onClick={claim}
              disabled={busy}
              className="mt-6 text-xs uppercase tracking-[0.25em]"
            >
              {busy ? "Claiming…" : "Claim owner access"}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
