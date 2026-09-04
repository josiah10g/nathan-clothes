import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProductCard, type ProductCardData } from "@/components/site/ProductCard";
import { Button } from "@/components/ui/button";
import heroAsset from "@/assets/shadow-web-hoodie.jpg.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nathan's Clothing — Premium Dark Streetwear" },
      {
        name: "description",
        content:
          "Limited-run heavyweight streetwear: oversized hoodies, tees and joggers in a strict monochrome palette. Shop the Nathan's Clothing collection.",
      },
      { property: "og:title", content: "Nathan's Clothing — Premium Dark Streetwear" },
      {
        property: "og:description",
        content: "Limited-run heavyweight streetwear in a strict monochrome palette.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const { data: featured } = useQuery({
    queryKey: ["products", "featured"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("slug,name,image_url,price_cents,colorway")
        .eq("active", true)
        .eq("featured", true)
        .limit(4);
      if (error) throw error;
      return (data ?? []) as ProductCardData[];
    },
  });

  return (
    <div>
      <section className="relative">
        <div className="grid items-stretch md:grid-cols-2">
          <div className="flex flex-col justify-center px-4 py-20 sm:px-8 md:py-32 lg:px-16">
            <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
              Drop 01 &mdash; Void Series
            </p>
            <h1 className="mt-6 text-5xl leading-[0.95] sm:text-7xl lg:text-8xl">
              Built for
              <br />
              the dark
              <br />
              hours
            </h1>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-muted-foreground">
              Heavyweight cotton, oversized cuts and hand-drawn graphics. Made in short runs and
              never restocked.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link to="/shop">
                <Button size="lg" className="text-xs uppercase tracking-[0.25em]">
                  Shop the collection
                </Button>
              </Link>
              <Link to="/about">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-xs uppercase tracking-[0.25em]"
                >
                  Our story
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative min-h-[60vh] bg-surface md:min-h-[80vh]">
            <img
              src={heroAsset.url}
              alt="Black oversized hoodie with spiderweb print from the Nathan's Clothing Void Series"
              width={1024}
              height={1024}
              className="size-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-surface">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 py-10 text-center sm:px-6 md:grid-cols-4">
          {[
            ["100% Cotton", "Combed and ring-spun"],
            ["350–400 GSM", "True heavyweight"],
            ["Oversized fit", "Boxy, dropped shoulder"],
            ["Limited runs", "No restocks"],
          ].map(([title, sub]) => (
            <div key={title}>
              <p className="text-display text-sm tracking-[0.2em]">{title}</p>
              <p className="mt-2 text-xs text-muted-foreground">{sub}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="flex items-end justify-between">
          <h2 className="text-3xl sm:text-4xl">Featured pieces</h2>
          <Link
            to="/shop"
            className="text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground"
          >
            View all
          </Link>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-4">
          {(featured ?? []).map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
