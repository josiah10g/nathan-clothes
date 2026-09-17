import { r as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Button } from "./button-cHXlBU3y.mjs";
import { g as useNavigate, h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as supabase } from "./client-BpGEELM-.mjs";
import { n as formatPrice } from "./format-JcwKzGtU.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { E as Check, c as Phone, d as Minus, f as MessageCircle, m as Mail, o as ShoppingBag, s as Plus } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as useCart } from "./useCart-B6US-OkA.mjs";
import { t as Route } from "./product._slug-BYjMtkLh.mjs";
import { t as Skeleton } from "./skeleton-D9W9wFsj.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/product._slug-9iy9Yoku.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ProductDetail() {
	const { slug } = Route.useParams();
	const navigate = useNavigate();
	const { add } = useCart();
	const [size, setSize] = (0, import_react.useState)(null);
	const [quantity, setQuantity] = (0, import_react.useState)(1);
	const [isAdding, setIsAdding] = (0, import_react.useState)(false);
	const { data: product, isLoading } = useQuery({
		queryKey: ["product", slug],
		queryFn: async () => {
			const { data, error } = await supabase.from("products").select("*").eq("slug", slug).eq("active", true).maybeSingle();
			if (error) throw error;
			return data;
		}
	});
	const { data: storeSettings } = useQuery({
		queryKey: ["store-settings"],
		queryFn: async () => {
			const { data, error } = await supabase.from("store_settings").select("*").limit(1).maybeSingle();
			if (error) return null;
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
	const soldOut = product.stock <= 0 || !product.in_stock;
	const availableSizes = product.sizes && product.sizes.length > 0 ? product.sizes : [
		"S",
		"M",
		"L",
		"XL",
		"XXL"
	];
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
			quantity
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
			quantity
		});
		navigate({ to: "/checkout" });
	};
	const contactPhone = storeSettings?.contact_phone || "+234 703 089 8561";
	const contactEmail = storeSettings?.contact_email || "emmanuelonyedikachi866@gmail.com";
	const whatsappEnquireUrl = `https://wa.me/${(storeSettings?.whatsapp_number || "2347030898561").replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`Hello Nathan's Clothes, I want to enquire about "${product.name}" (Price: ${formatPrice(product.price_cents)}). Is this currently in stock?`)}`;
	const categoryLabel = (product.category || "CLOTHING").toUpperCase();
	const brandLabel = (product.brand || product.colorway || "STREETWEAR").toUpperCase();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/shop",
				className: "inline-flex items-center gap-1.5 text-xs tracking-wider text-muted-foreground hover:text-foreground transition-colors",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-sm",
					children: "←"
				}), " All products"]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16 items-start",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "aspect-[4/5] sm:aspect-square w-full overflow-hidden bg-surface border border-border flex items-center justify-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: product.image_url,
					alt: product.name,
					width: 1024,
					height: 1024,
					className: "size-full object-contain sm:object-cover"
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs uppercase tracking-[0.25em] text-muted-foreground font-semibold",
						children: [
							categoryLabel,
							" · ",
							brandLabel
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-4xl sm:text-5xl font-serif font-medium tracking-tight text-foreground",
						children: product.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-3xl font-serif font-semibold text-foreground",
							children: formatPrice(product.price_cents)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Final price confirmed at checkout by our team."
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: !soldOut ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "inline-flex items-center gap-1.5 rounded-full bg-surface px-3 py-1 text-xs text-foreground border border-border font-medium",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3.5 text-foreground" }), " In stock"]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "inline-flex items-center gap-1.5 rounded-full bg-destructive/10 px-3 py-1 text-xs text-destructive border border-destructive/20 font-medium",
						children: "✕ Out of stock"
					}) }),
					product.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm leading-relaxed text-muted-foreground",
						children: product.description
					}),
					availableSizes.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2 pt-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs uppercase tracking-[0.2em] text-muted-foreground",
							children: "Select Size"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-2",
							children: availableSizes.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setSize(s),
								className: cn("min-w-12 border px-3 py-2 text-xs uppercase tracking-[0.15em] transition-colors rounded-none", chosenSize === s ? "border-foreground bg-foreground text-background font-semibold" : "border-border text-muted-foreground hover:text-foreground"),
								children: s
							}, s))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-4 pt-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs uppercase tracking-[0.2em] text-muted-foreground",
								children: "Quantity"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "inline-flex items-center border border-border bg-surface",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setQuantity((q) => Math.max(1, q - 1)),
										disabled: quantity <= 1 || soldOut,
										className: "flex size-9 items-center justify-center text-foreground hover:bg-background/80 transition-colors disabled:opacity-30 disabled:cursor-not-allowed",
										"aria-label": "Decrease quantity",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, { className: "size-3" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "w-10 text-center font-mono text-sm font-semibold text-foreground select-none",
										children: quantity
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setQuantity((q) => Math.min(product.stock || 99, q + 1)),
										disabled: quantity >= (product.stock || 99) || soldOut,
										className: "flex size-9 items-center justify-center text-foreground hover:bg-background/80 transition-colors disabled:opacity-30 disabled:cursor-not-allowed",
										"aria-label": "Increase quantity",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-3" })
									})
								]
							}),
							product.stock > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-xs text-muted-foreground",
								children: [
									"(",
									product.stock,
									" available)"
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							onClick: handleOrderNow,
							disabled: soldOut,
							className: "w-full bg-foreground text-background hover:bg-foreground/90 font-medium py-6 text-sm rounded-none tracking-wide",
							children: "Order now"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "button",
							variant: "outline",
							onClick: handleAdd,
							disabled: soldOut || isAdding,
							className: "w-full border-border bg-transparent text-foreground hover:bg-surface font-medium py-6 text-sm rounded-none tracking-wide gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { className: "size-4" }), isAdding ? "Added to cart ✓" : "Add to cart"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "pt-1",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: whatsappEnquireUrl,
							target: "_blank",
							rel: "noopener noreferrer",
							className: "inline-flex items-center justify-center gap-2 border border-border bg-transparent px-5 py-3 text-xs tracking-wider text-foreground hover:bg-surface transition-colors w-full sm:w-auto",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "size-4 text-emerald-500" }), "Enquire on WhatsApp"]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-x-6 gap-y-2 pt-2 text-xs text-muted-foreground border-t border-border/50",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: `tel:${contactPhone}`,
							className: "inline-flex items-center gap-1.5 hover:text-foreground transition-colors",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "size-3.5" }), contactPhone]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: `mailto:${contactEmail}`,
							className: "inline-flex items-center gap-1.5 hover:text-foreground transition-colors",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "size-3.5" }), contactEmail]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pt-6 border-t border-border space-y-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-2xl font-serif font-medium tracking-tight text-foreground",
							children: "Specifications"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "border-t border-border pt-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between py-2 text-xs text-muted-foreground border-b border-border/40",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "uppercase tracking-[0.2em]",
										children: "Detail"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-foreground text-right max-w-xs sm:max-w-md",
										children: product.specifications || product.description || "Authentic quality & design guaranteed."
									})]
								}),
								product.colorway && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between py-2 text-xs text-muted-foreground border-b border-border/40",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "uppercase tracking-[0.2em]",
										children: "Colorway"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-foreground",
										children: product.colorway
									})]
								}),
								product.brand && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between py-2 text-xs text-muted-foreground border-b border-border/40",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "uppercase tracking-[0.2em]",
										children: "Brand"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-foreground",
										children: product.brand
									})]
								})
							]
						})]
					})
				]
			})]
		})]
	});
}
//#endregion
export { ProductDetail as component };
