//#region node_modules/.nitro/vite/services/ssr/assets/format-JcwKzGtU.js
function formatPrice(cents) {
	const amount = Math.round((cents ?? 0) / 100);
	return `₦${new Intl.NumberFormat("en-NG", {
		maximumFractionDigits: 0,
		minimumFractionDigits: 0
	}).format(amount)}`;
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
