import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/format";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Cart — Nathan's Clothing" },
      { name: "description", content: "Review the pieces in your bag before checking out." },
      { property: "og:title", content: "Your Bag — Nathan's Clothing" },
      { property: "og:description", content: "Review the pieces in your bag before checking out." },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { items, subtotalCents, setQuantity, remove } = useCart();

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:py-16 sm:px-6">
      <h1 className="text-3xl sm:text-5xl font-serif">Your bag</h1>

      {items.length === 0 ? (
        <div className="mt-8 sm:mt-12">
          <p className="text-sm text-muted-foreground">Your bag is empty.</p>
          <Link to="/shop" className="mt-6 inline-block">
            <Button className="text-xs uppercase tracking-[0.25em]">Start shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="mt-8 sm:mt-12 grid gap-8 lg:grid-cols-[1fr_320px] items-start">
          <ul className="divide-y divide-border border-y border-border">
            {items.map((item) => (
              <li key={`${item.productId}-${item.size}`} className="flex flex-col sm:flex-row gap-4 py-5 sm:py-6">
                <div className="flex gap-4 items-start sm:items-center">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    width={1024}
                    height={1024}
                    loading="lazy"
                    className="size-20 sm:size-28 shrink-0 bg-surface object-cover border border-border"
                  />
                  <div className="flex-1 sm:hidden">
                    <p className="text-sm font-medium tracking-wide text-foreground">{item.name}</p>
                    <p className="mt-0.5 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      Size {item.size}
                    </p>
                    <p className="mt-2 text-sm font-semibold text-foreground">
                      {formatPrice(item.priceCents * item.quantity)}
                    </p>
                  </div>
                </div>

                <div className="flex flex-1 flex-col justify-between">
                  <div className="hidden sm:flex justify-between gap-3">
                    <div>
                      <p className="text-sm tracking-wide text-foreground font-medium">{item.name}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                        Size {item.size}
                      </p>
                    </div>
                    <p className="text-sm font-semibold">{formatPrice(item.priceCents * item.quantity)}</p>
                  </div>

                  <div className="mt-3 sm:mt-4 flex items-center justify-between">
                    <div className="flex items-center border border-border bg-surface">
                      <button
                        aria-label="Decrease quantity"
                        className="px-2.5 sm:px-3 py-1.5 text-muted-foreground hover:text-foreground transition-colors"
                        onClick={() => setQuantity(item.productId, item.size, item.quantity - 1)}
                      >
                        <Minus className="size-3" />
                      </button>
                      <span className="min-w-7 sm:min-w-8 text-center text-xs sm:text-sm font-mono font-medium">{item.quantity}</span>
                      <button
                        aria-label="Increase quantity"
                        className="px-2.5 sm:px-3 py-1.5 text-muted-foreground hover:text-foreground transition-colors"
                        onClick={() => setQuantity(item.productId, item.size, item.quantity + 1)}
                      >
                        <Plus className="size-3" />
                      </button>
                    </div>
                    <button
                      aria-label="Remove item"
                      onClick={() => remove(item.productId, item.size)}
                      className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <aside className="h-fit border border-border bg-surface p-5 sm:p-6 lg:sticky lg:top-24">
            <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground font-semibold">Summary</p>
            <dl className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Subtotal</dt>
                <dd className="font-medium text-foreground">{formatPrice(subtotalCents)}</dd>
              </div>
              <div className="flex justify-between border-t border-border pt-3 text-base">
                <dt className="font-semibold text-foreground">Total</dt>
                <dd className="font-bold text-foreground">{formatPrice(subtotalCents)}</dd>
              </div>
            </dl>
            <Link to="/checkout" className="mt-6 block">
              <Button size="lg" className="w-full text-xs uppercase tracking-[0.25em] py-5">
                Proceed to Checkout
              </Button>
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}
