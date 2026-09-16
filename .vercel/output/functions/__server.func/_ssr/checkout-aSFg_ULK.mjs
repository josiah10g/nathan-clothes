import { r as __toESM } from "../_runtime.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as Button } from "./button-BgDHFF0o.mjs";
import { g as useNavigate, h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as supabase } from "./client-CM2SnB7T.mjs";
import { n as useAuth } from "./useAuth-t4K7Z9WU.mjs";
import { n as Label, t as Input } from "./label-B7oQAA24.mjs";
import { n as formatPrice } from "./format-Cn_Ilppd.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { i as Upload, m as Copy, u as MessageCircle, y as Check } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Textarea } from "./textarea-kko37XEX.mjs";
import { n as stringType, t as objectType } from "../_libs/zod.mjs";
import { n as useCart } from "./useCart-Dzk166AX.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/checkout-aSFg_ULK.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var schema = objectType({
	customer_name: stringType().trim().min(2, "Full name is required").max(100),
	email: stringType().trim().email("Enter a valid email").max(255),
	phone: stringType().trim().min(5, "Phone number is required for order tracking and delivery updates").max(30),
	address: stringType().trim().min(5, "Street address is required").max(250),
	city: stringType().trim().min(2, "City is required").max(100),
	postal_code: stringType().trim().min(2, "Postal code is required").max(20),
	country: stringType().trim().min(2, "Country is required").max(100),
	notes: stringType().trim().max(500).optional()
});
function generateReference() {
	const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
	let result = "CK-";
	for (let i = 0; i < 8; i++) result += chars.charAt(Math.floor(Math.random() * 32));
	return result;
}
function CheckoutPage() {
	const { user } = useAuth();
	const { items, subtotalCents, clear } = useCart();
	useNavigate();
	const [orderReference, setOrderReference] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		setOrderReference(generateReference());
	}, []);
	const { data: storeSettings, isLoading: loadingSettings } = useQuery({
		queryKey: ["store-settings"],
		queryFn: async () => {
			const { data, error } = await supabase.from("store_settings").select("*").limit(1).maybeSingle();
			if (error) {
				console.error("Error fetching store settings:", error);
				return null;
			}
			return data;
		}
	});
	const [copiedAccount, setCopiedAccount] = (0, import_react.useState)(false);
	const [copiedReference, setCopiedReference] = (0, import_react.useState)(false);
	const [values, setValues] = (0, import_react.useState)({
		customer_name: "",
		email: user?.email ?? "",
		phone: "",
		address: "",
		city: "",
		postal_code: "",
		country: "",
		notes: ""
	});
	const [errors, setErrors] = (0, import_react.useState)({});
	const [receiptFile, setReceiptFile] = (0, import_react.useState)(null);
	const [receiptPreview, setReceiptPreview] = (0, import_react.useState)(null);
	const [uploadingReceipt, setUploadingReceipt] = (0, import_react.useState)(false);
	const [submittingOrder, setSubmittingOrder] = (0, import_react.useState)(false);
	const [completedOrder, setCompletedOrder] = (0, import_react.useState)(null);
	const shippingCents = subtotalCents >= 15e3 ? 0 : 900;
	const totalCents = subtotalCents + shippingCents;
	const totalNumeric = Math.round(totalCents) / 100;
	const handleCopy = (text, type) => {
		navigator.clipboard.writeText(text);
		if (type === "account") {
			setCopiedAccount(true);
			setTimeout(() => setCopiedAccount(false), 2e3);
		} else {
			setCopiedReference(true);
			setTimeout(() => setCopiedReference(false), 2e3);
		}
		toast.success("Copied to clipboard");
	};
	const handleFileChange = (e) => {
		const file = e.target.files?.[0];
		if (!file) return;
		if (file.size > 10485760) {
			toast.error("Receipt file must be under 10MB");
			return;
		}
		setReceiptFile(file);
		if (file.type.startsWith("image/")) setReceiptPreview(URL.createObjectURL(file));
		else setReceiptPreview(null);
	};
	const handleSubmitOrder = async (e) => {
		e.preventDefault();
		if (items.length === 0) {
			toast.error("Your cart is empty");
			return;
		}
		const parsed = schema.safeParse(values);
		if (!parsed.success) {
			const next = {};
			for (const issue of parsed.error.issues) next[String(issue.path[0])] = issue.message;
			setErrors(next);
			toast.error("Please fill in all required shipping and contact details");
			return;
		}
		if (!receiptFile) {
			toast.error("Please upload your payment receipt or transfer proof screenshot");
			return;
		}
		setErrors({});
		setSubmittingOrder(true);
		try {
			const fileExt = receiptFile.name.split(".").pop() || "jpg";
			const filePath = `receipts/${`${orderReference.toLowerCase().replace(/[^a-z0-9]/g, "")}_${Date.now()}.${fileExt}`}`;
			const { data: uploadData, error: uploadError } = await supabase.storage.from("payment-receipts").upload(filePath, receiptFile, {
				cacheControl: "3600",
				upsert: true
			});
			if (uploadError) {
				console.error("Storage error:", uploadError);
				toast.error(`Receipt upload failed: ${uploadError.message}. Proceeding to create order record.`);
			}
			const receiptPath = uploadData?.path || filePath;
			const orderPayload = {
				reference: orderReference,
				user_id: user?.id ?? null,
				customer_name: parsed.data.customer_name,
				full_name: parsed.data.customer_name,
				email: parsed.data.email,
				phone: parsed.data.phone,
				address: `${parsed.data.address}, ${parsed.data.city}, ${parsed.data.postal_code}, ${parsed.data.country}`,
				city: parsed.data.city,
				postal_code: parsed.data.postal_code,
				country: parsed.data.country,
				notes: parsed.data.notes || "",
				items: items.map((i) => ({
					productId: i.productId,
					slug: i.slug,
					name: i.name,
					imageUrl: i.imageUrl,
					size: i.size,
					priceCents: i.priceCents,
					price: i.priceCents / 100,
					quantity: i.quantity,
					totalCents: i.priceCents * i.quantity
				})),
				total: totalNumeric,
				total_cents: totalCents,
				status: "pending",
				payment_status: "pending",
				receipt_path: receiptPath,
				receipt_uploaded_at: (/* @__PURE__ */ new Date()).toISOString()
			};
			const { data: createdOrder, error: orderError } = await supabase.from("orders").insert(orderPayload).select("id, reference, phone, customer_name, total").single();
			if (orderError) {
				console.error("Order creation error:", orderError);
				toast.error(`Order failed to submit: ${orderError.message}`);
				setSubmittingOrder(false);
				return;
			}
			clear();
			setCompletedOrder({
				reference: createdOrder.reference || orderReference,
				total: totalNumeric,
				phone: parsed.data.phone,
				customer_name: parsed.data.customer_name
			});
			toast.success("Order submitted successfully!");
		} catch (err) {
			console.error("Checkout submission failed:", err);
			toast.error(err?.message || "An unexpected error occurred. Please try again.");
		} finally {
			setSubmittingOrder(false);
		}
	};
	if (completedOrder) {
		const waUrl = `https://wa.me/${storeSettings?.whatsapp_number || "15550192834"}?text=${encodeURIComponent(`Hello Nathan's Clothes, I just placed an order (Ref: ${completedOrder.reference}) for $${completedOrder.total.toFixed(2)}. Name: ${completedOrder.customer_name}. Here is my payment confirmation.`)}`;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mx-auto max-w-2xl px-4 py-20 sm:px-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border border-border bg-surface p-8 text-center sm:p-12",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mx-auto flex size-14 items-center justify-center border border-primary/50 bg-primary/10 text-primary",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-7" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-6 text-xs uppercase tracking-[0.3em] text-muted-foreground",
						children: "Order Placed"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-2 text-3xl font-bold uppercase tracking-wide sm:text-4xl",
						children: "Thank You"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-sm leading-relaxed text-muted-foreground",
						children: "We have received your order and payment receipt. Our verification team will review your transfer narration shortly."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "my-8 border border-border bg-background/60 p-6 text-left",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs uppercase tracking-[0.2em] text-muted-foreground",
									children: "Order Reference"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => handleCopy(completedOrder.reference, "reference"),
									className: "inline-flex items-center gap-1.5 text-xs text-primary hover:underline",
									children: [copiedReference ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-3.5" }), copiedReference ? "Copied" : "Copy"]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-2xl font-mono font-bold tracking-wider text-foreground",
								children: completedOrder.reference
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-3 text-xs text-muted-foreground",
								children: [
									"Save this reference number alongside your phone number (",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono text-foreground",
										children: completedOrder.phone
									}),
									") to track your order anytime."
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-4 sm:flex-row sm:justify-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: waUrl,
							target: "_blank",
							rel: "noopener noreferrer",
							className: "inline-flex items-center justify-center gap-2 border border-primary bg-primary px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.25em] text-primary-foreground transition-opacity hover:opacity-90",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "size-4" }), "Confirm on WhatsApp"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/account",
							className: "inline-flex items-center justify-center border border-border bg-surface px-6 py-3.5 text-xs uppercase tracking-[0.2em] text-foreground transition-colors hover:bg-border",
							children: "Track Order Status"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-8 border-t border-border pt-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/shop",
							className: "text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground",
							children: "← Continue shopping"
						})
					})
				]
			})
		});
	}
	if (items.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-3xl px-4 py-32 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-3xl",
				children: "Your bag is empty"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-muted-foreground",
				children: "Add pieces to your bag before checking out."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/shop",
				className: "mt-8 inline-block",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "text-xs uppercase tracking-[0.25em]",
					children: "Shop the collection"
				})
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-6xl px-4 py-16 sm:px-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-10",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs uppercase tracking-[0.3em] text-muted-foreground",
				children: "Nathan's Clothes"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 text-4xl sm:text-5xl font-bold uppercase tracking-tight",
				children: "Checkout"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-12 lg:grid-cols-[1fr_380px]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSubmitOrder,
				className: "space-y-10",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border border-border bg-surface p-6 sm:p-8",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-xs font-bold uppercase tracking-[0.25em] text-muted-foreground mb-6",
							children: "1. Customer Information & Delivery Address"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "customer_name",
											children: "Full Name *"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "customer_name",
											placeholder: "e.g. Nathan Vance",
											value: values.customer_name,
											onChange: (e) => setValues((v) => ({
												...v,
												customer_name: e.target.value
											}))
										}),
										errors.customer_name && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-destructive",
											children: errors.customer_name
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid gap-5 sm:grid-cols-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid gap-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												htmlFor: "phone",
												children: "Phone Number (Required for Tracking) *"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												id: "phone",
												placeholder: "e.g. +1 555 019 2834",
												value: values.phone,
												onChange: (e) => setValues((v) => ({
													...v,
													phone: e.target.value
												}))
											}),
											errors.phone && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs text-destructive",
												children: errors.phone
											})
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid gap-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												htmlFor: "email",
												children: "Email Address *"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												id: "email",
												type: "email",
												placeholder: "name@domain.com",
												value: values.email,
												onChange: (e) => setValues((v) => ({
													...v,
													email: e.target.value
												}))
											}),
											errors.email && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs text-destructive",
												children: errors.email
											})
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "address",
											children: "Street Address *"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "address",
											placeholder: "Apartment, suite, street address",
											value: values.address,
											onChange: (e) => setValues((v) => ({
												...v,
												address: e.target.value
											}))
										}),
										errors.address && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-destructive",
											children: errors.address
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid gap-5 sm:grid-cols-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "grid gap-2",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
													htmlFor: "city",
													children: "City *"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													id: "city",
													placeholder: "City",
													value: values.city,
													onChange: (e) => setValues((v) => ({
														...v,
														city: e.target.value
													}))
												}),
												errors.city && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-xs text-destructive",
													children: errors.city
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "grid gap-2",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
													htmlFor: "postal_code",
													children: "Postal Code *"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													id: "postal_code",
													placeholder: "Postal / Zip",
													value: values.postal_code,
													onChange: (e) => setValues((v) => ({
														...v,
														postal_code: e.target.value
													}))
												}),
												errors.postal_code && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-xs text-destructive",
													children: errors.postal_code
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "grid gap-2",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
													htmlFor: "country",
													children: "Country *"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													id: "country",
													placeholder: "Country",
													value: values.country,
													onChange: (e) => setValues((v) => ({
														...v,
														country: e.target.value
													}))
												}),
												errors.country && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-xs text-destructive",
													children: errors.country
												})
											]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "notes",
										children: "Order Notes / Delivery Instructions (Optional)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
										id: "notes",
										placeholder: "Special instructions for delivery (e.g. leave at front desk)",
										value: values.notes,
										onChange: (e) => setValues((v) => ({
											...v,
											notes: e.target.value
										}))
									})]
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border border-border bg-surface p-6 sm:p-8",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-xs font-bold uppercase tracking-[0.25em] text-muted-foreground mb-6",
							children: "2. Manual Bank Transfer Instructions"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "border border-border bg-background/70 p-6 space-y-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs uppercase tracking-[0.2em] text-muted-foreground",
										children: "Order Reference (Narration)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 font-mono text-xl font-bold tracking-wider text-primary",
										children: orderReference
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										type: "button",
										variant: "outline",
										size: "sm",
										onClick: () => handleCopy(orderReference, "reference"),
										className: "gap-1.5 text-xs uppercase tracking-[0.15em]",
										children: [copiedReference ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-3.5" }), copiedReference ? "Copied" : "Copy Ref"]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid gap-4 sm:grid-cols-2 pt-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs uppercase tracking-[0.2em] text-muted-foreground",
										children: "Bank Name"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 font-medium text-foreground",
										children: storeSettings?.bank_name || "Standard Chartered Bank"
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs uppercase tracking-[0.2em] text-muted-foreground",
										children: "Account Name"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 font-medium text-foreground",
										children: storeSettings?.account_name || "Nathan Clothes Limited"
									})] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-border pt-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs uppercase tracking-[0.2em] text-muted-foreground",
										children: "Account Number"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 font-mono text-xl font-semibold text-foreground",
										children: storeSettings?.account_number || "0123456789"
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										type: "button",
										variant: "outline",
										size: "sm",
										onClick: () => handleCopy(storeSettings?.account_number || "0123456789", "account"),
										className: "gap-1.5 text-xs uppercase tracking-[0.15em]",
										children: [copiedAccount ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-3.5" }), copiedAccount ? "Copied" : "Copy Account"]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded border border-primary/20 bg-primary/5 p-4 text-xs leading-relaxed text-muted-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-semibold text-foreground mb-1",
										children: "Payment Instructions:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: storeSettings?.payment_instructions || "Please transfer the exact total to the account above. Use your order reference as the transaction narration and upload the payment receipt below." })]
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border border-border bg-surface p-6 sm:p-8",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-xs font-bold uppercase tracking-[0.25em] text-muted-foreground mb-6",
							children: "3. Upload Proof of Payment (Receipt / Screenshot) *"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative flex flex-col items-center justify-center border-2 border-dashed border-border bg-background/50 p-8 text-center hover:border-muted-foreground transition-colors cursor-pointer",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "file",
										accept: "image/*,application/pdf",
										onChange: handleFileChange,
										className: "absolute inset-0 size-full opacity-0 cursor-pointer",
										id: "receipt-upload"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "size-8 text-muted-foreground mb-3" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm font-medium text-foreground",
										children: receiptFile ? receiptFile.name : "Click or drag receipt image or PDF here"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-xs text-muted-foreground",
										children: "Supports PNG, JPG, JPEG, WEBP or PDF up to 10MB"
									})
								]
							}), receiptPreview && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 border border-border p-3 bg-background max-w-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs uppercase tracking-[0.15em] text-muted-foreground mb-2",
									children: "Receipt Preview:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: receiptPreview,
									alt: "Receipt proof",
									className: "max-h-48 w-auto object-contain rounded"
								})]
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						size: "lg",
						disabled: submittingOrder,
						className: "w-full text-xs uppercase tracking-[0.25em] py-6 text-sm",
						children: submittingOrder ? "Submitting Order & Verifying…" : `Complete Order · $${totalNumeric.toFixed(2)}`
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "h-fit border border-border bg-surface p-6 sm:p-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs uppercase tracking-[0.25em] text-muted-foreground font-semibold",
						children: "Your Bag"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-6 divide-y divide-border border-y border-border",
						children: items.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "py-4 flex items-center gap-4 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: i.imageUrl,
									alt: i.name,
									className: "size-16 object-cover bg-background border border-border shrink-0"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex-1 min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-medium text-foreground truncate",
										children: i.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs text-muted-foreground uppercase tracking-wider mt-0.5",
										children: [
											"Size: ",
											i.size,
											" × ",
											i.quantity
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium text-foreground",
									children: formatPrice(i.priceCents * i.quantity)
								})
							]
						}, `${i.productId}-${i.size}`))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
						className: "mt-6 space-y-3 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Subtotal" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
									className: "font-medium text-foreground",
									children: formatPrice(subtotalCents)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Shipping" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
									className: "font-medium text-foreground",
									children: shippingCents === 0 ? "Free" : formatPrice(shippingCents)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between border-t border-border pt-4 text-base font-bold text-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Total Amount" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", { children: ["$", totalNumeric.toFixed(2)] })]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 border-t border-border pt-6 text-xs text-muted-foreground space-y-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3.5 text-primary" }), " 100% Secure Manual Transfer"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3.5 text-primary" }), " Fast dispatch upon receipt review"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3.5 text-primary" }), " WhatsApp confirmation available"]
							})
						]
					})
				]
			})]
		})]
	});
}
//#endregion
export { CheckoutPage as component };
