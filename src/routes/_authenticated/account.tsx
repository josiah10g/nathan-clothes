import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatPrice } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/account")({
  head: () => ({
    meta: [
      { title: "Your Account — Nathan's Clothing" },
      { name: "description", content: "View your Nathan's Clothing orders and account details." },
      { property: "og:title", content: "Your Account — Nathan's Clothing" },
      { property: "og:description", content: "View your orders and account details." },
    ],
  }),
  component: Account,
});

function Account() {
  const { user, isAdmin } = useAuth();

  const { data: orders, isLoading } = useQuery({
    queryKey: ["my-orders", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("id,created_at,status,total_cents,order_items(id,product_name,size,quantity,unit_price_cents,image_url)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl sm:text-5xl">Your account</h1>
          <p className="mt-3 text-sm text-muted-foreground">{user?.email}</p>
        </div>
        {isAdmin ? (
          <Link to="/admin">
            <Button variant="outline" className="text-xs uppercase tracking-[0.2em]">
              Admin dashboard
            </Button>
          </Link>
        ) : (
          <Link to="/admin-setup">
            <Button variant="ghost" className="text-xs uppercase tracking-[0.2em]">
              Owner setup
            </Button>
          </Link>
        )}
      </div>

      <h2 className="mt-14 text-2xl">Orders</h2>

      {isLoading && <p className="mt-6 text-sm text-muted-foreground">Loading your orders…</p>}

      {!isLoading && (orders ?? []).length === 0 && (
        <div className="mt-6">
          <p className="text-sm text-muted-foreground">You haven&apos;t placed an order yet.</p>
          <Link to="/shop" className="mt-6 inline-block">
            <Button className="text-xs uppercase tracking-[0.25em]">Shop the collection</Button>
          </Link>
        </div>
      )}

      <div className="mt-6 space-y-6">
        {(orders ?? []).map((order) => (
          <article key={order.id} className="border border-border bg-surface p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  {formatDate(order.created_at)} · #{order.id.slice(0, 8)}
                </p>
                <p className="mt-2 text-lg">{formatPrice(order.total_cents)}</p>
              </div>
              <Badge variant="outline" className="uppercase tracking-[0.2em]">
                {order.status}
              </Badge>
            </div>
            <ul className="mt-5 space-y-3 border-t border-border pt-5">
              {order.order_items.map((item) => (
                <li key={item.id} className="flex items-center gap-4 text-sm">
                  <img
                    src={item.image_url}
                    alt={item.product_name}
                    width={1024}
                    height={1024}
                    loading="lazy"
                    className="size-14 bg-background object-cover"
                  />
                  <span className="flex-1 text-muted-foreground">
                    {item.product_name} · {item.size} × {item.quantity}
                  </span>
                  <span>{formatPrice(item.unit_price_cents * item.quantity)}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </div>
  );
}
