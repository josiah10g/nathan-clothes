import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Search, PackageCheck, AlertCircle, CheckCircle, Clock, Upload, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDate, formatPrice } from "@/lib/format";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "Order Tracking & Account — Nathan's Clothes" },
      { name: "description", content: "Track your order by reference or sign in to view account history." },
      { property: "og:title", content: "Order Tracking & Account — Nathan's Clothes" },
      { property: "og:description", content: "Track your order by reference or sign in to view account history." },
    ],
  }),
  component: AccountPage,
});

function AccountPage() {
  const { user, isAdmin, signOut } = useAuth();
  const qc = useQueryClient();

  // Guest Order Tracking State
  const [trackRef, setTrackRef] = useState("");
  const [trackPhone, setTrackPhone] = useState("");
  const [trackedOrder, setTrackedOrder] = useState<any | null>(null);
  const [searching, setSearching] = useState(false);

  // New receipt upload state for tracked order
  const [newReceiptFile, setNewReceiptFile] = useState<File | null>(null);
  const [uploadingReceipt, setUploadingReceipt] = useState(false);

  // Logged-in orders query
  const { data: myOrders, isLoading: loadingMyOrders } = useQuery({
    queryKey: ["my-orders", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const handleTrackOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackRef.trim() || !trackPhone.trim()) {
      toast.error("Please enter both your Order Reference and Phone Number");
      return;
    }

    setSearching(true);
    try {
      const { data, error } = await supabase.rpc("track_order", {
        _reference: trackRef.trim(),
        _phone: trackPhone.trim(),
      });

      if (error) {
        toast.error("Failed to query order: " + error.message);
        setTrackedOrder(null);
        return;
      }

      if (data && typeof data === "object" && "error" in (data as Record<string, any>)) {
        toast.error((data as any).error || "Order not found");
        setTrackedOrder(null);
        return;
      }

      setTrackedOrder(data);
      toast.success("Order found!");
    } catch (err: any) {
      toast.error(err?.message || "Failed to find order");
      setTrackedOrder(null);
    } finally {
      setSearching(false);
    }
  };

  const handleAttachReceipt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReceiptFile || !trackedOrder) {
      toast.error("Please select a file to upload");
      return;
    }

    setUploadingReceipt(true);
    try {
      const fileExt = newReceiptFile.name.split(".").pop() || "jpg";
      const sanitizedRef = trackedOrder.reference.toLowerCase().replace(/[^a-z0-9]/g, "");
      const fileName = `${sanitizedRef}_reupload_${Date.now()}.${fileExt}`;
      const filePath = `receipts/${fileName}`;

      const { error: storageError } = await supabase.storage
        .from("payment-receipts")
        .upload(filePath, newReceiptFile, { upsert: true });

      if (storageError) {
        console.error("Storage error:", storageError);
      }

      const { data: updated, error: rpcError } = await supabase.rpc("attach_receipt", {
        _reference: trackedOrder.reference,
        _phone: trackPhone.trim(),
        _path: filePath,
      });

      if (rpcError || !updated) {
        toast.error("Failed to update receipt. Please check reference and phone.");
        return;
      }

      toast.success("Receipt uploaded successfully. Order is now under review!");
      setNewReceiptFile(null);

      // Refresh order view
      const { data: fresh } = await supabase.rpc("track_order", {
        _reference: trackRef.trim(),
        _phone: trackPhone.trim(),
      });
      if (fresh) setTrackedOrder(fresh);
    } catch (err: any) {
      toast.error(err?.message || "Failed to upload new receipt");
    } finally {
      setUploadingReceipt(false);
    }
  };

  const renderPaymentBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 uppercase tracking-[0.15em] flex items-center gap-1">
            <CheckCircle className="size-3" /> Approved & Paid
          </Badge>
        );
      case "declined":
        return (
          <Badge className="bg-destructive/20 text-destructive border border-destructive/30 uppercase tracking-[0.15em] flex items-center gap-1">
            <AlertCircle className="size-3" /> Declined / Action Required
          </Badge>
        );
      default:
        return (
          <Badge className="bg-amber-600/20 text-amber-400 border border-amber-500/30 uppercase tracking-[0.15em] flex items-center gap-1">
            <Clock className="size-3" /> Pending Verification
          </Badge>
        );
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-8">
        <div>
          <h1 className="text-4xl sm:text-5xl font-bold uppercase tracking-tight">Orders & Account</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {user ? `Logged in as ${user.email}` : "Track a guest order or log into your account."}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isAdmin && (
            <Link to="/admin">
              <Button variant="outline" className="text-xs uppercase tracking-[0.2em]">
                Admin Dashboard
              </Button>
            </Link>
          )}

          {user && (
            <Button
              variant="ghost"
              onClick={() => signOut()}
              className="text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground"
            >
              Sign out
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue={user ? "history" : "track"} className="mt-10">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="track" className="text-xs uppercase tracking-[0.2em]">
            Track Order
          </TabsTrigger>
          <TabsTrigger value="history" className="text-xs uppercase tracking-[0.2em]">
            My Account
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Guest / Public Order Tracker */}
        <TabsContent value="track" className="mt-8 space-y-8">
          <div className="border border-border bg-surface p-6 sm:p-8">
            <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-muted-foreground mb-4">
              Instant Order Lookup
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              Enter the Order Reference (e.g. <span className="font-mono text-foreground">CK-A8F291E3</span>) and the
              Phone Number provided during checkout.
            </p>

            <form onSubmit={handleTrackOrder} className="grid gap-4 sm:grid-cols-[1fr_1fr_auto]">
              <div className="grid gap-1.5">
                <Label htmlFor="track-ref" className="text-xs">Order Reference</Label>
                <Input
                  id="track-ref"
                  placeholder="e.g. CK-12345678"
                  value={trackRef}
                  onChange={(e) => setTrackRef(e.target.value)}
                  className="font-mono uppercase"
                />
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="track-phone" className="text-xs">Phone Number</Label>
                <Input
                  id="track-phone"
                  placeholder="e.g. +1 555 019 2834"
                  value={trackPhone}
                  onChange={(e) => setTrackPhone(e.target.value)}
                />
              </div>

              <div className="flex items-end">
                <Button type="submit" disabled={searching} className="w-full sm:w-auto text-xs uppercase tracking-[0.2em]">
                  {searching ? "Searching…" : "Track"}
                </Button>
              </div>
            </form>
          </div>

          {/* Tracked Order Result Card */}
          {trackedOrder && (
            <div className="border border-border bg-surface p-6 sm:p-8 space-y-6">
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border pb-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Order Reference</p>
                  <p className="mt-1 font-mono text-2xl font-bold tracking-wider text-foreground">
                    {trackedOrder.reference}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Placed on {formatDate(trackedOrder.created_at)}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-2">
                  {renderPaymentBadge(trackedOrder.payment_status || trackedOrder.status)}
                  <p className="text-sm font-semibold text-foreground">
                    Total: ${Number(trackedOrder.total || trackedOrder.total_cents / 100).toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Admin Note / Action Instructions */}
              {trackedOrder.admin_note && (
                <div className="rounded border border-primary/30 bg-primary/5 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary mb-1">
                    Store Note / Update:
                  </p>
                  <p className="text-sm text-foreground">{trackedOrder.admin_note}</p>
                </div>
              )}

              {/* Delivery info */}
              <div className="grid gap-4 sm:grid-cols-2 text-sm">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Customer</p>
                  <p className="font-medium text-foreground mt-1">
                    {trackedOrder.customer_name || trackedOrder.full_name}
                  </p>
                  <p className="text-muted-foreground">{trackedOrder.phone}</p>
                  <p className="text-muted-foreground">{trackedOrder.email}</p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Delivery Address</p>
                  <p className="text-muted-foreground mt-1">{trackedOrder.address}</p>
                </div>
              </div>

              {/* Items breakdown */}
              {Array.isArray(trackedOrder.items) && trackedOrder.items.length > 0 && (
                <div className="border-t border-border pt-6">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">Ordered Pieces</p>
                  <ul className="divide-y divide-border">
                    {trackedOrder.items.map((it: any, idx: number) => (
                      <li key={idx} className="py-3 flex items-center justify-between text-sm">
                        <div className="flex items-center gap-3">
                          {it.imageUrl && (
                            <img src={it.imageUrl} alt={it.name} className="size-12 object-cover bg-background" />
                          )}
                          <div>
                            <p className="font-medium text-foreground">{it.name}</p>
                            <p className="text-xs text-muted-foreground uppercase">
                              Size: {it.size} × {it.quantity}
                            </p>
                          </div>
                        </div>
                        <span className="font-medium text-foreground">
                          ${(Number(it.price || it.priceCents / 100) * it.quantity).toFixed(2)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Re-upload receipt section if declined or pending */}
              {trackedOrder.payment_status !== "approved" && (
                <div className="border-t border-border pt-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-2">
                    Update / Re-Upload Payment Receipt
                  </p>
                  <p className="text-xs text-muted-foreground mb-4">
                    If your payment transfer was made or if your previous receipt was unclear, upload your updated proof
                    here:
                  </p>

                  <form onSubmit={handleAttachReceipt} className="flex flex-wrap items-center gap-3">
                    <Input
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={(e) => setNewReceiptFile(e.target.files?.[0] || null)}
                      className="max-w-xs"
                    />
                    <Button
                      type="submit"
                      disabled={uploadingReceipt || !newReceiptFile}
                      className="text-xs uppercase tracking-[0.2em]"
                    >
                      {uploadingReceipt ? "Uploading…" : "Upload Proof"}
                    </Button>
                  </form>
                </div>
              )}
            </div>
          )}
        </TabsContent>

        {/* Tab 2: User Account & History */}
        <TabsContent value="history" className="mt-8 space-y-6">
          {!user ? (
            <div className="border border-border bg-surface p-8 text-center sm:p-12">
              <h2 className="text-2xl font-bold uppercase tracking-wide">Sign in to view account</h2>
              <p className="mt-3 text-sm text-muted-foreground max-w-md mx-auto">
                Sign in with your email to see all past orders, delivery addresses, and saved details.
              </p>
              <div className="mt-6">
                <Link to="/auth" search={{ mode: "signin", redirect: "/account" }}>
                  <Button className="text-xs uppercase tracking-[0.25em]">Log In / Sign Up</Button>
                </Link>
              </div>
            </div>
          ) : (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-muted-foreground mb-6">
                Your Past Orders
              </h2>

              {loadingMyOrders && <p className="text-sm text-muted-foreground">Loading your orders…</p>}

              {!loadingMyOrders && (!myOrders || myOrders.length === 0) && (
                <div className="border border-border bg-surface p-8 text-center">
                  <p className="text-sm text-muted-foreground">You haven&apos;t placed any orders with this account yet.</p>
                  <Link to="/shop" className="mt-6 inline-block">
                    <Button className="text-xs uppercase tracking-[0.25em]">Explore Collection</Button>
                  </Link>
                </div>
              )}

              <div className="space-y-6">
                {(myOrders || []).map((ord) => (
                  <article key={ord.id} className="border border-border bg-surface p-6">
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
                      <div>
                        <p className="font-mono text-sm font-bold text-foreground">
                          {ord.reference || `ORDER #${ord.id.slice(0, 8)}`}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">{formatDate(ord.created_at)}</p>
                      </div>

                      <div className="flex items-center gap-3">
                        {renderPaymentBadge(ord.payment_status || ord.status)}
                        <span className="font-bold text-foreground">
                          ${Number(ord.total || ord.total_cents / 100).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {ord.admin_note && (
                      <p className="mt-4 text-xs bg-primary/5 p-3 border border-primary/20 text-muted-foreground">
                        <strong className="text-foreground">Store Note:</strong> {ord.admin_note}
                      </p>
                    )}

                    {Array.isArray(ord.items) && ord.items.length > 0 && (
                      <ul className="mt-4 space-y-2">
                        {ord.items.map((it: any, idx: number) => (
                          <li key={idx} className="flex justify-between text-xs text-muted-foreground">
                            <span>
                              {it.name} · {it.size} × {it.quantity}
                            </span>
                            <span className="text-foreground">
                              ${(Number(it.price || it.priceCents / 100) * it.quantity).toFixed(2)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </article>
                ))}
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
