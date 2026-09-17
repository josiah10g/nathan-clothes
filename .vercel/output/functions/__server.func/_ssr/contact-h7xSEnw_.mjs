import { r as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Button } from "./button-cHXlBU3y.mjs";
import { t as supabase } from "./client-BpGEELM-.mjs";
import { n as Label, t as Input } from "./label-B7oQAA24.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Textarea } from "./textarea-kko37XEX.mjs";
import { n as stringType, t as objectType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/contact-h7xSEnw_.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var schema = objectType({
	name: stringType().trim().min(1, "Name is required").max(100),
	email: stringType().trim().email("Enter a valid email").max(255),
	subject: stringType().trim().max(150).optional(),
	message: stringType().trim().min(5, "Tell us a little more").max(2e3)
});
function Contact() {
	const [values, setValues] = (0, import_react.useState)({
		name: "",
		email: "",
		subject: "",
		message: ""
	});
	const [errors, setErrors] = (0, import_react.useState)({});
	const [submitting, setSubmitting] = (0, import_react.useState)(false);
	const onSubmit = async (e) => {
		e.preventDefault();
		const parsed = schema.safeParse(values);
		if (!parsed.success) {
			const next = {};
			for (const issue of parsed.error.issues) next[String(issue.path[0])] = issue.message;
			setErrors(next);
			return;
		}
		setErrors({});
		setSubmitting(true);
		const { error } = await supabase.from("contact_messages").insert({
			name: parsed.data.name,
			email: parsed.data.email,
			subject: parsed.data.subject ?? "",
			message: parsed.data.message
		});
		setSubmitting(false);
		if (error) {
			toast.error("Message could not be sent. Please try again.");
			return;
		}
		toast.success("Message sent — we'll be in touch soon.");
		setValues({
			name: "",
			email: "",
			subject: "",
			message: ""
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-5xl px-4 py-16 sm:px-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs uppercase tracking-[0.3em] text-muted-foreground",
					children: "Concierge & Client Support"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-4xl sm:text-5xl lg:text-6xl",
					children: "Let's Connect"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "max-w-2xl text-base leading-relaxed text-muted-foreground",
					children: "Have questions about an upcoming limited drop, fit guidance, local delivery, or special orders? We treat every inquiry with priority. Reach our team below or connect directly on WhatsApp for immediate support."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-4 pt-2 sm:grid-cols-2 max-w-xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border border-border/60 bg-surface/50 p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs uppercase tracking-[0.2em] text-foreground font-medium",
							children: "Fast Turnaround"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground mt-1",
							children: "Direct response within 24h"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border border-border/60 bg-surface/50 p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs uppercase tracking-[0.2em] text-foreground font-medium",
							children: "Direct WhatsApp"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground mt-1",
							children: "Live customer assistance"
						})]
					})]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit,
			className: "mt-12 grid max-w-xl gap-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "name",
							children: "Name"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "name",
							value: values.name,
							maxLength: 100,
							onChange: (e) => setValues((v) => ({
								...v,
								name: e.target.value
							}))
						}),
						errors["name"] && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-destructive",
							children: errors["name"]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "email",
							children: "Email"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "email",
							type: "email",
							value: values.email,
							maxLength: 255,
							onChange: (e) => setValues((v) => ({
								...v,
								email: e.target.value
							}))
						}),
						errors["email"] && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-destructive",
							children: errors["email"]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "subject",
						children: "Subject"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "subject",
						value: values.subject,
						maxLength: 150,
						onChange: (e) => setValues((v) => ({
							...v,
							subject: e.target.value
						}))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "message",
							children: "Message"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							id: "message",
							rows: 6,
							value: values.message,
							maxLength: 2e3,
							onChange: (e) => setValues((v) => ({
								...v,
								message: e.target.value
							}))
						}),
						errors["message"] && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-destructive",
							children: errors["message"]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						size: "lg",
						disabled: submitting,
						className: "text-xs uppercase tracking-[0.25em]",
						children: submitting ? "Sending…" : "Send message"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: "https://wa.me/2348000000000?text=Hello%20Nathan's%20Clothes!%20I%20have%20an%20inquiry.",
						target: "_blank",
						rel: "noopener noreferrer",
						className: "inline-flex h-10 items-center justify-center gap-2 rounded-sm border border-emerald-500/50 bg-emerald-950/30 px-5 text-xs font-medium uppercase tracking-[0.2em] text-emerald-300 transition-colors hover:bg-emerald-900/50 hover:text-white",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
							viewBox: "0 0 24 24",
							width: "16",
							height: "16",
							stroke: "currentColor",
							strokeWidth: "2",
							fill: "none",
							strokeLinecap: "round",
							strokeLinejoin: "round",
							className: "size-4 fill-emerald-500/30 text-emerald-400",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" })]
						}), "Chat via WhatsApp"]
					})]
				})
			]
		})]
	});
}
//#endregion
export { Contact as component };
