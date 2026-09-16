import { r as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as Button } from "./button-BgDHFF0o.mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as supabase } from "./client-CM2SnB7T.mjs";
import { n as formatPrice } from "./format-Cn_Ilppd.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as useCart } from "./useCart-Dzk166AX.mjs";
import { t as Route } from "./product._slug-r0UnF_Gz.mjs";
import { t as Skeleton } from "./skeleton-D9W9wFsj.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/product._slug-n64r38Zn.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ProductDetail() {
	const { slug } = Route.useParams();
	const { add } = useCart();
	const [size, setSize] = (0, import_react.useState)(null);
	const { data: product, isLoading } = useQuery({
		queryKey: ["product", slug],
		queryFn: async () => {
			const { data, error } = await supabase.from("products").select("*").eq("slug", slug).eq("active", true).maybeSingle();
			if (error) throw error;
			return data;
		}
	});
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "aspect-square w-full" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-10 w-2/3" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-4 w-full" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-4 w-4/5" })
			]
		})]
	});
	if (!product) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-3xl px-4 py-32 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-3xl",
				children: "Piece not found"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-muted-foreground",
				children: "This product may have sold out or been removed."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/shop",
				className: "mt-8 inline-block",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "text-xs uppercase tracking-[0.25em]",
					children: "Back to shop"
				})
			})
		]
	});
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
			quantity: 1
		});
		toast.success(`${product.name} (${size}) added to bag`);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/shop",
			className: "text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground",
			children: "← Back to shop"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-8 grid gap-10 md:grid-cols-2 md:gap-16",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "bg-surface",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: product.image_url,
					alt: product.name,
					width: 1024,
					height: 1024,
					className: "size-full object-cover"
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "md:py-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs uppercase tracking-[0.3em] text-muted-foreground",
						children: product.colorway
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-4 text-4xl sm:text-5xl",
						children: product.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-lg",
						children: formatPrice(product.price_cents)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-8 text-sm leading-relaxed text-muted-foreground",
						children: product.description
					}),
					product.specifications && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 rounded border border-border bg-surface p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs uppercase tracking-[0.2em] font-semibold text-foreground mb-1",
							children: "Specifications"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground leading-relaxed",
							children: product.specifications
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-10",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs uppercase tracking-[0.25em] text-muted-foreground",
							children: "Size"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 flex flex-wrap gap-2",
							children: (product.sizes || [
								"S",
								"M",
								"L",
								"XL",
								"XXL"
							]).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setSize(s),
								className: cn("min-w-14 border px-4 py-3 text-xs uppercase tracking-[0.2em] transition-colors", size === s ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:text-foreground"),
								children: s
							}, s))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "lg",
						onClick: handleAdd,
						disabled: soldOut,
						className: "mt-10 w-full text-xs uppercase tracking-[0.25em]",
						children: soldOut ? "Sold out" : "Add to bag"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "mt-10 space-y-2 border-t border-border pt-8 text-xs uppercase tracking-[0.15em] text-muted-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Free shipping over $150" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "30-day returns" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: ["Brand: ", product.brand || "Nathan Clothes"] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: product.stock > 0 && product.in_stock ? `${product.stock} left in this run` : "Sold out" })
						]
					})
				]
			})]
		})]
	});
}
//#endregion
export { ProductDetail as component };
