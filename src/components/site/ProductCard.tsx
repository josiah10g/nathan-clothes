import { Link } from "@tanstack/react-router";
import { formatPrice } from "@/lib/format";

export type ProductCardData = {
  slug: string;
  name: string;
  image_url: string;
  price_cents: number;
  colorway: string;
};

export function ProductCard({ product, eager = false }: { product: ProductCardData; eager?: boolean }) {
  return (
    <Link
      to="/product/$slug"
      params={{ slug: product.slug }}
      className="group block"
    >
      <div className="aspect-square overflow-hidden bg-surface">
        <img
          src={product.image_url}
          alt={product.name}
          width={1024}
          height={1024}
          {...(eager ? {} : { loading: "lazy" as const })}
          className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>
      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-sm tracking-[0.12em]">{product.name}</h3>
          <p className="mt-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            {product.colorway}
          </p>
        </div>
        <p className="text-sm text-muted-foreground">{formatPrice(product.price_cents)}</p>
      </div>
    </Link>
  );
}
