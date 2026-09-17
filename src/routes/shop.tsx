import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProductCard, type ProductCardData } from "@/components/site/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop All — Nathan's Clothing" },
      {
        name: "description",
        content:
          "Browse every piece in the Nathan's Clothing collection: heavyweight hoodies, oversized tees and joggers in black, bone and washed grey.",
      },
      { property: "og:title", content: "Shop All — Nathan's Clothing" },
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
  const qc = useQueryClient();

  // Real-time products and store settings synchronization
  useEffect(() => {
    const channel = supabase
      .channel("shop-realtime-sync")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "products" },
        () => {
          void qc.invalidateQueries({ queryKey: ["products"] });
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "store_settings" },
        () => {
          void qc.invalidateQueries({ queryKey: ["store-settings"] });
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [qc]);

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
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="text-3xl sm:text-5xl font-serif">The collection</h1>
      <p className="mt-3 max-w-lg text-xs sm:text-sm text-muted-foreground">
        Every piece is made in a limited run. Once it&apos;s gone, it&apos;s gone.
      </p>

      {/* Responsive horizontal filter bar */}
      <div className="mt-8 sm:mt-10 flex flex-wrap gap-2 overflow-x-auto pb-2">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={cn(
              "shrink-0 border px-3 sm:px-4 py-2 text-[11px] sm:text-xs uppercase tracking-[0.15em] sm:tracking-[0.2em] transition-colors",
              filter === f.key
                ? "border-primary bg-primary text-primary-foreground font-semibold"
                : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/40",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="mt-8 sm:mt-12 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-3">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-square w-full" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-3 w-1/3" />
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
