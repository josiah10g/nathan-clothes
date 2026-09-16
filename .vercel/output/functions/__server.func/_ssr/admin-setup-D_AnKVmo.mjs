import { r as __toESM } from "../_runtime.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as Button } from "./button-BgDHFF0o.mjs";
import { g as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as supabase } from "./client-CM2SnB7T.mjs";
import { n as useAuth } from "./useAuth-t4K7Z9WU.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-setup-D_AnKVmo.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminSetup() {
	const { isAdmin, refreshRole, user } = useAuth();
	const navigate = useNavigate();
	const [busy, setBusy] = (0, import_react.useState)(false);
	const { data: adminExists, refetch } = useQuery({
		queryKey: ["admin-exists"],
		queryFn: async () => {
			const { data, error } = await supabase.rpc("admin_exists");
			if (error) throw error;
			return !!data;
		}
	});
	const claim = async () => {
		setBusy(true);
		const { data, error } = await supabase.rpc("claim_first_admin");
		setBusy(false);
		if (error) {
			toast.error("Setup failed. Please try again.");
			return;
		}
		if (!data) {
			toast.error("An owner account already exists for this store.");
			refetch();
			return;
		}
		await refreshRole();
		toast.success("You are now the store owner.");
		navigate({ to: "/admin" });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-2xl px-4 py-20 sm:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-4xl",
				children: "Owner setup"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-4 text-sm leading-relaxed text-muted-foreground",
				children: [
					"The store has no built-in admin password. Instead, the first person to sign in and claim the store becomes the owner — and after that, this page is permanently closed. You are signed in as ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-foreground",
						children: user?.email
					}),
					"."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-10 border border-border bg-surface p-6",
				children: isAdmin ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm",
					children: "You already have owner access."
				}) : adminExists ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "An owner has already been set up for this store. Ask them to grant you access."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "No owner exists yet. Claim ownership to unlock the admin dashboard."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: claim,
					disabled: busy,
					className: "mt-6 text-xs uppercase tracking-[0.25em]",
					children: busy ? "Claiming…" : "Claim owner access"
				})] })
			})
		]
	});
}
//#endregion
export { AdminSetup as component };
