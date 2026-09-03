import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProductCard, type ProductCardData } from "@/components/site/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop All — Nathan's Clothes" },
      {
        name: "description",
        content:
          "Browse every piece in the Nathan's Clothes collection: heavyweight hoodies, oversized tees and joggers in black, bone and washed grey.",
      },
      { property: "og:title", content: "Shop All — Nathan's Clothes" },
      {
        property: "og:description",
        content: "Heavyweight hoodies, oversized tees and joggers in monochrome.",
      },
    ],
  }),
  component: Shop,
});

const FILTERS = [
  { key: "all", label: "All" },
  { key: "hoodies", label: "Hoodies" },
  { key: "tees", label: "Tees" },
  { key: "bottoms", label: "Bottoms" },
] as const;

type Filter = (typeof FILTERS)[number]["key"];

function Shop() {
  const [filter, setFilter] = useState<Filter>("all");

  const { data, isLoading } = useQuery({
    queryKey: ["products", "all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("slug,name,image_url,price_cents,colorway,category")
        .eq("active", true)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data ?? []) as (ProductCardData & { category: string })[];
    },
  });

  const products = (data ?? []).filter((p) => filter === "all" || p.category === filter);

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <h1 className="text-4xl sm:text-5xl">The collection</h1>
      <p className="mt-3 max-w-lg text-sm text-muted-foreground">
        Every piece is made in a limited run. Once it&apos;s gone, it&apos;s gone.
      </p>

      <div className="mt-10 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={cn(
              "border px-4 py-2 text-xs uppercase tracking-[0.2em] transition-colors",
              filter === f.key
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border text-muted-foreground hover:text-foreground",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-3">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i}>
                <Skeleton className="aspect-square w-full" />
                <Skeleton className="mt-4 h-4 w-2/3" />
              </div>
            ))
          : products.map((p, i) => <ProductCard key={p.slug} product={p} eager={i < 3} />)}
      </div>

      {!isLoading && products.length === 0 && (
        <p className="mt-16 text-sm text-muted-foreground">Nothing in this category yet.</p>
      )}
    </div>
  );
}
