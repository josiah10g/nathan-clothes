import { r as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { N as require_jsx_runtime, a as Overlay2, c as Title2, i as Description2, n as Cancel, o as Portal2, r as Content2, s as Root2, t as Action } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as buttonVariants, t as Button } from "./button-cHXlBU3y.mjs";
import { g as useNavigate, h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as supabase } from "./client-tCXTp6li.mjs";
import { n as useAuth } from "./useAuth-C_0aa20U.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-CCJRliUM.mjs";
import { n as formatPrice, t as formatDate } from "./format-JcwKzGtU.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { C as CircleCheckBig, S as CircleX, _ as ExternalLink, a as Trash2, h as Eye, i as Upload, l as PenLine, r as UserCheck, t as X } from "../_libs/lucide-react.mjs";
import { n as Label, t as Input } from "./label-B7oQAA24.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as DialogContent, c as DialogTitle, i as Dialog, l as ProfileDialog, o as DialogDescription, s as DialogHeader } from "./ProfileDialog-B0hVqzJb.mjs";
import { t as Textarea } from "./textarea-kko37XEX.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-B5rSDkw5.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var AlertDialog = Root2;
var AlertDialogPortal = Portal2;
var AlertDialogOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Overlay2, {
	className: cn("fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props,
	ref
}));
AlertDialogOverlay.displayName = Overlay2.displayName;
var AlertDialogContent = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
	ref,
	className: cn("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg", className),
	...props
})] }));
AlertDialogContent.displayName = Content2.displayName;
var AlertDialogHeader = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col space-y-2 text-center sm:text-left", className),
	...props
});
AlertDialogHeader.displayName = "AlertDialogHeader";
var AlertDialogFooter = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
});
AlertDialogFooter.displayName = "AlertDialogFooter";
var AlertDialogTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Title2, {
	ref,
	className: cn("text-lg font-semibold", className),
	...props
}));
AlertDialogTitle.displayName = Title2.displayName;
var AlertDialogDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Description2, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
AlertDialogDescription.displayName = Description2.displayName;
var AlertDialogAction = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Action, {
	ref,
	className: cn(buttonVariants(), className),
	...props
}));
AlertDialogAction.displayName = Action.displayName;
var AlertDialogCancel = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cancel, {
	ref,
	className: cn(buttonVariants({ variant: "outline" }), "mt-2 sm:mt-0", className),
	...props
}));
AlertDialogCancel.displayName = Cancel.displayName;
function AdminPage() {
	const { user, isAdmin, loading, signOut } = useAuth();
	const navigate = useNavigate();
	const qc = useQueryClient();
	const handleInactivityLogout = (0, import_react.useCallback)(async () => {
		try {
			await signOut();
			toast.info("Session timed out after 5 minutes of inactivity. Please log in again.");
			navigate({ to: "/auth" });
		} catch (e) {
			console.error("Auto-logout error:", e);
		}
	}, [signOut, navigate]);
	(0, import_react.useEffect)(() => {
		if (!isAdmin) return;
		const INACTIVITY_LIMIT_MS = 3e5;
		let timeoutId;
		const resetTimer = () => {
			clearTimeout(timeoutId);
			timeoutId = setTimeout(() => {
				handleInactivityLogout();
			}, INACTIVITY_LIMIT_MS);
		};
		const activityEvents = [
			"mousemove",
			"mousedown",
			"keydown",
			"touchstart",
			"scroll",
			"click"
		];
		activityEvents.forEach((event) => {
			window.addEventListener(event, resetTimer, { passive: true });
		});
		resetTimer();
		return () => {
			clearTimeout(timeoutId);
			activityEvents.forEach((event) => {
				window.removeEventListener(event, resetTimer);
			});
		};
	}, [isAdmin, handleInactivityLogout]);
	(0, import_react.useEffect)(() => {
		if (!isAdmin) return;
		const channel = supabase.channel("admin-realtime-sync").on("postgres_changes", {
			event: "*",
			schema: "public",
			table: "orders"
		}, (payload) => {
			console.log("[Realtime] Order update received:", payload);
			qc.invalidateQueries({ queryKey: ["admin", "orders"] });
			if (payload.eventType === "INSERT") toast.info(`New order received! Reference: ${payload.new?.reference || "New"}`);
		}).on("postgres_changes", {
			event: "*",
			schema: "public",
			table: "products"
		}, () => {
			qc.invalidateQueries({ queryKey: ["admin", "products"] });
			qc.invalidateQueries({ queryKey: ["products"] });
		}).on("postgres_changes", {
			event: "*",
			schema: "public",
			table: "store_settings"
		}, () => {
			qc.invalidateQueries({ queryKey: ["admin", "settings"] });
			qc.invalidateQueries({ queryKey: ["store-settings"] });
		}).subscribe();
		return () => {
			supabase.removeChannel(channel);
		};
	}, [isAdmin, qc]);
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
		category: "hoodies",
		description: "",
		specifications: "",
		price: "",
		in_stock: true,
		stock: "10",
		image_url: ""
	});
	const fileInputRef = (0, import_react.useRef)(null);
	const [uploadingProductImage, setUploadingProductImage] = (0, import_react.useState)(false);
	const [deleteProductTarget, setDeleteProductTarget] = (0, import_react.useState)(null);
	const [deleteOrderTarget, setDeleteOrderTarget] = (0, import_react.useState)(null);
	const [editProductTarget, setEditProductTarget] = (0, import_react.useState)(null);
	const [editOrderTarget, setEditOrderTarget] = (0, import_react.useState)(null);
	const [profileDialogOpen, setProfileDialogOpen] = (0, import_react.useState)(false);
	const [receiptPreviewModal, setReceiptPreviewModal] = (0, import_react.useState)(null);
	const [loadingReceipt, setLoadingReceipt] = (0, import_react.useState)(false);
	const [newAdminEmail, setNewAdminEmail] = (0, import_react.useState)("");
	const [appointingAdmin, setAppointingAdmin] = (0, import_react.useState)(false);
	const [settingsDraft, setSettingsDraft] = (0, import_react.useState)(null);
	const updateOrderDetails = useMutation({
		mutationFn: async (order) => {
			const { error } = await supabase.from("orders").update({
				customer_name: order.customer_name.trim(),
				phone: order.phone.trim(),
				email: order.email.trim(),
				address: order.address.trim(),
				status: order.status,
				payment_status: order.payment_status,
				admin_note: order.admin_note.trim(),
				updated_at: (/* @__PURE__ */ new Date()).toISOString()
			}).eq("id", order.id);
			if (error) throw error;
		},
		onSuccess: () => {
			toast.success("Order updated successfully");
			setEditOrderTarget(null);
			qc.invalidateQueries({ queryKey: ["admin", "orders"] });
		},
		onError: (err) => {
			toast.error("Failed to update order: " + err.message);
		}
	});
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
			const { error } = await supabase.from("orders").delete().eq("id", id);
			if (error) throw error;
		},
		onSuccess: () => {
			toast.success("Order deleted");
			setDeleteOrderTarget(null);
			qc.invalidateQueries({ queryKey: ["admin", "orders"] });
		},
		onError: (err) => {
			toast.error("Failed to delete order: " + err.message);
		}
	});
	const viewReceiptProof = async (order) => {
		const receiptPath = order.receipt_path;
		if (!receiptPath) {
			toast.error("No receipt uploaded for this order.");
			return;
		}
		setLoadingReceipt(true);
		try {
			const sanitized = receiptPath.trim();
			if (sanitized.startsWith("data:")) {
				setReceiptPreviewModal({
					url: sanitized,
					reference: order.reference,
					customerName: order.customer_name || order.full_name || "Customer",
					fileName: "receipt_upload.jpg",
					isPdf: sanitized.startsWith("data:application/pdf")
				});
				return;
			}
			let bucket = "payment-receipts";
			let objectPath = sanitized;
			if (sanitized.startsWith("product-images/")) {
				bucket = "product-images";
				objectPath = sanitized.replace(/^product-images\//, "");
			} else if (sanitized.startsWith("payment-receipts/")) {
				bucket = "payment-receipts";
				objectPath = sanitized.replace(/^payment-receipts\//, "");
			}
			let resolvedUrl = null;
			const { data: publicData } = supabase.storage.from(bucket).getPublicUrl(objectPath);
			if (publicData?.publicUrl) resolvedUrl = publicData.publicUrl;
			if (!resolvedUrl) {
				const { data: signedData } = await supabase.storage.from(bucket).createSignedUrl(objectPath, 3600);
				if (signedData?.signedUrl) resolvedUrl = signedData.signedUrl;
			}
			if (!resolvedUrl) {
				const { data: blobData, error: blobError } = await supabase.storage.from(bucket).download(objectPath);
				if (!blobError && blobData) resolvedUrl = URL.createObjectURL(blobData);
			}
			if (!resolvedUrl) throw new Error(`Could not load receipt. Make sure the "${bucket}" storage bucket exists and is accessible in Supabase.`);
			const fileName = objectPath.split("/").pop() || "receipt.jpg";
			const isPdf = fileName.toLowerCase().endsWith(".pdf");
			setReceiptPreviewModal({
				url: resolvedUrl,
				reference: order.reference,
				customerName: order.customer_name || order.full_name || "Customer",
				fileName,
				isPdf
			});
		} catch (err) {
			console.error("Receipt preview error:", err);
			toast.error("Receipt preview error: " + err.message);
		} finally {
			setLoadingReceipt(false);
		}
	};
	const handleProductImageUpload = async (file) => {
		setUploadingProductImage(true);
		try {
			const ext = file.name.split(".").pop() || "jpg";
			const fileName = `prod_${Date.now()}.${ext}`;
			const { error } = await supabase.storage.from("product-images").upload(fileName, file, { upsert: true });
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
	const handleRemoveProductImage = () => {
		setDraftProduct((p) => ({
			...p,
			image_url: ""
		}));
		if (fileInputRef.current) fileInputRef.current.value = "";
	};
	const createProduct = useMutation({
		mutationFn: async () => {
			if (!draftProduct.name.trim()) throw new Error("Product name is required");
			const slug = `${draftProduct.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "product"}-${Date.now().toString().slice(-4)}`;
			const priceNumeric = Math.round(parseFloat(draftProduct.price) || 0);
			const priceCents = priceNumeric * 100;
			const stockNumeric = Math.max(0, parseInt(draftProduct.stock, 10) || 0);
			const { error } = await supabase.from("products").insert({
				name: draftProduct.name.trim(),
				slug,
				brand: "Nathan Clothes",
				category: draftProduct.category,
				description: draftProduct.description.trim(),
				specifications: draftProduct.specifications.trim(),
				price: priceNumeric,
				price_cents: priceCents,
				image_url: draftProduct.image_url.trim() || "/images/shadow-web-hoodie.jpg",
				in_stock: stockNumeric > 0 && draftProduct.in_stock,
				stock: stockNumeric,
				sort_order: 0,
				active: true
			});
			if (error) throw error;
		},
		onSuccess: () => {
			toast.success("Product created successfully");
			setDraftProduct({
				name: "",
				category: "hoodies",
				description: "",
				specifications: "",
				price: "",
				in_stock: true,
				stock: "10",
				image_url: ""
			});
			if (fileInputRef.current) fileInputRef.current.value = "";
			qc.invalidateQueries({ queryKey: ["admin", "products"] });
			qc.invalidateQueries({ queryKey: ["products"] });
		},
		onError: (err) => {
			toast.error("Failed to create product: " + err.message);
		}
	});
	const updateProduct = useMutation({
		mutationFn: async (prod) => {
			const priceCents = prod.price ? Math.round(Number(prod.price) * 100) : 0;
			const stockNum = parseInt(prod.stock || "0", 10);
			const { error } = await supabase.from("products").update({
				name: prod.name.trim(),
				category: prod.category,
				description: prod.description.trim(),
				specifications: prod.specifications.trim(),
				price: prod.price ? Number(prod.price) : 0,
				price_cents: priceCents,
				stock: isNaN(stockNum) ? 0 : stockNum,
				in_stock: stockNum > 0,
				image_url: prod.image_url.trim(),
				updated_at: (/* @__PURE__ */ new Date()).toISOString()
			}).eq("id", prod.id);
			if (error) throw error;
		},
		onSuccess: () => {
			toast.success("Product updated successfully");
			setEditProductTarget(null);
			qc.invalidateQueries({ queryKey: ["admin", "products"] });
			qc.invalidateQueries({ queryKey: ["products"] });
		},
		onError: (err) => {
			toast.error("Failed to update product: " + err.message);
		}
	});
	const deleteProduct = useMutation({
		mutationFn: async (id) => {
			const { error } = await supabase.from("products").delete().eq("id", id);
			if (error) throw error;
		},
		onSuccess: () => {
			toast.success("Product deleted");
			setDeleteProductTarget(null);
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
	const displayName = user?.user_metadata?.["full_name"] || user?.email?.split("@")[0] || "Admin";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-7xl px-4 py-16 sm:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border-b border-border pb-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "inline-block rounded-full bg-surface px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground border border-border",
						children: "Admin Portal"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
						className: "mt-4 text-4xl sm:text-5xl font-serif font-bold tracking-tight text-foreground",
						children: ["Welcome, ", displayName]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted-foreground",
						children: "Manage your store inventory, review customer bank receipts, and configure store settings."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
				defaultValue: "orders",
				className: "mt-10",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
						className: "flex flex-wrap h-auto bg-transparent p-0 gap-2 border-b border-border pb-4 w-full justify-start rounded-none",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
								value: "orders",
								className: "text-xs uppercase tracking-[0.15em] data-[state=active]:bg-foreground data-[state=active]:text-background rounded px-4 py-2",
								children: [
									"Orders & payments (",
									rawOrders.length,
									")"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
								value: "products",
								className: "text-xs uppercase tracking-[0.15em] data-[state=active]:bg-foreground data-[state=active]:text-background rounded px-4 py-2",
								children: [
									"Products (",
									(productsQuery.data || []).length,
									")"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "settings",
								className: "text-xs uppercase tracking-[0.15em] data-[state=active]:bg-foreground data-[state=active]:text-background rounded px-4 py-2",
								children: "Payment details & staff"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
						value: "orders",
						className: "mt-8 space-y-8",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "border border-border bg-surface p-5 space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground",
											children: "Total Orders"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-3xl font-serif font-bold text-foreground",
											children: rawOrders.length
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "border border-border bg-surface p-5 space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground",
											children: "Pending Requests"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-3xl font-serif font-bold text-foreground",
											children: rawOrders.filter((o) => (o.payment_status || o.status) === "pending").length
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "border border-border bg-surface p-5 space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground",
											children: "Successful Orders"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-3xl font-serif font-bold text-foreground",
											children: rawOrders.filter((o) => (o.payment_status || o.status) === "approved").length
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "border border-border bg-surface p-5 space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground",
											children: "Unique Customers"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-3xl font-serif font-bold text-foreground",
											children: new Set(rawOrders.map((o) => o.email || o.phone)).size
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "border border-border bg-surface p-5 space-y-2 col-span-2 sm:col-span-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground",
											children: "Confirmed Revenue"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-2xl sm:text-3xl font-serif font-bold text-foreground truncate",
											children: formatPrice(rawOrders.filter((o) => (o.payment_status || o.status) === "approved").reduce((sum, o) => sum + (o.total_cents || Math.round(Number(o.total || 0) * 100)), 0))
										})]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center justify-between gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-center gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: orderFilter === "all" ? "default" : "outline",
											size: "sm",
											onClick: () => setOrderFilter("all"),
											className: "text-xs uppercase tracking-[0.15em] h-8 px-3",
											children: "All Requests"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											variant: orderFilter === "pending" ? "default" : "outline",
											size: "sm",
											onClick: () => setOrderFilter("pending"),
											className: "text-xs uppercase tracking-[0.15em] h-8 px-3 gap-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2 rounded-full bg-amber-400" }), "Pending"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											variant: orderFilter === "approved" ? "default" : "outline",
											size: "sm",
											onClick: () => setOrderFilter("approved"),
											className: "text-xs uppercase tracking-[0.15em] h-8 px-3 gap-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2 rounded-full bg-emerald-400" }), "Successful"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											variant: orderFilter === "declined" ? "default" : "outline",
											size: "sm",
											onClick: () => setOrderFilter("declined"),
											className: "text-xs uppercase tracking-[0.15em] h-8 px-3 gap-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2 rounded-full bg-destructive" }), "Declined"]
										})
									]
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
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-xl font-bold text-foreground",
														children: formatPrice(ord.total_cents || Math.round(Number(ord.total || 0) * 100))
													}), ord.receipt_path ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
														variant: "outline",
														size: "sm",
														disabled: loadingReceipt,
														onClick: () => viewReceiptProof(ord),
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
														] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-foreground font-medium",
															children: formatPrice((it.priceCents || Math.round(Number(it.price || 0) * 100)) * it.quantity)
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
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
															size: "sm",
															disabled: isApproved || updateOrderStatus.isPending,
															onClick: () => updateOrderStatus.mutate({
																id: ord.id,
																payment_status: "approved",
																status: "paid"
															}),
															className: "bg-emerald-600 hover:bg-emerald-700 text-white text-xs uppercase tracking-[0.15em] gap-1.5",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheckBig, { className: "size-3.5" }), " Approve Payment"]
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
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
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
															size: "sm",
															variant: "outline",
															onClick: () => setEditOrderTarget({
																id: ord.id,
																reference: ord.reference || `ORD-${ord.id.slice(0, 8)}`,
																customer_name: ord.customer_name || "",
																phone: ord.phone || "",
																email: ord.email || "",
																address: ord.address || "",
																status: ord.status || "pending",
																payment_status: ord.payment_status || "pending",
																admin_note: ord.admin_note || ""
															}),
															className: "text-xs uppercase tracking-[0.15em] gap-1.5",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PenLine, { className: "size-3.5" }), " Edit Order"]
														})
													]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
													variant: "ghost",
													size: "sm",
													onClick: () => setDeleteOrderTarget({
														id: ord.id,
														reference: ord.reference || `ORD-${ord.id.slice(0, 8)}`
													}),
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
												className: "text-xs uppercase tracking-wider text-muted-foreground font-semibold",
												children: "PRICE IN NAIRA (LEAVE EMPTY FOR “PRICE ON REQUEST”)"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "relative flex items-center border border-border bg-background focus-within:ring-1 focus-within:ring-ring",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "pl-4 pr-2 text-base font-bold text-foreground select-none",
													children: "₦"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													id: "p-price",
													type: "text",
													inputMode: "numeric",
													placeholder: "456,666",
													value: draftProduct.price ? Number(draftProduct.price).toLocaleString("en-US") : "",
													onChange: (e) => {
														const raw = e.target.value.replace(/[^0-9]/g, "");
														setDraftProduct((p) => ({
															...p,
															price: raw
														}));
													},
													className: "h-12 w-full bg-transparent pr-4 text-base font-semibold text-foreground outline-none placeholder:text-muted-foreground/40"
												})]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "grid gap-2",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
													htmlFor: "p-stock",
													children: "Units in Stock *"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													id: "p-stock",
													type: "number",
													min: "0",
													step: "1",
													placeholder: "e.g. 10",
													value: draftProduct.stock,
													onChange: (e) => setDraftProduct((p) => ({
														...p,
														stock: e.target.value
													}))
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-[11px] text-muted-foreground",
													children: "Number of items available for purchase"
												})
											]
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
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
														ref: fileInputRef,
														type: "file",
														id: "admin-product-image-file",
														accept: "image/*",
														className: "hidden",
														onChange: (e) => {
															const file = e.target.files?.[0];
															if (file) handleProductImageUpload(file);
														}
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
														type: "button",
														variant: "outline",
														disabled: uploadingProductImage,
														onClick: () => fileInputRef.current?.click(),
														className: "gap-2 text-xs uppercase tracking-[0.15em]",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "size-4" }), uploadingProductImage ? "Uploading…" : "Choose File"]
													}),
													draftProduct.image_url && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "relative inline-flex items-center gap-3 border border-border bg-background/80 p-2 pr-4 rounded",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
																src: draftProduct.image_url,
																alt: "Preview",
																className: "size-14 object-cover border border-border rounded"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																className: "min-w-0 max-w-xs",
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
																	className: "text-xs font-medium text-foreground truncate",
																	children: "Image selected"
																}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
																	className: "text-[11px] font-mono text-muted-foreground truncate",
																	children: draftProduct.image_url
																})]
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
																type: "button",
																onClick: handleRemoveProductImage,
																className: "flex size-7 items-center justify-center rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors",
																title: "Delete selected image",
																"aria-label": "Delete selected image",
																children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
															})
														]
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
												children: "Units in Stock"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "pb-3",
												children: "Status"
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
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
															className: "font-medium text-foreground",
															children: p.name
														}) })]
													})
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "py-4 text-xs uppercase tracking-wider text-muted-foreground",
													children: p.category
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "py-4 font-medium text-foreground",
													children: formatPrice(p.price_cents || Math.round(Number(p.price || 0) * 100))
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "py-4 font-mono text-xs text-foreground",
													children: p.stock ?? (p.in_stock ? "In stock" : "0")
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
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex items-center justify-end gap-1",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
															variant: "ghost",
															size: "sm",
															onClick: () => setEditProductTarget({
																id: p.id,
																name: p.name || "",
																category: p.category || "hoodies",
																description: p.description || "",
																specifications: p.specifications || "",
																price: p.price ? String(p.price) : p.price_cents ? String(p.price_cents / 100) : "",
																stock: p.stock !== void 0 && p.stock !== null ? String(p.stock) : "0",
																in_stock: !!p.in_stock,
																image_url: p.image_url || ""
															}),
															className: "text-muted-foreground hover:text-foreground",
															title: "Edit Piece",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PenLine, { className: "size-4" })
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
															variant: "ghost",
															size: "sm",
															onClick: () => setDeleteProductTarget({
																id: p.id,
																name: p.name
															}),
															className: "text-muted-foreground hover:text-destructive",
															title: "Delete Piece",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
														})]
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
												placeholder: "",
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
												children: "Contact Phone (numbers only)"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												id: "s-phone",
												type: "tel",
												inputMode: "numeric",
												pattern: "[0-9]*",
												placeholder: "08012345678",
												defaultValue: settingsQuery.data?.contact_phone,
												onChange: (e) => setSettingsDraft((d) => ({
													...d || settingsQuery.data,
													contact_phone: e.target.value.replace(/[^0-9]/g, "")
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
												placeholder: "",
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
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialog, {
				open: !!deleteProductTarget,
				onOpenChange: (isOpen) => {
					if (!isOpen) setDeleteProductTarget(null);
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, {
					className: "border border-border bg-background p-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogTitle, {
						className: "text-lg font-bold uppercase tracking-wide",
						children: "Delete Product Piece"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogDescription, {
						className: "text-xs text-muted-foreground leading-relaxed",
						children: [
							"Are you sure you want to delete",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
								className: "text-foreground",
								children: deleteProductTarget?.name
							}),
							" from the store catalogue? This action cannot be undone."
						]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, {
						className: "mt-4 gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, {
							disabled: deleteProduct.isPending,
							className: "text-xs uppercase tracking-wider",
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction, {
							disabled: deleteProduct.isPending,
							onClick: () => {
								if (deleteProductTarget) deleteProduct.mutate(deleteProductTarget.id);
							},
							className: "bg-destructive hover:bg-destructive/90 text-destructive-foreground text-xs uppercase tracking-wider",
							children: deleteProduct.isPending ? "Deleting…" : "Delete Product"
						})]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialog, {
				open: !!deleteOrderTarget,
				onOpenChange: (isOpen) => {
					if (!isOpen) setDeleteOrderTarget(null);
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, {
					className: "border border-border bg-background p-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogTitle, {
						className: "text-lg font-bold uppercase tracking-wide",
						children: "Delete Order Record"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogDescription, {
						className: "text-xs text-muted-foreground leading-relaxed",
						children: [
							"Are you sure you want to permanently delete order",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
								className: "font-mono text-foreground",
								children: deleteOrderTarget?.reference
							}),
							"? This order and its payment records will be completely removed."
						]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, {
						className: "mt-4 gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, {
							disabled: deleteOrder.isPending,
							className: "text-xs uppercase tracking-wider",
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction, {
							disabled: deleteOrder.isPending,
							onClick: () => {
								if (deleteOrderTarget) deleteOrder.mutate(deleteOrderTarget.id);
							},
							className: "bg-destructive hover:bg-destructive/90 text-destructive-foreground text-xs uppercase tracking-wider",
							children: deleteOrder.isPending ? "Deleting…" : "Delete Order"
						})]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!editOrderTarget,
				onOpenChange: (isOpen) => {
					if (!isOpen) setEditOrderTarget(null);
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-w-lg border border-border bg-background p-6 max-h-[90vh] overflow-y-auto",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
						className: "text-base font-bold uppercase tracking-wide",
						children: ["Edit Order — ", editOrderTarget?.reference]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
						className: "text-xs text-muted-foreground",
						children: "Modify customer delivery information, payment confirmation, and internal note."
					})] }), editOrderTarget && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 space-y-4 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "edit-customer-name",
									children: "Customer Full Name"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "edit-customer-name",
									value: editOrderTarget.customer_name,
									onChange: (e) => setEditOrderTarget((prev) => prev ? {
										...prev,
										customer_name: e.target.value
									} : null),
									placeholder: "e.g. Chukwuemeka Nathan"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "edit-customer-phone",
									children: "Phone Number (numbers only)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "edit-customer-phone",
									type: "tel",
									inputMode: "numeric",
									pattern: "[0-9]*",
									value: editOrderTarget.phone,
									onChange: (e) => setEditOrderTarget((prev) => prev ? {
										...prev,
										phone: e.target.value.replace(/[^0-9]/g, "")
									} : null),
									placeholder: "08012345678"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "edit-customer-email",
									children: "Email Address"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "edit-customer-email",
									type: "email",
									value: editOrderTarget.email,
									onChange: (e) => setEditOrderTarget((prev) => prev ? {
										...prev,
										email: e.target.value
									} : null),
									placeholder: "customer@email.com"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "edit-customer-address",
									children: "Delivery Address"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									id: "edit-customer-address",
									rows: 2,
									value: editOrderTarget.address,
									onChange: (e) => setEditOrderTarget((prev) => prev ? {
										...prev,
										address: e.target.value
									} : null),
									placeholder: "Street address, City, State"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "edit-payment-status",
										children: "Payment Status"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										id: "edit-payment-status",
										value: editOrderTarget.payment_status,
										onChange: (e) => setEditOrderTarget((prev) => prev ? {
											...prev,
											payment_status: e.target.value
										} : null),
										className: "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-xs uppercase font-medium",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "pending",
												children: "Pending"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "approved",
												children: "Approved"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "declined",
												children: "Declined"
											})
										]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "edit-order-status",
										children: "Order Status"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										id: "edit-order-status",
										value: editOrderTarget.status,
										onChange: (e) => setEditOrderTarget((prev) => prev ? {
											...prev,
											status: e.target.value
										} : null),
										className: "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-xs uppercase font-medium",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "pending",
												children: "Pending"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "paid",
												children: "Paid"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "dispatched",
												children: "Dispatched"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "completed",
												children: "Completed"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "declined",
												children: "Declined"
											})
										]
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "edit-admin-note",
									children: "Admin Note (Visible on Order Tracker)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									id: "edit-admin-note",
									rows: 2,
									value: editOrderTarget.admin_note,
									onChange: (e) => setEditOrderTarget((prev) => prev ? {
										...prev,
										admin_note: e.target.value
									} : null),
									placeholder: "e.g. Payment verified. Your parcel is scheduled for dispatch tomorrow."
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-end gap-2 pt-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									variant: "outline",
									onClick: () => setEditOrderTarget(null),
									disabled: updateOrderDetails.isPending,
									className: "text-xs uppercase tracking-wider",
									children: "Cancel"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									onClick: () => {
										if (editOrderTarget) updateOrderDetails.mutate(editOrderTarget);
									},
									disabled: updateOrderDetails.isPending,
									className: "text-xs uppercase tracking-wider",
									children: updateOrderDetails.isPending ? "Saving Changes…" : "Save Changes"
								})]
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!editProductTarget,
				onOpenChange: (open) => !open && setEditProductTarget(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-w-lg max-h-[90vh] overflow-y-auto border border-border bg-background p-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
						className: "text-xl font-bold uppercase tracking-wide",
						children: "Edit Product"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
						className: "text-xs text-muted-foreground",
						children: "Update piece details, price, inventory stock, or category."
					})] }), editProductTarget && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "ep-name",
									children: "Piece Name *"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "ep-name",
									value: editProductTarget.name,
									onChange: (e) => setEditProductTarget((prev) => prev ? {
										...prev,
										name: e.target.value
									} : null),
									placeholder: "e.g. Heavyweight Boxy Hoodie"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "ep-category",
									children: "Category *"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									id: "ep-category",
									value: editProductTarget.category,
									onChange: (e) => setEditProductTarget((prev) => prev ? {
										...prev,
										category: e.target.value
									} : null),
									className: "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-xs uppercase font-medium",
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
									htmlFor: "ep-price",
									className: "text-xs uppercase tracking-wider font-semibold",
									children: "PRICE IN NAIRA (LEAVE EMPTY FOR “PRICE ON REQUEST”)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative flex items-center border border-border bg-background focus-within:ring-1 focus-within:ring-ring",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "pl-4 pr-2 text-base font-bold text-foreground select-none",
										children: "₦"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										id: "ep-price",
										type: "text",
										inputMode: "numeric",
										placeholder: "456,666",
										value: editProductTarget.price ? Number(editProductTarget.price).toLocaleString("en-US") : "",
										onChange: (e) => {
											const raw = e.target.value.replace(/[^0-9]/g, "");
											setEditProductTarget((prev) => prev ? {
												...prev,
												price: raw
											} : null);
										},
										className: "h-12 w-full bg-transparent pr-4 text-base font-semibold text-foreground outline-none placeholder:text-muted-foreground/40"
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "ep-stock",
									children: "Units in Stock *"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "ep-stock",
									type: "number",
									min: "0",
									step: "1",
									value: editProductTarget.stock,
									onChange: (e) => setEditProductTarget((prev) => prev ? {
										...prev,
										stock: e.target.value
									} : null),
									placeholder: "e.g. 10"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "ep-specs",
									children: "Specifications & Sizing Details"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "ep-specs",
									value: editProductTarget.specifications,
									onChange: (e) => setEditProductTarget((prev) => prev ? {
										...prev,
										specifications: e.target.value
									} : null),
									placeholder: "e.g. 100% Combed Cotton, 400 GSM"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "ep-desc",
									children: "Product Description"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									id: "ep-desc",
									rows: 3,
									value: editProductTarget.description,
									onChange: (e) => setEditProductTarget((prev) => prev ? {
										...prev,
										description: e.target.value
									} : null),
									placeholder: "Provide details on fabric, silhouette, etc."
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-end gap-2 pt-2 border-t border-border",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									variant: "outline",
									onClick: () => setEditProductTarget(null),
									disabled: updateProduct.isPending,
									className: "text-xs uppercase tracking-wider",
									children: "Cancel"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									onClick: () => {
										if (editProductTarget) updateProduct.mutate(editProductTarget);
									},
									disabled: updateProduct.isPending,
									className: "text-xs uppercase tracking-wider",
									children: updateProduct.isPending ? "Saving Piece…" : "Save Changes"
								})]
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileDialog, {
				open: profileDialogOpen,
				onOpenChange: setProfileDialogOpen
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!receiptPreviewModal,
				onOpenChange: (open) => {
					if (!open) setReceiptPreviewModal(null);
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-w-3xl max-h-[90vh] overflow-y-auto bg-surface border-border text-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
						className: "text-xl font-serif",
						children: "Customer Payment Receipt"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, {
						className: "text-xs text-muted-foreground",
						children: [
							"Order Reference:",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
								className: "text-foreground font-mono",
								children: receiptPreviewModal?.reference
							}),
							" ",
							"· Customer:",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
								className: "text-foreground",
								children: receiptPreviewModal?.customerName
							})
						]
					})] }), receiptPreviewModal && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4 pt-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "border border-border bg-background/80 rounded p-2 flex items-center justify-center min-h-[300px]",
							children: receiptPreviewModal.isPdf ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
								src: receiptPreviewModal.url,
								title: "Receipt PDF",
								className: "w-full h-[500px] rounded border border-border"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: receiptPreviewModal.url,
								alt: "Customer Transfer Receipt",
								className: "max-h-[550px] w-auto max-w-full object-contain rounded shadow-md"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-muted-foreground truncate max-w-xs font-mono",
								children: receiptPreviewModal.fileName
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									href: receiptPreviewModal.url,
									target: "_blank",
									rel: "noopener noreferrer",
									className: "inline-flex items-center gap-1.5 border border-border px-3 py-2 text-xs uppercase tracking-wider text-foreground hover:bg-border transition-colors",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "size-3.5" }), "Open in New Tab"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									variant: "outline",
									onClick: () => setReceiptPreviewModal(null),
									className: "text-xs uppercase tracking-wider",
									children: "Close"
								})]
							})]
						})]
					})]
				})
			})
		]
	});
}
//#endregion
export { AdminPage as component };
