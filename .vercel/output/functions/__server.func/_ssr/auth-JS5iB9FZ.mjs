import { r as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Button } from "./button-cHXlBU3y.mjs";
import { g as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as supabase } from "./client-tCXTp6li.mjs";
import { n as useAuth } from "./useAuth-C_0aa20U.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-CCJRliUM.mjs";
import { m as EyeOff, p as Eye } from "../_libs/lucide-react.mjs";
import { n as Label, t as Input } from "./label-B7oQAA24.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Route } from "./auth-D25gnW6D.mjs";
import { n as stringType, t as objectType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-JS5iB9FZ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var signInSchema = objectType({
	email: stringType().trim().email("Enter a valid email").max(255),
	password: stringType().min(6, "Password must be at least 6 characters").max(72)
});
var signUpSchema = objectType({
	fullName: stringType().trim().max(100).optional(),
	email: stringType().trim().email("Enter a valid email").max(255),
	phone: stringType().trim().min(7, "Phone number must be at least 7 digits").max(15, "Phone number too long").regex(/^[0-9]+$/, "Phone number must contain numbers only"),
	password: stringType().min(6, "Password must be at least 6 characters").max(72),
	confirmPassword: stringType().min(1, "Please confirm your password")
}).refine((data) => data.password === data.confirmPassword, {
	message: "Passwords do not match",
	path: ["confirmPassword"]
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
	const [showSignInPassword, setShowSignInPassword] = (0, import_react.useState)(false);
	const [signUpEmail, setSignUpEmail] = (0, import_react.useState)("");
	const [signUpPhone, setSignUpPhone] = (0, import_react.useState)("");
	const [signUpPassword, setSignUpPassword] = (0, import_react.useState)("");
	const [signUpConfirmPassword, setSignUpConfirmPassword] = (0, import_react.useState)("");
	const [showSignUpPassword, setShowSignUpPassword] = (0, import_react.useState)(false);
	const [showSignUpConfirmPassword, setShowSignUpConfirmPassword] = (0, import_react.useState)(false);
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
		const parsed = signInSchema.safeParse({
			email,
			password
		});
		if (!parsed.success) {
			toast.error(parsed.error.issues[0].message);
			return;
		}
		setBusy(true);
		const { data: authData, error } = await supabase.auth.signInWithPassword(parsed.data);
		setBusy(false);
		if (error) {
			toast.error(error.message);
			return;
		}
		const userName = authData.user?.user_metadata?.["full_name"] || authData.user?.email?.split("@")[0] || "User";
		let destPath = target;
		if (!redirect) {
			const { data: adminRole } = await supabase.from("user_roles").select("role").eq("user_id", authData.user.id).eq("role", "admin").maybeSingle();
			destPath = adminRole ? "/admin" : "/account";
		}
		window.dispatchEvent(new Event("nc:show-loading-screen"));
		toast.success(`Welcome back, ${userName}! Loading your dashboard…`, { duration: 5e3 });
		navigate({
			to: destPath,
			replace: true
		});
	};
	const signUp = async (e) => {
		e.preventDefault();
		const parsed = signUpSchema.safeParse({
			fullName,
			email: signUpEmail,
			phone: signUpPhone,
			password: signUpPassword,
			confirmPassword: signUpConfirmPassword
		});
		if (!parsed.success) {
			toast.error(parsed.error.issues[0].message);
			return;
		}
		setBusy(true);
		const { data, error } = await supabase.auth.signUp({
			email: parsed.data.email,
			password: parsed.data.password,
			options: {
				emailRedirectTo: window.location.origin,
				data: {
					phone: parsed.data.phone.trim(),
					...fullName.trim() ? { full_name: fullName.trim() } : {}
				}
			}
		});
		setBusy(false);
		if (error) {
			toast.error(error.message);
			return;
		}
		if (!data.session) {
			toast.success("Account created! Check your email to confirm your account.");
			return;
		}
		toast.success("Account created successfully!");
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
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "signin-password",
											type: showSignInPassword ? "text" : "password",
											value: password,
											onChange: (e) => setPassword(e.target.value),
											className: "pr-10"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => setShowSignInPassword((v) => !v),
											className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground focus:outline-none",
											"aria-label": showSignInPassword ? "Hide password" : "Show password",
											children: showSignInPassword ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "size-4" })
										})]
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
										children: "Full name (optional)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "signup-name",
										placeholder: "Nathan Doe",
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
										required: true,
										placeholder: "example@gmail.com",
										value: signUpEmail,
										onChange: (e) => setSignUpEmail(e.target.value)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "signup-phone",
										children: "Phone number (numbers only)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "signup-phone",
										type: "tel",
										inputMode: "numeric",
										pattern: "[0-9]*",
										required: true,
										placeholder: "08012345678",
										value: signUpPhone,
										onChange: (e) => setSignUpPhone(e.target.value.replace(/[^0-9]/g, ""))
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "signup-password",
										children: "Password"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "signup-password",
											type: showSignUpPassword ? "text" : "password",
											required: true,
											placeholder: "At least 6 characters",
											value: signUpPassword,
											onChange: (e) => setSignUpPassword(e.target.value),
											className: "pr-10"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => setShowSignUpPassword((v) => !v),
											className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground focus:outline-none",
											"aria-label": showSignUpPassword ? "Hide password" : "Show password",
											children: showSignUpPassword ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "size-4" })
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "signup-confirm-password",
										children: "Confirm password"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "signup-confirm-password",
											type: showSignUpConfirmPassword ? "text" : "password",
											required: true,
											placeholder: "Re-enter your password",
											value: signUpConfirmPassword,
											onChange: (e) => setSignUpConfirmPassword(e.target.value),
											className: "pr-10"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => setShowSignUpConfirmPassword((v) => !v),
											className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground focus:outline-none",
											"aria-label": showSignUpConfirmPassword ? "Hide password" : "Show password",
											children: showSignUpConfirmPassword ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "size-4" })
										})]
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
