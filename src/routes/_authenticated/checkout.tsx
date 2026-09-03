import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatPrice } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — Nathan's Clothes" },
      { name: "description", content: "Confirm your shipping details and place your order." },
      { property: "og:title", content: "Checkout — Nathan's Clothes" },
      { property: "og:description", content: "Confirm your shipping details and place your order." },
    ],
  }),
  component: Checkout,
});

const schema = z.object({
  full_name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  address: z.string().trim().min(1, "Address is required").max(200),
  city: z.string().trim().min(1, "City is required").max(100),
  postal_code: z.string().trim().min(1, "Postal code is required").max(20),
  country: z.string().trim().min(1, "Country is required").max(100),
  phone: z.string().trim().max(30).optional(),
});

function Checkout() {
  const { user } = useAuth();
  const { items, subtotalCents, clear } = useCart();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [values, setValues] = useState({
    full_name: "",
    email: user?.email ?? "",
    address: "",
    city: "",
    postal_code: "",
    country: "",
    phone: "",
  });

  const shipping = subtotalCents >= 15000 ? 0 : 900;
  const total = subtotalCents + shipping;

  const field = (key: keyof typeof values, label: string, type = "text") => (
    <div className="grid gap-2">
      <Label htmlFor={key}>{label}</Label>
      <Input
        id={key}
        type={type}
        value={values[key]}
        onChange={(e) => setValues((v) => ({ ...v, [key]: e.target.value }))}
      />
      {errors[key] && <p className="text-xs text-destructive">{errors[key]}</p>}
    </div>
  );

  const placeOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || items.length === 0) return;
    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) next[String(issue.path[0])] = issue.message;
      setErrors(next);
      return;
    }
    setErrors({});
    setBusy(true);

    const { data: order, error } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        full_name: parsed.data.full_name,
        email: parsed.data.email,
        address: parsed.data.address,
        city: parsed.data.city,
        postal_code: parsed.data.postal_code,
        country: parsed.data.country,
        phone: parsed.data.phone ?? "",
        total_cents: total,
        status: "pending",
      })
      .select("id")
      .single();

    if (error || !order) {
      setBusy(false);
      toast.error("We couldn't place your order. Please try again.");
      return;
    }

    const { error: itemsError } = await supabase.from("order_items").insert(
      items.map((i) => ({
        order_id: order.id,
        product_id: i.productId,
        product_name: i.name,
        image_url: i.imageUrl,
        size: i.size,
        unit_price_cents: i.priceCents,
        quantity: i.quantity,
      })),
    );
    setBusy(false);

    if (itemsError) {
      toast.error("Your order was created but items failed to save. Contact us for help.");
      return;
    }

    clear();
    toast.success("Order placed — thank you.");
    navigate({ to: "/account" });
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-32 text-center">
        <h1 className="text-3xl">Your bag is empty</h1>
        <Link to="/shop" className="mt-8 inline-block">
          <Button className="text-xs uppercase tracking-[0.25em]">Shop the collection</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <h1 className="text-4xl sm:text-5xl">Checkout</h1>

      <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_320px]">
        <form onSubmit={placeOrder} className="grid gap-5">
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
            Shipping details
          </p>
          {field("full_name", "Full name")}
          {field("email", "Email", "email")}
          {field("address", "Address")}
          <div className="grid gap-5 sm:grid-cols-2">
            {field("city", "City")}
            {field("postal_code", "Postal code")}
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {field("country", "Country")}
            {field("phone", "Phone (optional)")}
          </div>
          <Button
            type="submit"
            size="lg"
            disabled={busy}
            className="mt-4 text-xs uppercase tracking-[0.25em]"
          >
            {busy ? "Placing order…" : `Place order · ${formatPrice(total)}`}
          </Button>
          <p className="text-xs text-muted-foreground">
            Payment is arranged by email after the order is confirmed.
          </p>
        </form>

        <aside className="h-fit border border-border bg-surface p-6">
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Your order</p>
          <ul className="mt-5 space-y-4">
            {items.map((i) => (
              <li key={`${i.productId}-${i.size}`} className="flex justify-between gap-3 text-sm">
                <span className="text-muted-foreground">
                  {i.name} · {i.size} × {i.quantity}
                </span>
                <span>{formatPrice(i.priceCents * i.quantity)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-6 space-y-3 border-t border-border pt-5 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Shipping</dt>
              <dd>{shipping === 0 ? "Free" : formatPrice(shipping)}</dd>
            </div>
            <div className="flex justify-between text-base">
              <dt>Total</dt>
              <dd>{formatPrice(total)}</dd>
            </div>
          </dl>
        </aside>
      </div>
    </div>
  );
}
