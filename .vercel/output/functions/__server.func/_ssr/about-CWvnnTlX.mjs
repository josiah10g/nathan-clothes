import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as Button } from "./button-BgDHFF0o.mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/about-CWvnnTlX.js
var import_jsx_runtime = require_jsx_runtime();
var FABRIC_IMAGE_URL = "/images/web-realm-tee.jpg";
function About() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-7xl px-4 py-16 sm:px-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "max-w-3xl text-4xl leading-tight sm:text-6xl",
			children: "A monochrome uniform for people who don't need colour"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-14 grid gap-12 md:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-6 text-sm leading-relaxed text-muted-foreground",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Nathan's Clothes started with one hoodie and one rule: nothing leaves the studio unless it feels heavy in the hand. Every garment is cut oversized, sewn from combed cotton at 350–400 GSM and finished with woven labels, custom drawstrings and embroidered marks." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Graphics are drawn by hand — webs, flames, crowns, stars — then printed in a palette of black, bone, washed grey, brown and taupe. No seasonal noise, no restocks. When a run sells out it makes way for the next one." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Orders ship promptly within two business days. Returns stay open for 30 days, no questions asked." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "pt-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/shop",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "lg",
								className: "text-xs uppercase tracking-[0.25em]",
								children: "Shop the collection"
							})
						})
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "bg-surface",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: FABRIC_IMAGE_URL,
					alt: "Washed grey heavyweight tee with a spiderweb back print",
					width: 1024,
					height: 1024,
					loading: "lazy",
					className: "size-full object-cover"
				})
			})]
		})]
	});
}
//#endregion
export { About as component };
