import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Button } from "./button-cHXlBU3y.mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as supabase } from "./client-tCXTp6li.mjs";
import { n as useAuth } from "./useAuth-C_0aa20U.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as ProductCard } from "./ProductCard-RP9ReRpc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-gKXkVeAk.js
var import_jsx_runtime = require_jsx_runtime();
var HERO_IMAGE_URL = "/images/shadow-web-hoodie.jpg";
function Home() {
	const { user } = useAuth();
	user?.user_metadata?.["full_name"] || user?.email?.split("@")[0];
	const { data: featured } = useQuery({
		queryKey: ["products", "featured"],
		queryFn: async () => {
			const { data, error } = await supabase.from("products").select("slug,name,image_url,price_cents,colorway").eq("active", true).eq("featured", true).limit(4);
			if (error) throw error;
			return data ?? [];
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "relative",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid items-stretch md:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col justify-center px-4 py-20 sm:px-8 md:py-32 lg:px-16",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs uppercase tracking-[0.4em] text-muted-foreground",
							children: "Drop 01 — Void Series"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
							className: "mt-6 text-5xl leading-[0.95] sm:text-7xl lg:text-8xl",
							children: [
								"Built for",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
								"the dark",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
								"hours"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-6 max-w-md text-sm leading-relaxed text-muted-foreground",
							children: "Heavyweight cotton, oversized cuts and hand-drawn graphics. Made in short runs and never restocked."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-10 flex flex-wrap gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/shop",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "lg",
									className: "text-xs uppercase tracking-[0.25em]",
									children: "Shop the collection"
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/about",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "lg",
									variant: "outline",
									className: "text-xs uppercase tracking-[0.25em]",
									children: "Our story"
								})
							})]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "relative min-h-[60vh] bg-surface md:min-h-[80vh]",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: HERO_IMAGE_URL,
						alt: "Black oversized hoodie with spiderweb print from the Nathan's Clothing Void Series",
						width: 1024,
						height: 1024,
						className: "size-full object-cover"
					})
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "border-y border-border bg-surface",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 py-10 text-center sm:px-6 md:grid-cols-4",
				children: [
					["100% Cotton", "Combed and ring-spun"],
					["350–400 GSM", "True heavyweight"],
					["Oversized fit", "Boxy, dropped shoulder"],
					["Limited runs", "No restocks"]
				].map(([title, sub]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-display text-sm tracking-[0.2em]",
					children: title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-xs text-muted-foreground",
					children: sub
				})] }, title))
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mx-auto max-w-7xl px-4 py-20 sm:px-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-end justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-3xl sm:text-4xl",
					children: "Featured pieces"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/shop",
					className: "text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground",
					children: "View all"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-10 grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-4",
				children: (featured ?? []).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, { product: p }, p.slug))
			})]
		})
	] });
}
//#endregion
export { Home as component };
