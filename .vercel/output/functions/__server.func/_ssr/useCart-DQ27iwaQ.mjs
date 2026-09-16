import { r as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as useAuth } from "./useAuth-C_0aa20U.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/useCart-DQ27iwaQ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var BASE_STORAGE_KEY = "nathans-clothes-cart";
var CartContext = (0, import_react.createContext)(void 0);
function CartProvider({ children }) {
	const { user, loading: authLoading } = useAuth();
	const [items, setItems] = (0, import_react.useState)([]);
	const [hydrated, setHydrated] = (0, import_react.useState)(false);
	const storageKey = (0, import_react.useMemo)(() => {
		return user ? `${BASE_STORAGE_KEY}_${user.id}` : `${BASE_STORAGE_KEY}_guest`;
	}, [user]);
	(0, import_react.useEffect)(() => {
		if (authLoading) return;
		try {
			const raw = window.localStorage.getItem(storageKey);
			if (raw) setItems(JSON.parse(raw));
			else setItems([]);
		} catch {
			setItems([]);
		}
		setHydrated(true);
	}, [storageKey, authLoading]);
	(0, import_react.useEffect)(() => {
		if (!hydrated || authLoading) return;
		window.localStorage.setItem(storageKey, JSON.stringify(items));
	}, [
		items,
		hydrated,
		storageKey,
		authLoading
	]);
	const value = (0, import_react.useMemo)(() => {
		const key = (id, size) => `${id}__${size}`;
		return {
			items,
			count: items.reduce((n, i) => n + i.quantity, 0),
			subtotalCents: items.reduce((n, i) => n + i.quantity * i.priceCents, 0),
			hydrated,
			add: (item) => setItems((prev) => {
				if (prev.find((i) => key(i.productId, i.size) === key(item.productId, item.size))) return prev.map((i) => key(i.productId, i.size) === key(item.productId, item.size) ? {
					...i,
					quantity: Math.min(10, i.quantity + item.quantity)
				} : i);
				return [...prev, item];
			}),
			setQuantity: (productId, size, quantity) => setItems((prev) => prev.map((i) => key(i.productId, i.size) === key(productId, size) ? {
				...i,
				quantity: Math.max(1, Math.min(10, quantity))
			} : i)),
			remove: (productId, size) => setItems((prev) => prev.filter((i) => key(i.productId, i.size) !== key(productId, size))),
			clear: () => setItems([])
		};
	}, [items]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartContext.Provider, {
		value,
		children
	});
}
function useCart() {
	const ctx = (0, import_react.useContext)(CartContext);
	if (!ctx) throw new Error("useCart must be used inside CartProvider");
	return ctx;
}
//#endregion
export { useCart as n, CartProvider as t };
