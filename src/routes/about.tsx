import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import fabricAsset from "@/assets/web-realm-tee.jpg.asset.json";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Nathan's Clothes" },
      {
        name: "description",
        content:
          "Nathan's Clothes makes heavyweight monochrome streetwear in limited runs — 100% cotton, oversized fit, hand-drawn graphics.",
      },
      { property: "og:title", content: "About — Nathan's Clothes" },
      {
        property: "og:description",
        content: "Heavyweight monochrome streetwear, made in limited runs.",
      },
    ],
  }),
  component: About,
});

function About() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <h1 className="max-w-3xl text-4xl leading-tight sm:text-6xl">
        A monochrome uniform for people who don&apos;t need colour
      </h1>

      <div className="mt-14 grid gap-12 md:grid-cols-2">
        <div className="space-y-6 text-sm leading-relaxed text-muted-foreground">
          <p>
            Nathan&apos;s Clothes started with one hoodie and one rule: nothing leaves the studio
            unless it feels heavy in the hand. Every garment is cut oversized, sewn from combed
            cotton at 350&ndash;400 GSM and finished with woven labels, custom drawstrings and
            embroidered marks.
          </p>
          <p>
            Graphics are drawn by hand &mdash; webs, flames, crowns, stars &mdash; then printed in a
            palette of black, bone, washed grey, brown and taupe. No seasonal noise, no
            restocks. When a run sells out it makes way for the next one.
          </p>
          <p>
            Orders ship worldwide within two business days. Returns stay open for 30 days, no
            questions asked.
          </p>
          <div className="pt-4">
            <Link to="/shop">
              <Button size="lg" className="text-xs uppercase tracking-[0.25em]">
                Shop the collection
              </Button>
            </Link>
          </div>
        </div>
        <div className="bg-surface">
          <img
            src={fabricAsset.url}
            alt="Washed grey heavyweight tee with a spiderweb back print"
            width={1024}
            height={1024}
            loading="lazy"
            className="size-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
