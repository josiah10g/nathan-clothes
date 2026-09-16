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
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { _ as CircleCheckBig, a as Trash2, f as Eye, g as CircleX, o as ShoppingBag, p as CreditCard, r as UserCheck, s as Settings } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Textarea } from "./textarea-kko37XEX.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-rVjUjWRL.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminPage() {
	const { isAdmin, loading } = useAuth();
	const qc = useQueryClient();
	const ordersQuery = useQuery({
		queryKey: ["admin", "orders"],
		enabled: isAdmin,
		queryFn: async () => {
			const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
			if (error) throw error;
			return data ?? [];
		}
	});
	const productsQuery = useQuery({
		queryKey: ["admin", "products"],
		enabled: isAdmin,
		queryFn: async () => {
			const { data, error } = await supabase.from("products").select("*").order("sort_order", { ascending: true }).order("created_at", { ascending: false });
			if (error) throw error;
			return data ?? [];
		}
	});
	const settingsQuery = useQuery({
		queryKey: ["admin", "settings"],
		enabled: isAdmin,
		queryFn: async () => {
			const { data, error } = await supabase.from("store_settings").select("*").limit(1).maybeSingle();
			if (error) throw error;
			return data;
		}
	});
	const [orderFilter, setOrderFilter] = (0, import_react.useState)("all");
	const [editingNoteId, setEditingNoteId] = (0, import_react.useState)(null);
	const [editingNoteText, setEditingNoteText] = (0, import_react.useState)("");
	const [draftProduct, setDraftProduct] = (0, import_react.useState)({
		name: "",
		slug: "",
		brand: "Nathan Clothes",
		category: "hoodies",
		description: "",
		specifications: "",
		price: "129.00",
		in_stock: true,
		image_url: "",
		sort_order: "0"
	});
	const [productImageFile, setProductImageFile] = (0, import_react.useState)(null);
	const [uploadingProductImage, setUploadingProductImage] = (0, import_react.useState)(false);
	const [newAdminEmail, setNewAdminEmail] = (0, import_react.useState)("");
	const [appointingAdmin, setAppointingAdmin] = (0, import_react.useState)(false);
	const [settingsDraft, setSettingsDraft] = (0, import_react.useState)(null);
	const updateOrderStatus = useMutation({
		mutationFn: async ({ id, payment_status, status, admin_note }) => {
			const payload = {
				payment_status,
				status,
				reviewed_at: (/* @__PURE__ */ new Date()).toISOString(),
				updated_at: (/* @__PURE__ */ new Date()).toISOString()
			};
			if (admin_note !== void 0) payload.admin_note = admin_note;
			const { error } = await supabase.from("orders").update(payload).eq("id", id);
			if (error) throw error;
		},
		onSuccess: () => {
			toast.success("Order status updated");
			qc.invalidateQueries({ queryKey: ["admin", "orders"] });
		},
		onError: (err) => {
			toast.error("Failed to update order: " + err.message);
		}
	});
	const deleteOrder = useMutation({
		mutationFn: async (id) => {
			if (!confirm("Are you sure you want to permanently delete this order?")) return;
			const { error } = await supabase.from("orders").delete().eq("id", id);
			if (error) throw error;
		},
		onSuccess: () => {
			toast.success("Order deleted");
			qc.invalidateQueries({ queryKey: ["admin", "orders"] });
		},
		onError: (err) => {
			toast.error("Failed to delete order: " + err.message);
		}
	});
	const viewReceiptProof = async (receiptPath) => {
		if (!receiptPath) {
			toast.error("No receipt uploaded for this order.");
			return;
		}
		try {
			const cleanPath = receiptPath.startsWith("receipts/") ? receiptPath : `receipts/${receiptPath}`;
			const { data, error } = await supabase.storage.from("payment-receipts").createSignedUrl(cleanPath, 600);
			if (error || !data?.signedUrl) {
				const { data: rawData, error: rawError } = await supabase.storage.from("payment-receipts").createSignedUrl(receiptPath, 600);
				if (rawError || !rawData?.signedUrl) {
					toast.error("Could not generate receipt URL: " + (rawError?.message || error?.message));
					return;
				}
				window.open(rawData.signedUrl, "_blank");
				return;
			}
			window.open(data.signedUrl, "_blank");
		} catch (err) {
			toast.error("Receipt preview error: " + err.message);
		}
	};
	const handleProductImageUpload = async (file) => {
		setUploadingProductImage(true);
		try {
			const ext = file.name.split(".").pop() || "jpg";
			const fileName = `prod_${Date.now()}.${ext}`;
			const { data, error } = await supabase.storage.from("product-images").upload(fileName, file, { upsert: true });
			if (error) throw error;
			const { data: publicUrlData } = supabase.storage.from("product-images").getPublicUrl(fileName);
			setDraftProduct((p) => ({
				...p,
				image_url: publicUrlData.publicUrl
			}));
			toast.success("Product image uploaded successfully");
		} catch (err) {
			toast.error("Image upload failed: " + err.message);
		} finally {
			setUploadingProductImage(false);
		}
	};
	const createProduct = useMutation({
		mutationFn: async () => {
			if (!draftProduct.name.trim()) throw new Error("Product name is required");
			const slug = draftProduct.slug.trim() || draftProduct.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
			const priceNumeric = parseFloat(draftProduct.price) || 0;
			const priceCents = Math.round(priceNumeric * 100);
			const { error } = await supabase.from("products").insert({
				name: draftProduct.name.trim(),
				slug,
				brand: draftProduct.brand.trim() || "Nathan Clothes",
				category: draftProduct.category,
				description: draftProduct.description.trim(),
				specifications: draftProduct.specifications.trim(),
				price: priceNumeric,
				price_cents: priceCents,
				image_url: draftProduct.image_url.trim() || "/images/shadow-web-hoodie.jpg",
				in_stock: draftProduct.in_stock,
				sort_order: parseInt(draftProduct.sort_order, 10) || 0,
				active: true
			});
			if (error) throw error;
		},
		onSuccess: () => {
			toast.success("Product created successfully");
			setDraftProduct({
				name: "",
				slug: "",
				brand: "Nathan Clothes",
				category: "hoodies",
				description: "",
				specifications: "",
				price: "129.00",
				in_stock: true,
				image_url: "",
				sort_order: "0"
			});
			qc.invalidateQueries({ queryKey: ["admin", "products"] });
			qc.invalidateQueries({ queryKey: ["products"] });
		},
		onError: (err) => {
			toast.error("Failed to create product: " + err.message);
		}
	});
	const deleteProduct = useMutation({
		mutationFn: async (id) => {
			if (!confirm("Are you sure you want to delete this product?")) return;
			const { error } = await supabase.from("products").delete().eq("id", id);
			if (error) throw error;
		},
		onSuccess: () => {
			toast.success("Product deleted");
			qc.invalidateQueries({ queryKey: ["admin", "products"] });
			qc.invalidateQueries({ queryKey: ["products"] });
		},
		onError: (err) => {
			toast.error("Failed to delete product: " + err.message);
		}
	});
	const toggleStock = useMutation({
		mutationFn: async ({ id, in_stock }) => {
			const { error } = await supabase.from("products").update({ in_stock }).eq("id", id);
			if (error) throw error;
		},
		onSuccess: () => {
			toast.success("Stock status updated");
			qc.invalidateQueries({ queryKey: ["admin", "products"] });
			qc.invalidateQueries({ queryKey: ["products"] });
		}
	});
	const updateSettings = useMutation({
		mutationFn: async (updated) => {
			const { error } = await supabase.from("store_settings").update({
				bank_name: updated.bank_name,
				account_name: updated.account_name,
				account_number: updated.account_number,
				payment_instructions: updated.payment_instructions,
				contact_phone: updated.contact_phone,
				whatsapp_number: updated.whatsapp_number,
				contact_email: updated.contact_email,
				updated_at: (/* @__PURE__ */ new Date()).toISOString()
			}).eq("id", updated.id || "00000000-0000-0000-0000-000000000001");
			if (error) throw error;
		},
		onSuccess: () => {
			toast.success("Store settings updated");
			qc.invalidateQueries({ queryKey: ["admin", "settings"] });
			qc.invalidateQueries({ queryKey: ["store-settings"] });
		},
		onError: (err) => {
			toast.error("Failed to update settings: " + err.message);
		}
	});
	const handleGrantAdmin = async (e) => {
		e.preventDefault();
		if (!newAdminEmail.trim()) {
			toast.error("Enter user email");
			return;
		}
		setAppointingAdmin(true);
		try {
			const { data, error } = await supabase.rpc("grant_admin_by_email", { _email: newAdminEmail.trim() });
			if (error) throw error;
			toast.success(`Admin access granted to ${newAdminEmail}`);
			setNewAdminEmail("");
		} catch (err) {
			toast.error("Failed to grant admin: " + err.message);
		} finally {
			setAppointingAdmin(false);
		}
	};
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto max-w-6xl px-4 py-32 text-center text-sm text-muted-foreground",
		children: "Loading admin console…"
	});
	if (!isAdmin) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-2xl px-4 py-32 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-3xl font-bold uppercase",
				children: "Restricted Access"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-muted-foreground",
				children: "You do not have administrator permissions for Nathan's Clothes."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 flex justify-center gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/admin-setup",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						className: "text-xs uppercase tracking-[0.2em]",
						children: "Claim Owner Role"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "text-xs uppercase tracking-[0.2em]",
						children: "Return Home"
					})
				})]
			})
		]
	});
	const rawOrders = ordersQuery.data || [];
	const filteredOrders = rawOrders.filter((ord) => {
		if (orderFilter === "all") return true;
		return (ord.payment_status || ord.status) === orderFilter;
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-7xl px-4 py-16 sm:px-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-center justify-between gap-4 border-b border-border pb-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs uppercase tracking-[0.3em] text-muted-foreground",
				children: "Store Management"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-1 text-4xl sm:text-5xl font-bold uppercase tracking-tight",
				children: "Admin Console"
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/account",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					className: "text-xs uppercase tracking-[0.2em]",
					children: "Public View"
				})
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
			defaultValue: "orders",
			className: "mt-10",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
					className: "grid w-full max-w-lg grid-cols-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
							value: "orders",
							className: "text-xs uppercase tracking-[0.2em] flex items-center gap-1.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreditCard, { className: "size-3.5" }),
								" Orders (",
								rawOrders.length,
								")"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
							value: "products",
							className: "text-xs uppercase tracking-[0.2em] flex items-center gap-1.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { className: "size-3.5" }),
								" Products (",
								(productsQuery.data || []).length,
								")"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
							value: "settings",
							className: "text-xs uppercase tracking-[0.2em] flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, { className: "size-3.5" }), " Settings"]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
					value: "orders",
					className: "mt-8 space-y-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center justify-between gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-wrap gap-2",
								children: [
									"all",
									"pending",
									"approved",
									"declined"
								].map((filter) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: orderFilter === filter ? "default" : "outline",
									size: "sm",
									onClick: () => setOrderFilter(filter),
									className: "text-xs uppercase tracking-[0.2em]",
									children: filter
								}, filter))
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted-foreground",
								children: [
									"Showing ",
									filteredOrders.length,
									" orders"
								]
							})]
						}),
						ordersQuery.isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: "Loading store orders…"
						}),
						!ordersQuery.isLoading && filteredOrders.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "border border-border bg-surface p-12 text-center text-sm text-muted-foreground",
							children: [
								"No orders found matching filter \"",
								orderFilter,
								"\"."
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-6",
							children: filteredOrders.map((ord) => {
								const paymentStatus = ord.payment_status || ord.status;
								const isPending = paymentStatus === "pending";
								const isApproved = paymentStatus === "approved";
								const isDeclined = paymentStatus === "declined";
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
									className: "border border-border bg-surface p-6 sm:p-8 space-y-6",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-wrap items-start justify-between gap-4 border-b border-border pb-6",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-3",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-mono text-xl font-bold tracking-wider text-foreground",
														children: ord.reference || `ORD-${ord.id.slice(0, 8)}`
													}),
													isApproved && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
														className: "bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 uppercase",
														children: "Approved & Paid"
													}),
													isDeclined && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
														className: "bg-destructive/20 text-destructive border border-destructive/30 uppercase",
														children: "Declined"
													}),
													isPending && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
														className: "bg-amber-600/20 text-amber-400 border border-amber-500/30 uppercase",
														children: "Pending Verification"
													})
												]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-xs text-muted-foreground mt-1",
												children: [
													"Placed on ",
													formatDate(ord.created_at),
													" · Customer:",
													" ",
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
														className: "text-foreground",
														children: ord.customer_name || ord.full_name
													})
												]
											})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex flex-col items-end gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "text-xl font-bold text-foreground",
													children: ["$", Number(ord.total || ord.total_cents / 100).toFixed(2)]
												}), ord.receipt_path ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
													variant: "outline",
													size: "sm",
													onClick: () => viewReceiptProof(ord.receipt_path),
													className: "gap-1.5 text-xs uppercase tracking-[0.15em]",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "size-3.5" }), " View Receipt Proof"]
												}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-xs text-muted-foreground italic",
													children: "No receipt attached"
												})]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "grid gap-4 sm:grid-cols-3 text-xs",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "uppercase tracking-[0.2em] text-muted-foreground font-semibold",
													children: "Contact Info"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "mt-1 font-medium text-foreground",
													children: ord.customer_name || ord.full_name
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-muted-foreground font-mono",
													children: ord.phone
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-muted-foreground",
													children: ord.email
												})
											] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "sm:col-span-2",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "uppercase tracking-[0.2em] text-muted-foreground font-semibold",
														children: "Delivery Address"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "mt-1 text-muted-foreground",
														children: ord.address
													}),
													ord.notes && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
														className: "mt-2 text-xs italic text-muted-foreground",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Note from customer:" }),
															" ",
															ord.notes
														]
													})
												]
											})]
										}),
										Array.isArray(ord.items) && ord.items.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "border-t border-border pt-4",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3",
												children: "Order Items"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
												className: "divide-y divide-border/60",
												children: ord.items.map((it, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
													className: "py-2.5 flex justify-between text-xs text-muted-foreground",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
															className: "text-foreground",
															children: it.name
														}),
														" (Size ",
														it.size,
														") × ",
														it.quantity
													] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "text-foreground font-medium",
														children: ["$", (Number(it.price || it.priceCents / 100) * it.quantity).toFixed(2)]
													})]
												}, idx))
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "border-t border-border pt-4",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs uppercase tracking-[0.2em] text-muted-foreground font-semibold mb-2",
												children: "Admin Note to Customer (Visible on Order Tracker)"
											}), editingNoteId === ord.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
													value: editingNoteText,
													onChange: (e) => setEditingNoteText(e.target.value),
													placeholder: "e.g. Payment verified. Your parcel is scheduled for dispatch tomorrow.",
													rows: 2,
													className: "text-xs"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex gap-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
														size: "sm",
														onClick: () => {
															updateOrderStatus.mutate({
																id: ord.id,
																payment_status: ord.payment_status || ord.status,
																status: ord.status,
																admin_note: editingNoteText
															});
															setEditingNoteId(null);
														},
														className: "text-xs uppercase tracking-[0.15em]",
														children: "Save Note"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
														size: "sm",
														variant: "ghost",
														onClick: () => setEditingNoteId(null),
														className: "text-xs uppercase tracking-[0.15em]",
														children: "Cancel"
													})]
												})]
											}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-between gap-4 bg-background/50 p-3 border border-border",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-xs text-muted-foreground",
													children: ord.admin_note || "No message attached yet."
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													variant: "ghost",
													size: "sm",
													onClick: () => {
														setEditingNoteId(ord.id);
														setEditingNoteText(ord.admin_note || "");
													},
													className: "text-xs uppercase tracking-[0.15em]",
													children: "Edit"
												})]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex flex-wrap gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
													size: "sm",
													disabled: isApproved || updateOrderStatus.isPending,
													onClick: () => updateOrderStatus.mutate({
														id: ord.id,
														payment_status: "approved",
														status: "paid"
													}),
													className: "bg-emerald-600 hover:bg-emerald-700 text-white text-xs uppercase tracking-[0.15em] gap-1.5",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheckBig, { className: "size-3.5" }), " Approve Payment"]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
													size: "sm",
													variant: "outline",
													disabled: isDeclined || updateOrderStatus.isPending,
													onClick: () => updateOrderStatus.mutate({
														id: ord.id,
														payment_status: "declined",
														status: "declined"
													}),
													className: "border-destructive/40 text-destructive hover:bg-destructive/10 text-xs uppercase tracking-[0.15em] gap-1.5",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "size-3.5" }), " Decline Payment"]
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
												variant: "ghost",
												size: "sm",
												onClick: () => deleteOrder.mutate(ord.id),
												className: "text-muted-foreground hover:text-destructive text-xs uppercase tracking-[0.15em] gap-1.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5" }), " Delete"]
											})]
										})
									]
								}, ord.id);
							})
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
					value: "products",
					className: "mt-8 space-y-10",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border border-border bg-surface p-6 sm:p-8",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-xs font-bold uppercase tracking-[0.25em] text-muted-foreground mb-6",
								children: "Add New Product Piece"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-6 sm:grid-cols-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "p-name",
											children: "Product Name *"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "p-name",
											placeholder: "e.g. Void Web Heavyweight Hoodie",
											value: draftProduct.name,
											onChange: (e) => setDraftProduct((p) => ({
												...p,
												name: e.target.value
											}))
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "p-slug",
											children: "URL Slug (Auto-generated if empty)"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "p-slug",
											placeholder: "void-web-heavyweight-hoodie",
											value: draftProduct.slug,
											onChange: (e) => setDraftProduct((p) => ({
												...p,
												slug: e.target.value
											}))
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "p-brand",
											children: "Brand"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "p-brand",
											value: draftProduct.brand,
											onChange: (e) => setDraftProduct((p) => ({
												...p,
												brand: e.target.value
											}))
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "p-category",
											children: "Category"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
											id: "p-category",
											value: draftProduct.category,
											onChange: (e) => setDraftProduct((p) => ({
												...p,
												category: e.target.value
											})),
											className: "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "hoodies",
													children: "Hoodies"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "tees",
													children: "Tees"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "bottoms",
													children: "Bottoms"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "accessories",
													children: "Accessories"
												})
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "p-price",
											children: "Price (USD) *"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "p-price",
											type: "number",
											step: "0.01",
											placeholder: "129.00",
											value: draftProduct.price,
											onChange: (e) => setDraftProduct((p) => ({
												...p,
												price: e.target.value
											}))
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "p-order",
											children: "Sort Order Priority"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "p-order",
											type: "number",
											placeholder: "0",
											value: draftProduct.sort_order,
											onChange: (e) => setDraftProduct((p) => ({
												...p,
												sort_order: e.target.value
											}))
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid gap-2 sm:col-span-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "p-specs",
											children: "Specifications & Sizing Details"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "p-specs",
											placeholder: "e.g. 100% Combed Cotton, 400 GSM French Terry, Oversized Boxy Cut",
											value: draftProduct.specifications,
											onChange: (e) => setDraftProduct((p) => ({
												...p,
												specifications: e.target.value
											}))
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid gap-2 sm:col-span-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "p-desc",
											children: "Product Description"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
											id: "p-desc",
											placeholder: "Provide rich details on fabric, silhouette, and story.",
											value: draftProduct.description,
											onChange: (e) => setDraftProduct((p) => ({
												...p,
												description: e.target.value
											}))
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid gap-3 sm:col-span-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Product Image *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-wrap items-center gap-4",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													type: "file",
													accept: "image/*",
													onChange: (e) => {
														const file = e.target.files?.[0];
														if (file) handleProductImageUpload(file);
													},
													className: "max-w-xs",
													disabled: uploadingProductImage
												}),
												uploadingProductImage && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-xs text-muted-foreground",
													children: "Uploading image…"
												}),
												draftProduct.image_url && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
														src: draftProduct.image_url,
														alt: "Preview",
														className: "size-12 object-cover border border-border"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-xs font-mono text-muted-foreground truncate max-w-xs",
														children: draftProduct.image_url
													})]
												})
											]
										})]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								onClick: () => createProduct.mutate(),
								disabled: createProduct.isPending || uploadingProductImage,
								className: "mt-6 text-xs uppercase tracking-[0.2em]",
								children: createProduct.isPending ? "Adding…" : "Add Product to Catalogue"
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border border-border bg-surface p-6 sm:p-8",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
							className: "text-xs font-bold uppercase tracking-[0.25em] text-muted-foreground mb-6",
							children: [
								"Current Catalogue (",
								(productsQuery.data || []).length,
								" items)"
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "overflow-x-auto",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
								className: "w-full text-left text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: "border-b border-border text-xs uppercase tracking-[0.2em] text-muted-foreground",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "pb-3",
											children: "Piece"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "pb-3",
											children: "Category"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "pb-3",
											children: "Price"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "pb-3",
											children: "Stock Status"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "pb-3 text-right",
											children: "Actions"
										})
									]
								}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
									className: "divide-y divide-border",
									children: (productsQuery.data || []).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
										className: "hover:bg-background/40",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "py-4",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-3",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
														src: p.image_url,
														alt: p.name,
														className: "size-12 object-cover bg-background border border-border"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "font-medium text-foreground",
														children: p.name
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
														className: "text-xs font-mono text-muted-foreground",
														children: ["/", p.slug]
													})] })]
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "py-4 text-xs uppercase tracking-wider text-muted-foreground",
												children: p.category
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
												className: "py-4 font-medium text-foreground",
												children: ["$", Number(p.price || p.price_cents / 100).toFixed(2)]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "py-4",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													onClick: () => toggleStock.mutate({
														id: p.id,
														in_stock: !p.in_stock
													}),
													className: `inline-flex items-center px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider border rounded cursor-pointer transition-colors ${p.in_stock ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20" : "bg-destructive/10 text-destructive border-destructive/30 hover:bg-destructive/20"}`,
													children: p.in_stock ? "In Stock" : "Sold Out"
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "py-4 text-right",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													variant: "ghost",
													size: "sm",
													onClick: () => deleteProduct.mutate(p.id),
													className: "text-muted-foreground hover:text-destructive",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
												})
											})
										]
									}, p.id))
								})]
							})
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
					value: "settings",
					className: "mt-8 space-y-10",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border border-border bg-surface p-6 sm:p-8",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-xs font-bold uppercase tracking-[0.25em] text-muted-foreground mb-2",
								children: "Bank Transfer Details & Payment Instructions"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground mb-6",
								children: "These details are presented to customers at checkout and used for transfer narrations."
							}),
							settingsQuery.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground",
								children: "Loading settings…"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
								onSubmit: (e) => {
									e.preventDefault();
									const target = settingsDraft || settingsQuery.data;
									updateSettings.mutate(target);
								},
								className: "grid gap-5 sm:grid-cols-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "s-bank",
											children: "Bank Name *"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "s-bank",
											defaultValue: settingsQuery.data?.bank_name,
											onChange: (e) => setSettingsDraft((d) => ({
												...d || settingsQuery.data,
												bank_name: e.target.value
											}))
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "s-acc-name",
											children: "Account Name *"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "s-acc-name",
											defaultValue: settingsQuery.data?.account_name,
											onChange: (e) => setSettingsDraft((d) => ({
												...d || settingsQuery.data,
												account_name: e.target.value
											}))
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "s-acc-num",
											children: "Account Number *"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "s-acc-num",
											defaultValue: settingsQuery.data?.account_number,
											onChange: (e) => setSettingsDraft((d) => ({
												...d || settingsQuery.data,
												account_number: e.target.value
											}))
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "s-whatsapp",
											children: "Store WhatsApp (Digits Only, with Country Code) *"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "s-whatsapp",
											placeholder: "e.g. 15550192834",
											defaultValue: settingsQuery.data?.whatsapp_number,
											onChange: (e) => setSettingsDraft((d) => ({
												...d || settingsQuery.data,
												whatsapp_number: e.target.value
											}))
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "s-phone",
											children: "Contact Phone"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "s-phone",
											defaultValue: settingsQuery.data?.contact_phone,
											onChange: (e) => setSettingsDraft((d) => ({
												...d || settingsQuery.data,
												contact_phone: e.target.value
											}))
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "s-email",
											children: "Contact / Support Email"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "s-email",
											type: "email",
											defaultValue: settingsQuery.data?.contact_email,
											onChange: (e) => setSettingsDraft((d) => ({
												...d || settingsQuery.data,
												contact_email: e.target.value
											}))
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid gap-2 sm:col-span-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "s-instructions",
											children: "Checkout Payment Instructions"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
											id: "s-instructions",
											rows: 3,
											defaultValue: settingsQuery.data?.payment_instructions,
											onChange: (e) => setSettingsDraft((d) => ({
												...d || settingsQuery.data,
												payment_instructions: e.target.value
											}))
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "sm:col-span-2",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											type: "submit",
											disabled: updateSettings.isPending,
											className: "text-xs uppercase tracking-[0.2em]",
											children: updateSettings.isPending ? "Saving Changes…" : "Save Store Settings"
										})
									})
								]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border border-border bg-surface p-6 sm:p-8",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-xs font-bold uppercase tracking-[0.25em] text-muted-foreground mb-2",
								children: "Appoint Store Staff / Admin"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground mb-6",
								children: "Grant administrative access to another registered user account by email."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
								onSubmit: handleGrantAdmin,
								className: "flex flex-wrap items-center gap-3 max-w-md",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "email",
									placeholder: "staff@nathanclothes.com",
									value: newAdminEmail,
									onChange: (e) => setNewAdminEmail(e.target.value),
									className: "flex-1"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									type: "submit",
									disabled: appointingAdmin,
									className: "text-xs uppercase tracking-[0.2em] gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCheck, { className: "size-4" }), appointingAdmin ? "Granting…" : "Grant Admin"]
								})]
							})
						]
					})]
				})
			]
		})]
	});
}
//#endregion
export { AdminPage as component };
