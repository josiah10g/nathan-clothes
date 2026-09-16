import { r as __toESM } from "../_runtime.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as Button } from "./button-BgDHFF0o.mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as supabase } from "./client-CM2SnB7T.mjs";
import { n as useAuth } from "./useAuth-t4K7Z9WU.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { n as Label, t as Input } from "./label-B7oQAA24.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-CCJRliUM.mjs";
import { t as formatDate } from "./format-Cn_Ilppd.mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { _ as CircleCheckBig, h as Clock, v as CircleAlert } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/account-BtBFN4fF.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AccountPage() {
	const { user, isAdmin, signOut } = useAuth();
	useQueryClient();
	const [trackRef, setTrackRef] = (0, import_react.useState)("");
	const [trackPhone, setTrackPhone] = (0, import_react.useState)("");
	const [trackedOrder, setTrackedOrder] = (0, import_react.useState)(null);
	const [searching, setSearching] = (0, import_react.useState)(false);
	const [newReceiptFile, setNewReceiptFile] = (0, import_react.useState)(null);
	const [uploadingReceipt, setUploadingReceipt] = (0, import_react.useState)(false);
	const { data: myOrders, isLoading: loadingMyOrders } = useQuery({
		queryKey: ["my-orders", user?.id],
		enabled: !!user,
		queryFn: async () => {
			const { data, error } = await supabase.from("orders").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
			if (error) throw error;
			return data ?? [];
		}
	});
	const handleTrackOrder = async (e) => {
		e.preventDefault();
		if (!trackRef.trim() || !trackPhone.trim()) {
			toast.error("Please enter both your Order Reference and Phone Number");
			return;
		}
		setSearching(true);
		try {
			const { data, error } = await supabase.rpc("track_order", {
				_reference: trackRef.trim(),
				_phone: trackPhone.trim()
			});
			if (error) {
				toast.error("Failed to query order: " + error.message);
				setTrackedOrder(null);
				return;
			}
			if (data && typeof data === "object" && "error" in data) {
				toast.error(data.error || "Order not found");
				setTrackedOrder(null);
				return;
			}
			setTrackedOrder(data);
			toast.success("Order found!");
		} catch (err) {
			toast.error(err?.message || "Failed to find order");
			setTrackedOrder(null);
		} finally {
			setSearching(false);
		}
	};
	const handleAttachReceipt = async (e) => {
		e.preventDefault();
		if (!newReceiptFile || !trackedOrder) {
			toast.error("Please select a file to upload");
			return;
		}
		setUploadingReceipt(true);
		try {
			const fileExt = newReceiptFile.name.split(".").pop() || "jpg";
			const filePath = `receipts/${`${trackedOrder.reference.toLowerCase().replace(/[^a-z0-9]/g, "")}_reupload_${Date.now()}.${fileExt}`}`;
			const { error: storageError } = await supabase.storage.from("payment-receipts").upload(filePath, newReceiptFile, { upsert: true });
			if (storageError) console.error("Storage error:", storageError);
			const { data: updated, error: rpcError } = await supabase.rpc("attach_receipt", {
				_reference: trackedOrder.reference,
				_phone: trackPhone.trim(),
				_path: filePath
			});
			if (rpcError || !updated) {
				toast.error("Failed to update receipt. Please check reference and phone.");
				return;
			}
			toast.success("Receipt uploaded successfully. Order is now under review!");
			setNewReceiptFile(null);
			const { data: fresh } = await supabase.rpc("track_order", {
				_reference: trackRef.trim(),
				_phone: trackPhone.trim()
			});
			if (fresh) setTrackedOrder(fresh);
		} catch (err) {
			toast.error(err?.message || "Failed to upload new receipt");
		} finally {
			setUploadingReceipt(false);
		}
	};
	const renderPaymentBadge = (status) => {
		switch (status) {
			case "approved": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
				className: "bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 uppercase tracking-[0.15em] flex items-center gap-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheckBig, { className: "size-3" }), " Approved & Paid"]
			});
			case "declined": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
				className: "bg-destructive/20 text-destructive border border-destructive/30 uppercase tracking-[0.15em] flex items-center gap-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "size-3" }), " Declined / Action Required"]
			});
			default: return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
				className: "bg-amber-600/20 text-amber-400 border border-amber-500/30 uppercase tracking-[0.15em] flex items-center gap-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-3" }), " Pending Verification"]
			});
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-5xl px-4 py-16 sm:px-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-center justify-between gap-4 border-b border-border pb-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-4xl sm:text-5xl font-bold uppercase tracking-tight",
				children: "Orders & Account"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted-foreground",
				children: user ? `Logged in as ${user.email}` : "Track a guest order or log into your account."
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3",
				children: [isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/admin",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						className: "text-xs uppercase tracking-[0.2em]",
						children: "Admin Dashboard"
					})
				}), user && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					onClick: () => signOut(),
					className: "text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground",
					children: "Sign out"
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
			defaultValue: user ? "history" : "track",
			className: "mt-10",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
					className: "grid w-full max-w-md grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
						value: "track",
						className: "text-xs uppercase tracking-[0.2em]",
						children: "Track Order"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
						value: "history",
						className: "text-xs uppercase tracking-[0.2em]",
						children: "My Account"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
					value: "track",
					className: "mt-8 space-y-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border border-border bg-surface p-6 sm:p-8",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-xs font-bold uppercase tracking-[0.25em] text-muted-foreground mb-4",
								children: "Instant Order Lookup"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm text-muted-foreground mb-6",
								children: [
									"Enter the Order Reference (e.g. ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono text-foreground",
										children: "CK-A8F291E3"
									}),
									") and the Phone Number provided during checkout."
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
								onSubmit: handleTrackOrder,
								className: "grid gap-4 sm:grid-cols-[1fr_1fr_auto]",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "track-ref",
											className: "text-xs",
											children: "Order Reference"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "track-ref",
											placeholder: "e.g. CK-12345678",
											value: trackRef,
											onChange: (e) => setTrackRef(e.target.value),
											className: "font-mono uppercase"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "track-phone",
											className: "text-xs",
											children: "Phone Number"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "track-phone",
											placeholder: "e.g. +1 555 019 2834",
											value: trackPhone,
											onChange: (e) => setTrackPhone(e.target.value)
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex items-end",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											type: "submit",
											disabled: searching,
											className: "w-full sm:w-auto text-xs uppercase tracking-[0.2em]",
											children: searching ? "Searching…" : "Track"
										})
									})
								]
							})
						]
					}), trackedOrder && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border border-border bg-surface p-6 sm:p-8 space-y-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-start justify-between gap-4 border-b border-border pb-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs uppercase tracking-[0.2em] text-muted-foreground",
										children: "Order Reference"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 font-mono text-2xl font-bold tracking-wider text-foreground",
										children: trackedOrder.reference
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-1 text-xs text-muted-foreground",
										children: ["Placed on ", formatDate(trackedOrder.created_at)]
									})
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col items-end gap-2",
									children: [renderPaymentBadge(trackedOrder.payment_status || trackedOrder.status), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-sm font-semibold text-foreground",
										children: ["Total: $", Number(trackedOrder.total || trackedOrder.total_cents / 100).toFixed(2)]
									})]
								})]
							}),
							trackedOrder.admin_note && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded border border-primary/30 bg-primary/5 p-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-semibold uppercase tracking-[0.15em] text-primary mb-1",
									children: "Store Note / Update:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-foreground",
									children: trackedOrder.admin_note
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-4 sm:grid-cols-2 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs uppercase tracking-[0.2em] text-muted-foreground",
										children: "Customer"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-medium text-foreground mt-1",
										children: trackedOrder.customer_name || trackedOrder.full_name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-muted-foreground",
										children: trackedOrder.phone
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-muted-foreground",
										children: trackedOrder.email
									})
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs uppercase tracking-[0.2em] text-muted-foreground",
									children: "Delivery Address"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-muted-foreground mt-1",
									children: trackedOrder.address
								})] })]
							}),
							Array.isArray(trackedOrder.items) && trackedOrder.items.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "border-t border-border pt-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4",
									children: "Ordered Pieces"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
									className: "divide-y divide-border",
									children: trackedOrder.items.map((it, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: "py-3 flex items-center justify-between text-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-3",
											children: [it.imageUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
												src: it.imageUrl,
												alt: it.name,
												className: "size-12 object-cover bg-background"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-medium text-foreground",
												children: it.name
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-xs text-muted-foreground uppercase",
												children: [
													"Size: ",
													it.size,
													" × ",
													it.quantity
												]
											})] })]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-medium text-foreground",
											children: ["$", (Number(it.price || it.priceCents / 100) * it.quantity).toFixed(2)]
										})]
									}, idx))
								})]
							}),
							trackedOrder.payment_status !== "approved" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "border-t border-border pt-6",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-2",
										children: "Update / Re-Upload Payment Receipt"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground mb-4",
										children: "If your payment transfer was made or if your previous receipt was unclear, upload your updated proof here:"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
										onSubmit: handleAttachReceipt,
										className: "flex flex-wrap items-center gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											type: "file",
											accept: "image/*,application/pdf",
											onChange: (e) => setNewReceiptFile(e.target.files?.[0] || null),
											className: "max-w-xs"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											type: "submit",
											disabled: uploadingReceipt || !newReceiptFile,
											className: "text-xs uppercase tracking-[0.2em]",
											children: uploadingReceipt ? "Uploading…" : "Upload Proof"
										})]
									})
								]
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "history",
					className: "mt-8 space-y-6",
					children: !user ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border border-border bg-surface p-8 text-center sm:p-12",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-2xl font-bold uppercase tracking-wide",
								children: "Sign in to view account"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-sm text-muted-foreground max-w-md mx-auto",
								children: "Sign in with your email to see all past orders, delivery addresses, and saved details."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-6",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/auth",
									search: {
										mode: "signin",
										redirect: "/account"
									},
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										className: "text-xs uppercase tracking-[0.25em]",
										children: "Log In / Sign Up"
									})
								})
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-xs font-bold uppercase tracking-[0.25em] text-muted-foreground mb-6",
							children: "Your Past Orders"
						}),
						loadingMyOrders && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: "Loading your orders…"
						}),
						!loadingMyOrders && (!myOrders || myOrders.length === 0) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "border border-border bg-surface p-8 text-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground",
								children: "You haven't placed any orders with this account yet."
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/shop",
								className: "mt-6 inline-block",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									className: "text-xs uppercase tracking-[0.25em]",
									children: "Explore Collection"
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-6",
							children: (myOrders || []).map((ord) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
								className: "border border-border bg-surface p-6",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-mono text-sm font-bold text-foreground",
											children: ord.reference || `ORDER #${ord.id.slice(0, 8)}`
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-muted-foreground mt-0.5",
											children: formatDate(ord.created_at)
										})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-3",
											children: [renderPaymentBadge(ord.payment_status || ord.status), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "font-bold text-foreground",
												children: ["$", Number(ord.total || ord.total_cents / 100).toFixed(2)]
											})]
										})]
									}),
									ord.admin_note && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-4 text-xs bg-primary/5 p-3 border border-primary/20 text-muted-foreground",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
												className: "text-foreground",
												children: "Store Note:"
											}),
											" ",
											ord.admin_note
										]
									}),
									Array.isArray(ord.items) && ord.items.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
										className: "mt-4 space-y-2",
										children: ord.items.map((it, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
											className: "flex justify-between text-xs text-muted-foreground",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
												it.name,
												" · ",
												it.size,
												" × ",
												it.quantity
											] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-foreground",
												children: ["$", (Number(it.price || it.priceCents / 100) * it.quantity).toFixed(2)]
											})]
										}, idx))
									})
								]
							}, ord.id))
						})
					] })
				})
			]
		})]
	});
}
//#endregion
export { AccountPage as component };
