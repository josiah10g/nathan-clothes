import { useState, useEffect } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Package,
  CreditCard,
  CheckCircle,
  AlertCircle,
  Clock,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Phone,
  Mail,
  User,
  ShoppingBag,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDate, formatPrice } from "@/lib/format";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "Customer Dashboard — Nathan's Clothes" },
      { name: "description", content: "Track orders, verify bank transfer payments, and manage your account." },
      { property: "og:title", content: "Customer Dashboard — Nathan's Clothes" },
      { property: "og:description", content: "Track orders, verify bank transfer payments, and manage your account." },
    ],
  }),
  component: AccountPage,
});

function AccountPage() {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();

  // Prevent admin from viewing customer dashboard - redirect to admin portal
  useEffect(() => {
    if (!loading && user && isAdmin) {
      navigate({ to: "/admin", replace: true });
    }
  }, [user, isAdmin, loading, navigate]);

  // Extract display customer name
  const displayName =
    (user?.user_metadata?.["full_name"] as string) ||
    user?.email?.split("@")[0] ||
    "Customer";

  // Query customer orders
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

  const ordersList = myOrders || [];
  const confirmedPayments = ordersList.filter(
    (o) => o.payment_status === "approved" || o.status === "paid" || o.status === "completed"
  );

  const renderPaymentBadge = (status: string) => {
    switch (status) {
      case "approved":
      case "paid":
      case "completed":
        return (
          <Badge className="bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 uppercase tracking-[0.15em] flex items-center gap-1 text-[11px]">
            <CheckCircle className="size-3" /> Confirmed
          </Badge>
        );
      case "declined":
        return (
          <Badge className="bg-destructive/20 text-destructive border border-destructive/30 uppercase tracking-[0.15em] flex items-center gap-1 text-[11px]">
            <AlertCircle className="size-3" /> Action Required
          </Badge>
        );
      default:
        return (
          <Badge className="bg-amber-600/20 text-amber-400 border border-amber-500/30 uppercase tracking-[0.15em] flex items-center gap-1 text-[11px]">
            <Clock className="size-3" /> Under Review
          </Badge>
        );
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      {/* If not logged in */}
      {!user ? (
        <div className="border border-border bg-surface p-8 text-center sm:p-14 max-w-xl mx-auto my-12">
          <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
            <User className="size-6" />
          </div>
          <h2 className="text-2xl font-bold uppercase tracking-wide">Sign in to your Dashboard</h2>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            Sign in with your registered account to view your live orders, verify bank transfer payments, and manage your profile.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Link to="/auth" search={{ mode: "signin", redirect: "/account" }}>
              <Button className="text-xs uppercase tracking-[0.25em] px-6">Log In</Button>
            </Link>
            <Link to="/auth" search={{ mode: "signup", redirect: "/account" }}>
              <Button variant="outline" className="text-xs uppercase tracking-[0.25em] px-6">
                Create Account
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div>
          {/* Dashboard Header matching reference layout */}
          <div className="border-b border-border pb-8">
            <span className="inline-block rounded-full bg-secondary px-3 py-1 text-[11px] font-medium tracking-wide text-secondary-foreground mb-4">
              Customer Portal
            </span>
            <div className="flex flex-wrap items-baseline justify-between gap-4">
              <div>
                <h1 className="text-4xl sm:text-5xl font-serif font-bold tracking-tight text-foreground">
                  Welcome, {displayName}!
                </h1>
                <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
                  Track your order statuses, verify bank transfer payments, and contact support anytime.
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <Tabs defaultValue="orders" className="mt-8">
            <TabsList className="h-11 bg-transparent p-0 border-b border-border w-full justify-start rounded-none gap-8">
              <TabsTrigger
                value="orders"
                className="relative rounded-none border-b-2 border-transparent px-2 pb-3 pt-2 text-sm font-medium tracking-wide text-muted-foreground data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none flex items-center gap-2"
              >
                <Package className="size-4" />
                <span>Orders ({ordersList.length})</span>
              </TabsTrigger>
              <TabsTrigger
                value="payments"
                className="relative rounded-none border-b-2 border-transparent px-2 pb-3 pt-2 text-sm font-medium tracking-wide text-muted-foreground data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none flex items-center gap-2"
              >
                <CreditCard className="size-4" />
                <span>Payments ({confirmedPayments.length} Confirmed)</span>
              </TabsTrigger>
            </TabsList>

            {/* TAB 1: ORDERS */}
            <TabsContent value="orders" className="mt-8 space-y-6">
              {loadingMyOrders && (
                <div className="p-12 text-center text-sm text-muted-foreground">
                  Loading your orders…
                </div>
              )}

              {!loadingMyOrders && ordersList.length === 0 && (
                <div className="border border-border/80 bg-surface/40 p-12 sm:p-16 text-center">
                  <div className="mx-auto mb-4 flex size-14 items-center justify-center text-muted-foreground/50">
                    <Package className="size-10 stroke-1" />
                  </div>
                  <h3 className="text-xl font-serif font-bold text-foreground">
                    No orders placed yet
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                    Explore our catalog of heavyweight monochrome streetwear, hoodies, tees, and accessories to submit your first order.
                  </p>
                  <div className="mt-6">
                    <Link to="/shop">
                      <Button className="bg-foreground text-background hover:bg-foreground/90 text-xs uppercase tracking-[0.2em] px-6 h-11">
                        Browse Shop
                      </Button>
                    </Link>
                  </div>
                </div>
              )}

              {ordersList.map((ord) => (
                <article
                  key={ord.id}
                  className="border border-border bg-surface p-6 sm:p-8 space-y-5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-mono text-sm font-bold text-foreground">
                          {ord.reference || `ORD-${ord.id.slice(0, 8)}`}
                        </p>
                        {renderPaymentBadge(ord.payment_status || ord.status)}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Placed on {formatDate(ord.created_at)}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="font-bold text-foreground text-lg">
                        {formatPrice(ord.total_cents || Math.round(Number(ord.total || 0) * 100))}
                      </span>
                    </div>
                  </div>

                  {ord.admin_note && (
                    <div className="border border-primary/30 bg-primary/5 p-3 text-xs leading-relaxed">
                      <strong className="text-foreground">Store Update:</strong>{" "}
                      <span className="text-muted-foreground">{ord.admin_note}</span>
                    </div>
                  )}

                  {ord.address && (
                    <div className="text-xs text-muted-foreground">
                      <span className="uppercase tracking-wider font-semibold text-foreground">Delivery:</span>{" "}
                      {ord.address}
                    </div>
                  )}

                  {Array.isArray(ord.items) && ord.items.length > 0 && (
                    <div className="border-t border-border pt-3">
                      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3 font-semibold">
                        Ordered Items
                      </p>
                      <ul className="divide-y divide-border/60">
                        {ord.items.map((it: any, idx: number) => (
                          <li key={idx} className="py-2.5 flex items-center justify-between text-xs">
                            <div className="flex items-center gap-3">
                              {it.imageUrl && (
                                <img
                                  src={it.imageUrl}
                                  alt={it.name}
                                  className="size-11 object-cover bg-background border border-border"
                                />
                              )}
                              <div>
                                <p className="font-medium text-foreground">{it.name}</p>
                                <p className="text-[11px] text-muted-foreground uppercase">
                                  Size {it.size} × {it.quantity}
                                </p>
                              </div>
                            </div>
                            <span className="font-medium text-foreground">
                              {formatPrice(
                                (it.priceCents || Math.round(Number(it.price || 0) * 100)) * it.quantity
                              )}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </article>
              ))}
            </TabsContent>

            {/* TAB 2: PAYMENTS */}
            <TabsContent value="payments" className="mt-8 space-y-6">
              {ordersList.length === 0 ? (
                <div className="border border-border/80 bg-surface/40 p-12 text-center">
                  <CreditCard className="mx-auto size-10 text-muted-foreground/50 stroke-1 mb-3" />
                  <p className="text-sm font-medium text-foreground">No payments recorded</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    When you place an order and submit your bank transfer receipt, status updates will appear here.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto border border-border bg-surface">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-border text-xs uppercase tracking-[0.2em] text-muted-foreground">
                        <th className="p-4">Order Ref</th>
                        <th className="p-4">Date</th>
                        <th className="p-4">Amount</th>
                        <th className="p-4">Payment Status</th>
                        <th className="p-4">Receipt</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border text-xs">
                      {ordersList.map((ord) => (
                        <tr key={ord.id} className="hover:bg-background/40">
                          <td className="p-4 font-mono font-medium text-foreground">
                            {ord.reference || `ORD-${ord.id.slice(0, 8)}`}
                          </td>
                          <td className="p-4 text-muted-foreground">{formatDate(ord.created_at)}</td>
                          <td className="p-4 font-semibold text-foreground">
                            {formatPrice(ord.total_cents || Math.round(Number(ord.total || 0) * 100))}
                          </td>
                          <td className="p-4">
                            {renderPaymentBadge(ord.payment_status || ord.status)}
                          </td>
                          <td className="p-4 text-muted-foreground">
                            {ord.receipt_url ? (
                              <span className="text-emerald-400 font-medium">Receipt Submitted</span>
                            ) : (
                              <span className="text-muted-foreground">Not uploaded</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}
