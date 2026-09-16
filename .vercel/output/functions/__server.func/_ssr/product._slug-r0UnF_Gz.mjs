import { f as lazyRouteComponent, p as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/product._slug-r0UnF_Gz.js
var $$splitComponentImporter = () => import("./product._slug-n64r38Zn.mjs");
var Route = createFileRoute("/product/$slug")({
	head: ({ params }) => {
		const title = `${params.slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")} — Nathan's Clothing`;
		return { meta: [
			{ title },
			{
				name: "description",
				content: "Heavyweight limited-run streetwear from Nathan's Clothing. 100% cotton, oversized fit."
			},
			{
				property: "og:title",
				content: title
			},
			{
				property: "og:description",
				content: "Heavyweight limited-run streetwear from Nathan's Clothing."
			}
		] };
	},
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
