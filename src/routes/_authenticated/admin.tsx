import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { TablesUpdate } from "@/integrations/supabase/types";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDate, formatPrice } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Nathan's Clothes" },
      { name: "description", content: "Manage products, orders and customer messages." },
      { property: "og:title", content: "Admin — Nathan's Clothes" },
      { property: "og:description", content: "Manage products, orders and customer messages." },
    ],
  }),
  component: Admin,
});

const STATUSES = ["pending", "paid", "shipped", "delivered", "cancelled"] as const;

function Admin() {
  const { isAdmin, loading } = useAuth();
  const qc = useQueryClient();

  const products = useQuery({
    queryKey: ["admin", "products"],
    enabled: isAdmin,
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*").order("created_at");
      if (error) throw error;
      return data ?? [];
    },
  });

  const orders = useQuery({
    queryKey: ["admin", "orders"],
    enabled: isAdmin,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*,order_items(id,product_name,size,quantity,unit_price_cents)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const messages = useQuery({
    queryKey: ["admin", "messages"],
    enabled: isAdmin,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const [draft, setDraft] = useState({
    name: "",
    slug: "",
    description: "",
    price: "",
    image_url: "",
    category: "tees",
    colorway: "Black",
    stock: "20",
  });

  const createProduct = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("products").insert({
        name: draft.name.trim(),
        slug: draft.slug.trim().toLowerCase(),
        description: draft.description.trim(),
        price_cents: Math.round(Number(draft.price || 0) * 100),
        image_url: draft.image_url.trim(),
        category: draft.category,
        colorway: draft.colorway,
        stock: Number(draft.stock || 0),
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Product added");
      setDraft({
        name: "",
        slug: "",
        description: "",
        price: "",
        image_url: "",
        category: "tees",
        colorway: "Black",
        stock: "20",
      });
      void qc.invalidateQueries({ queryKey: ["admin", "products"] });
    },
    onError: () => toast.error("Could not add product — check the slug is unique."),
  });

  const updateProduct = useMutation({
    mutationFn: async (input: { id: string; patch: Record<string, unknown> }) => {
      const { error } = await supabase.from("products").update(input.patch).eq("id", input.id);
      if (error) throw error;
    },
    onSuccess: () => void qc.invalidateQueries({ queryKey: ["admin", "products"] }),
    onError: () => toast.error("Update failed"),
  });

  const deleteProduct = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Product removed");
      void qc.invalidateQueries({ queryKey: ["admin", "products"] });
    },
    onError: () => toast.error("Delete failed"),
  });

  const updateOrder = useMutation({
    mutationFn: async (input: { id: string; status: string }) => {
      const { error } = await supabase
        .from("orders")
        .update({ status: input.status })
        .eq("id", input.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Order updated");
      void qc.invalidateQueries({ queryKey: ["admin", "orders"] });
    },
    onError: () => toast.error("Update failed"),
  });

  const toggleMessage = useMutation({
    mutationFn: async (input: { id: string; handled: boolean }) => {
      const { error } = await supabase
        .from("contact_messages")
        .update({ handled: input.handled })
        .eq("id", input.id);
      if (error) throw error;
    },
    onSuccess: () => void qc.invalidateQueries({ queryKey: ["admin", "messages"] }),
    onError: () => toast.error("Update failed"),
  });

  if (loading) {
    return <div className="mx-auto max-w-6xl px-4 py-20 text-sm text-muted-foreground">Loading…</div>;
  }

  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-32 text-center">
        <h1 className="text-3xl">Owner access required</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          This dashboard is limited to the store owner.
        </p>
        <Link to="/admin-setup" className="mt-8 inline-block">
          <Button className="text-xs uppercase tracking-[0.25em]">Go to owner setup</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <h1 className="text-4xl sm:text-5xl">Admin</h1>

      <Tabs defaultValue="orders" className="mt-10">
        <TabsList className="flex w-full flex-wrap">
          <TabsTrigger value="orders" className="text-xs uppercase tracking-[0.2em]">
            Orders
          </TabsTrigger>
          <TabsTrigger value="products" className="text-xs uppercase tracking-[0.2em]">
            Products
          </TabsTrigger>
          <TabsTrigger value="messages" className="text-xs uppercase tracking-[0.2em]">
            Messages
          </TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="mt-8 space-y-5">
          {(orders.data ?? []).length === 0 && (
            <p className="text-sm text-muted-foreground">No orders yet.</p>
          )}
          {(orders.data ?? []).map((order) => (
            <article key={order.id} className="border border-border bg-surface p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    {formatDate(order.created_at)} · #{order.id.slice(0, 8)}
                  </p>
                  <p className="mt-2 text-sm">
                    {order.full_name} · {order.email}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {order.address}, {order.city} {order.postal_code}, {order.country}
                  </p>
                  <p className="mt-3 text-lg">{formatPrice(order.total_cents)}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {STATUSES.map((s) => (
                    <Button
                      key={s}
                      size="sm"
                      variant={order.status === s ? "default" : "outline"}
                      onClick={() => updateOrder.mutate({ id: order.id, status: s })}
                      className="text-[10px] uppercase tracking-[0.15em]"
                    >
                      {s}
                    </Button>
                  ))}
                </div>
              </div>
              <ul className="mt-5 space-y-1 border-t border-border pt-4 text-sm text-muted-foreground">
                {order.order_items.map((i) => (
                  <li key={i.id}>
                    {i.product_name} · {i.size} × {i.quantity} —{" "}
                    {formatPrice(i.unit_price_cents * i.quantity)}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </TabsContent>

        <TabsContent value="products" className="mt-8">
          <section className="border border-border bg-surface p-6">
            <h2 className="text-xl">Add a product</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="p-name">Name</Label>
                <Input
                  id="p-name"
                  value={draft.name}
                  onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="p-slug">Slug (url)</Label>
                <Input
                  id="p-slug"
                  value={draft.slug}
                  onChange={(e) => setDraft((d) => ({ ...d, slug: e.target.value }))}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="p-price">Price (USD)</Label>
                <Input
                  id="p-price"
                  type="number"
                  value={draft.price}
                  onChange={(e) => setDraft((d) => ({ ...d, price: e.target.value }))}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="p-stock">Stock</Label>
                <Input
                  id="p-stock"
                  type="number"
                  value={draft.stock}
                  onChange={(e) => setDraft((d) => ({ ...d, stock: e.target.value }))}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="p-category">Category</Label>
                <Input
                  id="p-category"
                  value={draft.category}
                  onChange={(e) => setDraft((d) => ({ ...d, category: e.target.value }))}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="p-colorway">Colorway</Label>
                <Input
                  id="p-colorway"
                  value={draft.colorway}
                  onChange={(e) => setDraft((d) => ({ ...d, colorway: e.target.value }))}
                />
              </div>
              <div className="grid gap-2 sm:col-span-2">
                <Label htmlFor="p-image">Image URL</Label>
                <Input
                  id="p-image"
                  value={draft.image_url}
                  onChange={(e) => setDraft((d) => ({ ...d, image_url: e.target.value }))}
                />
              </div>
              <div className="grid gap-2 sm:col-span-2">
                <Label htmlFor="p-desc">Description</Label>
                <Textarea
                  id="p-desc"
                  rows={3}
                  value={draft.description}
                  onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
                />
              </div>
            </div>
            <Button
              onClick={() => createProduct.mutate()}
              disabled={!draft.name || !draft.slug || createProduct.isPending}
              className="mt-6 text-xs uppercase tracking-[0.25em]"
            >
              Add product
            </Button>
          </section>

          <div className="mt-10 space-y-4">
            {(products.data ?? []).map((p) => (
              <div
                key={p.id}
                className="flex flex-wrap items-center gap-4 border border-border bg-surface p-4"
              >
                <img
                  src={p.image_url}
                  alt={p.name}
                  width={1024}
                  height={1024}
                  loading="lazy"
                  className="size-16 bg-background object-cover"
                />
                <div className="min-w-40 flex-1">
                  <p className="text-sm">{p.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatPrice(p.price_cents)} · stock {p.stock} · {p.category}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => updateProduct.mutate({ id: p.id, patch: { featured: !p.featured } })}
                  className="text-[10px] uppercase tracking-[0.15em]"
                >
                  {p.featured ? "Unfeature" : "Feature"}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => updateProduct.mutate({ id: p.id, patch: { active: !p.active } })}
                  className="text-[10px] uppercase tracking-[0.15em]"
                >
                  {p.active ? "Hide" : "Publish"}
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => deleteProduct.mutate(p.id)}
                  className="text-[10px] uppercase tracking-[0.15em]"
                >
                  Delete
                </Button>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="messages" className="mt-8 space-y-4">
          {(messages.data ?? []).length === 0 && (
            <p className="text-sm text-muted-foreground">No messages yet.</p>
          )}
          {(messages.data ?? []).map((m) => (
            <article key={m.id} className="border border-border bg-surface p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm">
                    {m.name} · <span className="text-muted-foreground">{m.email}</span>
                  </p>
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    {formatDate(m.created_at)} {m.subject ? `· ${m.subject}` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={m.handled ? "secondary" : "outline"} className="uppercase">
                    {m.handled ? "Handled" : "New"}
                  </Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleMessage.mutate({ id: m.id, handled: !m.handled })}
                    className="text-[10px] uppercase tracking-[0.15em]"
                  >
                    {m.handled ? "Reopen" : "Mark handled"}
                  </Button>
                </div>
              </div>
              <p className="mt-4 whitespace-pre-wrap text-sm text-muted-foreground">{m.message}</p>
            </article>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
