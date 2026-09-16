import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as formatPrice } from "./format-JcwKzGtU.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ProductCard-RP9ReRpc.js
var import_jsx_runtime = require_jsx_runtime();
function ProductCard({ product, eager = false }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: "/product/$slug",
		params: { slug: product.slug },
		className: "group block",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "aspect-square overflow-hidden bg-surface",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: product.image_url,
				alt: product.name,
				width: 1024,
				height: 1024,
				...eager ? {} : { loading: "lazy" },
				className: "size-full object-cover transition-transform duration-700 group-hover:scale-105"
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 flex items-start justify-between gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-sm tracking-[0.12em]",
				children: product.name
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-xs uppercase tracking-[0.2em] text-muted-foreground",
				children: product.colorway
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: formatPrice(product.price_cents)
			})]
		})]
	});
}
//#endregion
export { ProductCard as t };
