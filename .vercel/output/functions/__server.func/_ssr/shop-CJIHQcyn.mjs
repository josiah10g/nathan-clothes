import { r as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as supabase } from "./client-tCXTp6li.mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as Skeleton } from "./skeleton-D9W9wFsj.mjs";
import { t as ProductCard } from "./ProductCard-RP9ReRpc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/shop-CJIHQcyn.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var FILTERS = [
	{
		key: "all",
		label: "All"
	},
	{
		key: "hoodies",
		label: "Hoodies"
	},
	{
		key: "tees",
		label: "Tees"
	},
	{
		key: "bottoms",
		label: "Bottoms"
	}
];
function Shop() {
	const [filter, setFilter] = (0, import_react.useState)("all");
	const qc = useQueryClient();
	(0, import_react.useEffect)(() => {
		const channel = supabase.channel("shop-realtime-products").on("postgres_changes", {
			event: "*",
			schema: "public",
			table: "products"
		}, () => {
			qc.invalidateQueries({ queryKey: ["products"] });
		}).subscribe();
		return () => {
			supabase.removeChannel(channel);
		};
	}, [qc]);
	const { data, isLoading } = useQuery({
		queryKey: ["products", "all"],
		queryFn: async () => {
			const { data, error } = await supabase.from("products").select("slug,name,image_url,price_cents,colorway,category").eq("active", true).order("created_at", { ascending: true });
			if (error) throw error;
			return data ?? [];
		}
	});
	const products = (data ?? []).filter((p) => filter === "all" || p.category === filter);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-7xl px-4 py-16 sm:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-4xl sm:text-5xl",
				children: "The collection"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 max-w-lg text-sm text-muted-foreground",
				children: "Every piece is made in a limited run. Once it's gone, it's gone."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-10 flex flex-wrap gap-2",
				children: FILTERS.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setFilter(f.key),
					className: cn("border px-4 py-2 text-xs uppercase tracking-[0.2em] transition-colors", filter === f.key ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:text-foreground"),
					children: f.label
				}, f.key))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-12 grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-3",
				children: isLoading ? Array.from({ length: 6 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "aspect-square w-full" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "mt-4 h-4 w-2/3" })] }, i)) : products.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, {
					product: p,
					eager: i < 3
				}, p.slug))
			}),
			!isLoading && products.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-16 text-sm text-muted-foreground",
				children: "Nothing in this category yet."
			})
		]
	});
}
//#endregion
export { Shop as component };
