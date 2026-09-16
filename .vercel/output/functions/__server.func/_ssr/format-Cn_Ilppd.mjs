//#region node_modules/.nitro/vite/services/ssr/assets/format-Cn_Ilppd.js
function formatPrice(cents) {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD"
	}).format((cents ?? 0) / 100);
}
function formatDate(value) {
	return new Date(value).toLocaleDateString("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric"
	});
}
//#endregion
export { formatPrice as n, formatDate as t };
