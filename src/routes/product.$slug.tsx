import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
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
    if (!size) {
      toast.error("Choose a size first");
      return;
    }
    add({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      imageUrl: product.image_url,
      size,
      priceCents: product.price_cents,
      quantity: 1,
    });
    toast.success(`${product.name} (${size}) added to bag`);
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

          <div className="mt-10">
            <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Size</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {product.sizes.map((s: string) => (
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

          <Button
            size="lg"
            onClick={handleAdd}
            disabled={soldOut}
            className="mt-10 w-full text-xs uppercase tracking-[0.25em]"
          >
            {soldOut ? "Sold out" : "Add to bag"}
          </Button>

          <ul className="mt-10 space-y-2 border-t border-border pt-8 text-xs uppercase tracking-[0.15em] text-muted-foreground">
            <li>Free shipping over $150</li>
            <li>30-day returns</li>
            <li>{product.stock > 0 ? `${product.stock} left in this run` : "Sold out"}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
