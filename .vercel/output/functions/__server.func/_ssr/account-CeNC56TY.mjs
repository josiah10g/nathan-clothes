import { r as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Button } from "./button-cHXlBU3y.mjs";
import { g as useNavigate, h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as supabase } from "./client-tCXTp6li.mjs";
import { n as useAuth } from "./useAuth-C_0aa20U.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-CCJRliUM.mjs";
import { n as formatPrice, t as formatDate } from "./format-JcwKzGtU.mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { C as CircleCheckBig, b as Clock, n as User, u as Package, v as CreditCard, w as CircleAlert } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/account-CeNC56TY.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AccountPage() {
	const { user, isAdmin, loading, signOut } = useAuth();
	const navigate = useNavigate();
	const qc = useQueryClient();
	(0, import_react.useEffect)(() => {
		if (!loading && user && isAdmin) navigate({
			to: "/admin",
			replace: true
		});
	}, [
		user,
		isAdmin,
		loading,
		navigate
	]);
	(0, import_react.useEffect)(() => {
		if (!user) return;
		const channel = supabase.channel(`customer-orders-${user.id}`).on("postgres_changes", {
			event: "*",
			schema: "public",
			table: "orders",
			filter: `user_id=eq.${user.id}`
		}, () => {
			qc.invalidateQueries({ queryKey: ["my-orders", user.id] });
		}).subscribe();
		return () => {
			supabase.removeChannel(channel);
		};
	}, [user, qc]);
	const displayName = user?.user_metadata?.["full_name"] || user?.email?.split("@")[0] || "Customer";
	const { data: myOrders, isLoading: loadingMyOrders } = useQuery({
		queryKey: ["my-orders", user?.id],
		enabled: !!user,
		queryFn: async () => {
			const { data, error } = await supabase.from("orders").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
			if (error) throw error;
			return data ?? [];
		}
	});
	const ordersList = myOrders || [];
	const confirmedPayments = ordersList.filter((o) => o.payment_status === "approved" || o.status === "paid" || o.status === "completed");
	const renderPaymentBadge = (status) => {
		switch (status) {
			case "approved":
			case "paid":
			case "completed": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
				className: "bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 uppercase tracking-[0.15em] flex items-center gap-1 text-[11px]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheckBig, { className: "size-3" }), " Confirmed"]
			});
			case "declined": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
				className: "bg-destructive/20 text-destructive border border-destructive/30 uppercase tracking-[0.15em] flex items-center gap-1 text-[11px]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "size-3" }), " Action Required"]
			});
			default: return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
				className: "bg-amber-600/20 text-amber-400 border border-amber-500/30 uppercase tracking-[0.15em] flex items-center gap-1 text-[11px]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-3" }), " Under Review"]
			});
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8",
		children: !user ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "border border-border bg-surface p-8 text-center sm:p-14 max-w-xl mx-auto my-12",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "size-6" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-2xl font-bold uppercase tracking-wide",
					children: "Sign in to your Dashboard"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm text-muted-foreground leading-relaxed",
					children: "Sign in with your registered account to view your live orders, verify bank transfer payments, and manage your profile."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 flex justify-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/auth",
						search: {
							mode: "signin",
							redirect: "/account"
						},
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							className: "text-xs uppercase tracking-[0.25em] px-6",
							children: "Log In"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/auth",
						search: {
							mode: "signup",
							redirect: "/account"
						},
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							className: "text-xs uppercase tracking-[0.25em] px-6",
							children: "Create Account"
						})
					})]
				})
			]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "border-b border-border pb-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "inline-block rounded-full bg-secondary px-3 py-1 text-[11px] font-medium tracking-wide text-secondary-foreground mb-4",
				children: "Customer Portal"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap items-baseline justify-between gap-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
					className: "text-4xl sm:text-5xl font-serif font-bold tracking-tight text-foreground",
					children: [
						"Welcome, ",
						displayName,
						"!"
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground max-w-2xl",
					children: "Track your order statuses, verify bank transfer payments, and contact support anytime."
				})] })
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
			defaultValue: "orders",
			className: "mt-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
					className: "h-11 bg-transparent p-0 border-b border-border w-full justify-start rounded-none gap-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
						value: "orders",
						className: "relative rounded-none border-b-2 border-transparent px-2 pb-3 pt-2 text-sm font-medium tracking-wide text-muted-foreground data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							"Orders (",
							ordersList.length,
							")"
						] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
						value: "payments",
						className: "relative rounded-none border-b-2 border-transparent px-2 pb-3 pt-2 text-sm font-medium tracking-wide text-muted-foreground data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreditCard, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							"Payments (",
							confirmedPayments.length,
							" Confirmed)"
						] })]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
					value: "orders",
					className: "mt-8 space-y-6",
					children: [
						loadingMyOrders && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "p-12 text-center text-sm text-muted-foreground",
							children: "Loading your orders…"
						}),
						!loadingMyOrders && ordersList.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "border border-border/80 bg-surface/40 p-12 sm:p-16 text-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mx-auto mb-4 flex size-14 items-center justify-center text-muted-foreground/50",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "size-10 stroke-1" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-xl font-serif font-bold text-foreground",
									children: "No orders placed yet"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed",
									children: "Explore our catalog of heavyweight monochrome streetwear, hoodies, tees, and accessories to submit your first order."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-6",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/shop",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											className: "bg-foreground text-background hover:bg-foreground/90 text-xs uppercase tracking-[0.2em] px-6 h-11",
											children: "Browse Shop"
										})
									})
								})
							]
						}),
						ordersList.map((ord) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
							className: "border border-border bg-surface p-6 sm:p-8 space-y-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-mono text-sm font-bold text-foreground",
											children: ord.reference || `ORD-${ord.id.slice(0, 8)}`
										}), renderPaymentBadge(ord.payment_status || ord.status)]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs text-muted-foreground mt-1",
										children: ["Placed on ", formatDate(ord.created_at)]
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-right",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-bold text-foreground text-lg",
											children: formatPrice(ord.total_cents || Math.round(Number(ord.total || 0) * 100))
										})
									})]
								}),
								ord.admin_note && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "border border-primary/30 bg-primary/5 p-3 text-xs leading-relaxed",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
											className: "text-foreground",
											children: "Store Update:"
										}),
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: ord.admin_note
										})
									]
								}),
								ord.address && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-xs text-muted-foreground",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "uppercase tracking-wider font-semibold text-foreground",
											children: "Delivery:"
										}),
										" ",
										ord.address
									]
								}),
								Array.isArray(ord.items) && ord.items.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "border-t border-border pt-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3 font-semibold",
										children: "Ordered Items"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
										className: "divide-y divide-border/60",
										children: ord.items.map((it, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
											className: "py-2.5 flex items-center justify-between text-xs",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-3",
												children: [it.imageUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
													src: it.imageUrl,
													alt: it.name,
													className: "size-11 object-cover bg-background border border-border"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "font-medium text-foreground",
													children: it.name
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "text-[11px] text-muted-foreground uppercase",
													children: [
														"Size ",
														it.size,
														" × ",
														it.quantity
													]
												})] })]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-medium text-foreground",
												children: formatPrice((it.priceCents || Math.round(Number(it.price || 0) * 100)) * it.quantity)
											})]
										}, idx))
									})]
								})
							]
						}, ord.id))
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "payments",
					className: "mt-8 space-y-6",
					children: ordersList.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border border-border/80 bg-surface/40 p-12 text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreditCard, { className: "mx-auto size-10 text-muted-foreground/50 stroke-1 mb-3" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-medium text-foreground",
								children: "No payments recorded"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground mt-1",
								children: "When you place an order and submit your bank transfer receipt, status updates will appear here."
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "overflow-x-auto border border-border bg-surface",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "w-full text-left text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-b border-border text-xs uppercase tracking-[0.2em] text-muted-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "p-4",
										children: "Order Ref"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "p-4",
										children: "Date"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "p-4",
										children: "Amount"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "p-4",
										children: "Payment Status"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "p-4",
										children: "Receipt"
									})
								]
							}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
								className: "divide-y divide-border text-xs",
								children: ordersList.map((ord) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: "hover:bg-background/40",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "p-4 font-mono font-medium text-foreground",
											children: ord.reference || `ORD-${ord.id.slice(0, 8)}`
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "p-4 text-muted-foreground",
											children: formatDate(ord.created_at)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "p-4 font-semibold text-foreground",
											children: formatPrice(ord.total_cents || Math.round(Number(ord.total || 0) * 100))
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "p-4",
											children: renderPaymentBadge(ord.payment_status || ord.status)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "p-4 text-muted-foreground",
											children: ord.receipt_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-emerald-400 font-medium",
												children: "Receipt Submitted"
											}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted-foreground",
												children: "Not uploaded"
											})
										})
									]
								}, ord.id))
							})]
						})
					})
				})
			]
		})] })
	});
}
//#endregion
export { AccountPage as component };
