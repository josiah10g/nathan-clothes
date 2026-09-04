import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/format";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Bag — Nathan's Clothing" },
      { name: "description", content: "Review the pieces in your bag before checking out." },
      { property: "og:title", content: "Your Bag — Nathan's Clothing" },
      { property: "og:description", content: "Review the pieces in your bag before checking out." },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { items, subtotalCents, setQuantity, remove } = useCart();
  const shipping = subtotalCents === 0 || subtotalCents >= 15000 ? 0 : 900;

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <h1 className="text-4xl sm:text-5xl">Your bag</h1>

      {items.length === 0 ? (
        <div className="mt-12">
          <p className="text-sm text-muted-foreground">Your bag is empty.</p>
          <Link to="/shop" className="mt-6 inline-block">
            <Button className="text-xs uppercase tracking-[0.25em]">Start shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_320px]">
          <ul className="divide-y divide-border border-y border-border">
            {items.map((item) => (
              <li key={`${item.productId}-${item.size}`} className="flex gap-4 py-6">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  width={1024}
                  height={1024}
                  loading="lazy"
                  className="size-24 shrink-0 bg-surface object-cover sm:size-32"
                />
                <div className="flex flex-1 flex-col justify-between">
                  <div className="flex justify-between gap-3">
                    <div>
                      <p className="text-sm tracking-[0.1em]">{item.name}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                        Size {item.size}
                      </p>
                    </div>
                    <p className="text-sm">{formatPrice(item.priceCents * item.quantity)}</p>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center border border-border">
                      <button
                        aria-label="Decrease quantity"
                        className="px-3 py-2 text-muted-foreground hover:text-foreground"
                        onClick={() => setQuantity(item.productId, item.size, item.quantity - 1)}
                      >
                        <Minus className="size-3" />
                      </button>
                      <span className="min-w-8 text-center text-sm">{item.quantity}</span>
                      <button
                        aria-label="Increase quantity"
                        className="px-3 py-2 text-muted-foreground hover:text-foreground"
                        onClick={() => setQuantity(item.productId, item.size, item.quantity + 1)}
                      >
                        <Plus className="size-3" />
                      </button>
                    </div>
                    <button
                      aria-label="Remove item"
                      onClick={() => remove(item.productId, item.size)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <aside className="h-fit border border-border bg-surface p-6">
            <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Summary</p>
            <dl className="mt-6 space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Subtotal</dt>
                <dd>{formatPrice(subtotalCents)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Shipping</dt>
                <dd>{shipping === 0 ? "Free" : formatPrice(shipping)}</dd>
              </div>
              <div className="flex justify-between border-t border-border pt-3 text-base">
                <dt>Total</dt>
                <dd>{formatPrice(subtotalCents + shipping)}</dd>
              </div>
            </dl>
            <Link to="/checkout" className="mt-8 block">
              <Button size="lg" className="w-full text-xs uppercase tracking-[0.25em]">
                Checkout
              </Button>
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}
