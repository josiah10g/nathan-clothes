import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Minus, Plus, ShoppingBag, MessageCircle, Phone, Mail, Check } from "lucide-react";
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
  const navigate = useNavigate();
  const { add } = useCart();
  const [size, setSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [isAdding, setIsAdding] = useState(false);

  // Fetch product
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

  // Fetch store contact settings
  const { data: storeSettings } = useQuery({
    queryKey: ["store-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("store_settings")
        .select("*")
        .limit(1)
        .maybeSingle();
      if (error) return null;
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

  const soldOut = product.stock <= 0 || !product.in_stock;
  const availableSizes = product.sizes && product.sizes.length > 0 ? product.sizes : ["S", "M", "L", "XL", "XXL"];
  const chosenSize = size || availableSizes[0] || "Standard";

  const handleAdd = () => {
    if (isAdding) return;
    setIsAdding(true);
    add({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      imageUrl: product.image_url,
      size: chosenSize,
      priceCents: product.price_cents,
      quantity,
    });
    toast.success(`${quantity} × ${product.name} added to cart`);
    setTimeout(() => {
      setIsAdding(false);
    }, 800);
  };

  const handleOrderNow = () => {
    add({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      imageUrl: product.image_url,
      size: chosenSize,
      priceCents: product.price_cents,
      quantity,
    });
    navigate({ to: "/checkout" });
  };

  const contactPhone = storeSettings?.contact_phone || "+234 703 089 8561";
  const contactEmail = storeSettings?.contact_email || "emmanuelonyedikachi866@gmail.com";
  const whatsappNum = (storeSettings?.whatsapp_number || "2347030898561").replace(/[^0-9]/g, "");
  const whatsappEnquireText = encodeURIComponent(
    `Hello Nathan's Clothes, I want to enquire about "${product.name}" (Price: ${formatPrice(product.price_cents)}). Is this currently in stock?`
  );
  const whatsappEnquireUrl = `https://wa.me/${whatsappNum}?text=${whatsappEnquireText}`;

  // Breadcrumb strings
  const categoryLabel = (product.category || "CLOTHING").toUpperCase();
  const brandLabel = (product.brand || product.colorway || "STREETWEAR").toUpperCase();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Top back navigation matching reference */}
      <div className="mb-6">
        <Link
          to="/shop"
          className="inline-flex items-center gap-1.5 text-xs tracking-wider text-muted-foreground hover:text-foreground transition-colors"
        >
          <span className="text-sm">&larr;</span> All products
        </Link>
      </div>

      <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16 items-start">
        {/* Left: Product Image in dedicated showcase frame */}
        <div className="aspect-[4/5] sm:aspect-square w-full overflow-hidden bg-surface border border-border flex items-center justify-center">
          <img
            src={product.image_url}
            alt={product.name}
            width={1024}
            height={1024}
            className="size-full object-contain sm:object-cover"
          />
        </div>

        {/* Right: Product Info and actions formatted to user reference */}
        <div className="space-y-6">
          {/* Category breadcrumb */}
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground font-semibold">
            {categoryLabel} &middot; {brandLabel}
          </p>

          {/* Editorial Title */}
          <h1 className="text-4xl sm:text-5xl font-serif font-medium tracking-tight text-foreground">
            {product.name}
          </h1>

          {/* Price & Note */}
          <div className="space-y-1">
            <p className="text-3xl font-serif font-semibold text-foreground">
              {formatPrice(product.price_cents)}
            </p>
            <p className="text-xs text-muted-foreground">
              Final price confirmed at checkout by our team.
            </p>
          </div>

          {/* Stock Pill Badge */}
          <div>
            {!soldOut ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-surface px-3 py-1 text-xs text-foreground border border-border font-medium">
                <Check className="size-3.5 text-foreground" /> In stock
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-destructive/10 px-3 py-1 text-xs text-destructive border border-destructive/20 font-medium">
                ✕ Out of stock
              </span>
            )}
          </div>

          {/* Description if present */}
          {product.description && (
            <p className="text-sm leading-relaxed text-muted-foreground">
              {product.description}
            </p>
          )}

          {/* Size Selector */}
          {availableSizes.length > 1 && (
            <div className="space-y-2 pt-2">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Select Size</p>
              <div className="flex flex-wrap gap-2">
                {availableSizes.map((s: string) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSize(s)}
                    className={cn(
                      "min-w-12 border px-3 py-2 text-xs uppercase tracking-[0.15em] transition-colors rounded-none",
                      chosenSize === s
                        ? "border-foreground bg-foreground text-background font-semibold"
                        : "border-border text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Counter */}
          <div className="flex items-center gap-4 pt-1">
            <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Quantity</span>
            <div className="inline-flex items-center border border-border bg-surface">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1 || soldOut}
                className="flex size-9 items-center justify-center text-foreground hover:bg-background/80 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Decrease quantity"
              >
                <Minus className="size-3" />
              </button>
              <span className="w-10 text-center font-mono text-sm font-semibold text-foreground select-none">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.min(product.stock || 99, q + 1))}
                disabled={quantity >= (product.stock || 99) || soldOut}
                className="flex size-9 items-center justify-center text-foreground hover:bg-background/80 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Increase quantity"
              >
                <Plus className="size-3" />
              </button>
            </div>
            {product.stock > 0 && (
              <span className="text-xs text-muted-foreground">
                ({product.stock} available)
              </span>
            )}
          </div>

          {/* Primary Action Buttons Row (Matching Reference Image) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
            <Button
              type="button"
              onClick={handleOrderNow}
              disabled={soldOut}
              className="w-full bg-foreground text-background hover:bg-foreground/90 font-medium py-6 text-sm rounded-none tracking-wide"
            >
              Order now
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={handleAdd}
              disabled={soldOut || isAdding}
              className="w-full border-border bg-transparent text-foreground hover:bg-surface font-medium py-6 text-sm rounded-none tracking-wide gap-2"
            >
              <ShoppingBag className="size-4" />
              {isAdding ? "Added to cart ✓" : "Add to cart"}
            </Button>
          </div>

          {/* Enquire on WhatsApp Button (Matching Reference Image) */}
          <div className="pt-1">
            <a
              href={whatsappEnquireUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 border border-border bg-transparent px-5 py-3 text-xs tracking-wider text-foreground hover:bg-surface transition-colors w-full sm:w-auto"
            >
              <MessageCircle className="size-4 text-emerald-500" />
              Enquire on WhatsApp
            </a>
          </div>

          {/* Seller Direct Contact Info Line (Matching Reference Image) */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2 text-xs text-muted-foreground border-t border-border/50">
            <a
              href={`tel:${contactPhone}`}
              className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors"
            >
              <Phone className="size-3.5" />
              {contactPhone}
            </a>
            <a
              href={`mailto:${contactEmail}`}
              className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors"
            >
              <Mail className="size-3.5" />
              {contactEmail}
            </a>
          </div>

          {/* Specifications Section (Matching Reference Image) */}
          <div className="pt-6 border-t border-border space-y-3">
            <h2 className="text-2xl font-serif font-medium tracking-tight text-foreground">
              Specifications
            </h2>
            <div className="border-t border-border pt-3">
              <div className="flex justify-between py-2 text-xs text-muted-foreground border-b border-border/40">
                <span className="uppercase tracking-[0.2em]">Detail</span>
                <span className="text-foreground text-right max-w-xs sm:max-w-md">
                  {product.specifications || product.description || "Authentic quality & design guaranteed."}
                </span>
              </div>
              {product.colorway && (
                <div className="flex justify-between py-2 text-xs text-muted-foreground border-b border-border/40">
                  <span className="uppercase tracking-[0.2em]">Colorway</span>
                  <span className="text-foreground">{product.colorway}</span>
                </div>
              )}
              {product.brand && (
                <div className="flex justify-between py-2 text-xs text-muted-foreground border-b border-border/40">
                  <span className="uppercase tracking-[0.2em]">Brand</span>
                  <span className="text-foreground">{product.brand}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

