import { f as lazyRouteComponent, p as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-BiTRuWDL.js
var $$splitComponentImporter = () => import("./auth-Cq1FtfbN.mjs");
var Route = createFileRoute("/auth")({
	validateSearch: (search) => ({
		redirect: typeof search["redirect"] === "string" ? search["redirect"] : void 0,
		mode: search["mode"] === "signup" ? "signup" : "signin"
	}),
	head: () => ({ meta: [
		{ title: "Sign In — Nathan's Clothes" },
		{
			name: "description",
			content: "Sign in or create a Nathan's Clothes account to check out and track your orders."
		},
		{
			property: "og:title",
			content: "Sign In — Nathan's Clothes"
		},
		{
			property: "og:description",
			content: "Sign in or create a Nathan's Clothes account."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
