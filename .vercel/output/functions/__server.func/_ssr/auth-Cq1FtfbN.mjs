import { r as __toESM } from "../_runtime.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as Button } from "./button-BgDHFF0o.mjs";
import { g as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as supabase } from "./client-CM2SnB7T.mjs";
import { n as useAuth } from "./useAuth-t4K7Z9WU.mjs";
import { n as Label, t as Input } from "./label-B7oQAA24.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-CCJRliUM.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Route } from "./auth-BiTRuWDL.mjs";
import { n as stringType, t as objectType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-Cq1FtfbN.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var credentials = objectType({
	email: stringType().trim().email("Enter a valid email").max(255),
	password: stringType().min(8, "Use at least 8 characters").max(72)
});
function safePath(path) {
	if (!path || !path.startsWith("/") || path.startsWith("//")) return "/account";
	return path;
}
function AuthPage() {
	const { redirect, mode } = Route.useSearch();
	const { user } = useAuth();
	const navigate = useNavigate();
	const target = safePath(redirect);
	const [activeTab, setActiveTab] = (0, import_react.useState)(mode || "signin");
	(0, import_react.useEffect)(() => {
		if (mode) setActiveTab(mode);
	}, [mode]);
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [fullName, setFullName] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (user) navigate({
			to: target,
			replace: true
		});
	}, [
		user,
		target,
		navigate
	]);
	const signIn = async (e) => {
		e.preventDefault();
		const parsed = credentials.safeParse({
			email,
			password
		});
		if (!parsed.success) {
			toast.error(parsed.error.issues[0].message);
			return;
		}
		setBusy(true);
		const { error } = await supabase.auth.signInWithPassword(parsed.data);
		setBusy(false);
		if (error) {
			toast.error(error.message);
			return;
		}
		navigate({
			to: target,
			replace: true
		});
	};
	const signUp = async (e) => {
		e.preventDefault();
		const parsed = credentials.safeParse({
			email,
			password
		});
		if (!parsed.success) {
			toast.error(parsed.error.issues[0].message);
			return;
		}
		setBusy(true);
		const { data, error } = await supabase.auth.signUp({
			...parsed.data,
			options: {
				emailRedirectTo: window.location.origin,
				data: { full_name: fullName.trim() }
			}
		});
		setBusy(false);
		if (error) {
			toast.error(error.message);
			return;
		}
		if (!data.session) {
			toast.success("Check your email to confirm your account.");
			return;
		}
		navigate({
			to: target,
			replace: true
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-md px-4 py-20 sm:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-center text-4xl",
				children: "Account"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-center text-sm text-muted-foreground",
				children: "Sign in to manage your orders or track your purchases."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
				value: activeTab,
				onValueChange: setActiveTab,
				className: "mt-10",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
						className: "grid w-full grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "signin",
							className: "text-xs uppercase tracking-[0.2em]",
							children: "Sign in"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "signup",
							className: "text-xs uppercase tracking-[0.2em]",
							children: "Create account"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "signin",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit: signIn,
							className: "mt-6 grid gap-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "signin-email",
										children: "Email"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "signin-email",
										type: "email",
										value: email,
										onChange: (e) => setEmail(e.target.value)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "signin-password",
										children: "Password"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "signin-password",
										type: "password",
										value: password,
										onChange: (e) => setPassword(e.target.value)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "submit",
									disabled: busy,
									className: "text-xs uppercase tracking-[0.25em]",
									children: busy ? "Signing in…" : "Sign in"
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "signup",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit: signUp,
							className: "mt-6 grid gap-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "signup-name",
										children: "Full name"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "signup-name",
										value: fullName,
										maxLength: 100,
										onChange: (e) => setFullName(e.target.value)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "signup-email",
										children: "Email"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "signup-email",
										type: "email",
										value: email,
										onChange: (e) => setEmail(e.target.value)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "signup-password",
										children: "Password"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "signup-password",
										type: "password",
										value: password,
										onChange: (e) => setPassword(e.target.value)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "submit",
									disabled: busy,
									className: "text-xs uppercase tracking-[0.25em]",
									children: busy ? "Creating…" : "Create account"
								})
							]
						})
					})
				]
			})
		]
	});
}
//#endregion
export { AuthPage as component };
