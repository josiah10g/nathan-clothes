import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Minus, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/product/$slug")({
  head: ({ params }) => {
    const title = `${params.slug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ")} — Nathan's Clothing`;
    return {
      meta: [
        { title },
        {
          name: "description",
          content: "Heavyweight limited-run streetwear from Nathan's Clothing. 100% cotton, oversized fit.",
        },
        { property: "og:title", content: title },
        {
          property: "og:description",
          content: "Heavyweight limited-run streetwear from Nathan's Clothing.",
        },
      ],
    };
  },
  component: ProductDetail,
});

function ProductDetail() {
  const { slug } = Route.useParams();
  const { add } = useCart();
  const [size, setSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [isAdding, setIsAdding] = useState(false);

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("slug", slug)
        .eq("active", true)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-2">
        <Skeleton className="aspect-square w-full" />
        <div className="space-y-4">
          <Skeleton className="h-10 w-2/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-32 text-center">
        <h1 className="text-3xl">Piece not found</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          This product may have sold out or been removed.
        </p>
        <Link to="/shop" className="mt-8 inline-block">
          <Button className="text-xs uppercase tracking-[0.25em]">Back to shop</Button>
        </Link>
      </div>
    );
  }

  const soldOut = product.stock <= 0;

  const handleAdd = () => {
    if (isAdding) return; // Prevent spam / rapid-clicking
    if (!size) {
      toast.error("Choose a size first");
      return;
    }
    setIsAdding(true);
    add({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      imageUrl: product.image_url,
      size,
      priceCents: product.price_cents,
      quantity,
    });
    toast.success(
      `${quantity} × ${product.name} (${size}) added to bag`
    );
    setTimeout(() => {
      setIsAdding(false);
    }, 1200);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16">
      <Link
        to="/shop"
        className="text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground"
      >
        &larr; Back to shop
      </Link>

      <div className="mt-8 grid gap-10 md:grid-cols-2 md:gap-16">
        <div className="bg-surface">
          <img
            src={product.image_url}
            alt={product.name}
            width={1024}
            height={1024}
            className="size-full object-cover"
          />
        </div>

        <div className="md:py-4">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            {product.colorway}
          </p>
          <h1 className="mt-4 text-4xl sm:text-5xl">{product.name}</h1>
          <p className="mt-4 text-lg">{formatPrice(product.price_cents)}</p>

          <p className="mt-8 text-sm leading-relaxed text-muted-foreground">
            {product.description}
          </p>

          {product.specifications && (
            <div className="mt-8 rounded border border-border bg-surface p-4">
              <p className="text-xs uppercase tracking-[0.2em] font-semibold text-foreground mb-1">Specifications</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{product.specifications}</p>
            </div>
          )}

          <div className="mt-10">
            <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Size</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {(product.sizes || ["S", "M", "L", "XL", "XXL"]).map((s: string) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={cn(
                    "min-w-14 border px-4 py-3 text-xs uppercase tracking-[0.2em] transition-colors",
                    size === s
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border text-muted-foreground hover:text-foreground",
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-3">Quantity</p>
              <div className="inline-flex items-center border border-border bg-surface">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1 || soldOut}
                  className="flex size-11 items-center justify-center text-foreground hover:bg-background/80 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  aria-label="Decrease quantity"
                >
                  <Minus className="size-3.5" />
                </button>
                <span className="w-12 text-center font-mono text-sm font-semibold text-foreground select-none">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(product.stock || 99, q + 1))}
                  disabled={quantity >= (product.stock || 99) || soldOut}
                  className="flex size-11 items-center justify-center text-foreground hover:bg-background/80 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  aria-label="Increase quantity"
                >
                  <Plus className="size-3.5" />
                </button>
              </div>
            </div>

            {product.stock > 0 ? (
              <div className="self-end pb-2">
                <p className="text-[11px] text-muted-foreground uppercase tracking-wider">
                  {product.stock} units available
                </p>
              </div>
            ) : (
              <div className="self-end pb-2">
                <p className="text-[11px] text-destructive uppercase tracking-wider font-medium">
                  Not in stock yet
                </p>
              </div>
            )}
          </div>

          <Button
            size="lg"
            onClick={handleAdd}
            disabled={soldOut || isAdding}
            className="mt-8 w-full text-xs uppercase tracking-[0.25em] h-12 transition-all"
          >
            {soldOut
              ? "Not in stock yet"
              : isAdding
                ? "Added to bag ✓"
                : `Add ${quantity > 1 ? `${quantity} items ` : ""}to bag · ${formatPrice(product.price_cents * quantity)}`}
          </Button>

          <ul className="mt-10 space-y-2 border-t border-border pt-8 text-xs uppercase tracking-[0.15em] text-muted-foreground">
            <li>30-day returns</li>
            <li>{product.stock > 0 && product.in_stock ? `${product.stock} left in this run` : "Not in stock yet"}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
